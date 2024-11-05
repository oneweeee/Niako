import MessageCommandWatcher from "./watchers/MessageCommandWatcher"
import { ClusterClient, getInfo } from "discord-hybrid-sharding"
import SlashCommandWatcher from "./watchers/SlashCommandWatcher"
import * as ConstantService from "./services/ConstantService"
import StringMenuWatcher from "./watchers/StringMenuWatcher"
import WebSocketManager from "./managers/WebSocketManager"
import ComponentBuilder from "./builders/ComponentBuilder"
import CollectorBuilder from "./builders/CollectorBuilder"
import ListenerWatcher from "./watchers/ListenerWatcher"
import LangugeService from "./services/LanguageService"
import RequestManager from "./managers/RequestManager"
import ButtonWatcher from "./watchers/ButtonWatcher"
import InviteService from "./services/InviteService"
import EmbedBuilder from "./builders/EmbedBuilder"
import AuditManager from "./managers/AuditManager"
import VoiceManager from "./managers/VoiceManager"
import ModalWatcher from "./watchers/ModalWatcher"
import { Client, Options } from "discord.js"
import WindLogger from "./wind/WindLogger"
import WindPlayer from "./wind/WindPlayer"
import WindUtil from "./wind/WindUtil"
import icons from '../settings/icons'
import emoji from '../settings/emoji'
import Database from "#db/Database"
import * as config from "#config"
import fetch from 'node-fetch'

export default class WindClient extends Client<true> {
    public readonly config = config
    public readonly icons = icons
    public readonly emoji = emoji

    constructor() {
        super(
            {
                intents: config.intents,
                shards: getInfo().SHARD_LIST,
                shardCount: getInfo().TOTAL_SHARDS,
                sweepers: {
                    ...Options.DefaultSweeperSettings
                },
                makeCache: Options.cacheWithLimits({
                    ...Options.DefaultMakeCacheSettings,
                    ReactionManager: 0,
                    GuildTextThreadManager: 0,
                    GuildBanManager: 0,
                    GuildForumThreadManager: 0,
                    GuildInviteManager: 0,
                    GuildScheduledEventManager: 0,
                    ReactionUserManager: 0,
                    StageInstanceManager: 0,
                    AutoModerationRuleManager: 0
                })
            }
        )
    }

    public cluster = new ClusterClient(this)
    public player = new WindPlayer(this)
    public logger = new WindLogger()
    public util = new WindUtil(this)
    public db = new Database(this)

    public watchers = {
        modals: new ModalWatcher(this),
        buttons: new ButtonWatcher(this),
        listeners: new ListenerWatcher(this),
        stringMenus: new StringMenuWatcher(this),
        slashCommands: new SlashCommandWatcher(this),
        messageCommands: new MessageCommandWatcher(this)
    }
    public services = {
        lang: new LangugeService(),
        invites: new InviteService(this),
        constants: ConstantService.default
    }
    public managers = {
        request: new RequestManager(this),
        audit: new AuditManager(this),
        voice: new VoiceManager(this),
        ws: new WebSocketManager(this)
    }
    public storage = {
        embeds: new EmbedBuilder(this),
        collectors: new CollectorBuilder(),
        components: new ComponentBuilder(this)
    }

    async start() {
        await this.db.connect()
        
        this.reload()

        return this.login(
            (config.debug ? config.debugInternal : config.internal).token
        )
    }

    async setApplicationCommands() {
        return (await this.application.commands.set(
            this.watchers.slashCommands.cache.map((c) => ({ ...c.options, dmPermission: false }))
        ))
    }

    reload() {
        this.watchers.messageCommands.load()
        this.watchers.slashCommands.load()
        this.watchers.stringMenus.load()
        this.watchers.listeners.load()
        this.watchers.buttons.load()
        this.watchers.modals.load()
        
        this.services.lang.init()
    }

    async sendMonitoringStats() {
        const clusters = await this.cluster.broadcastEval(
            (client) => (
                {
                    guilds: client.guilds.cache.size,
                    shards: [...client.cluster.ids.keys()].length,
                    members: client.guilds.cache.reduce((n, g) => n + g.memberCount, 0)
                }
            )
        )

        const body = JSON.stringify(
            {
                servers: clusters.reduce((n, data) => data.guilds + n, 0),
                shards: clusters.reduce((n, data) => data.shards + n, 0),
                members: clusters.reduce((n, data) => data.members + n, 0)
            }
        )

        return Promise.all([
          /*fetch(`https://api.server-discord.com/v2/bots/${this.user.id}/stats`, {
                method: 'Post', headers: {
                    'Authorization': `SDC ${config.SdcToken}`,
                    'Content-Type': 'application/json'
                }, body
            }).catch(() => {}),*/

            fetch(`https://api.boticord.top/v3/bots/${this.user.id}/stats`, {
                method: 'Post', headers: {
                    'Authorization': config.BoticordToken,
                    'Content-Type': 'application/json'
                }, body
            }).catch(() => {})
        ])
    }
}