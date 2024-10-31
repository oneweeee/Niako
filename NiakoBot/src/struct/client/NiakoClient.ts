import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import WebSocketManager from "../managers/WebSocketManager";
import DiscordStorage from "../discord.js/DiscordStorage";
import LanguageManager from "../managers/LanguageManager";
import CooldownManager from "../managers/CooldownManager";
import ConstantManager from "../managers/ConstantManager";
import ReactionManager from "../managers/ReactionManager";
import RequestManager from "../managers/RequestManager";
import { Client, Options, Partials } from "discord.js";
import VoiceManager from "../managers/VoiceManager";
import { DiscordTogether } from "discord-together";
import CanvasClient from "../canvas/CanvasClient";
import Mongoose from "../../db/Mongoose";
import icons from "../../settings/icons";
import emoji from "../../settings/emoji";
import NiakoPlayer from "./NiakoPlayer";
import NiakoLogger from "./NiakoLogger";
import * as config from "../../config";
import NiakoUtil from "./NiakoUtil";
import { P2p } from "qiwi-sdk";

export class NiakoClient extends Client<true> {
    public readonly config = {
        ...config,
        emojis: emoji,
        icons: icons
    }
    
    constructor() {
        super(
            {
                intents: config.intents,
                shards: getInfo().SHARD_LIST,
                shardCount: getInfo().TOTAL_SHARDS,
                partials: [ Partials.GuildMember, Partials.Channel, Partials.User ],
                allowedMentions: {
                    parse: ['roles', 'users'],
                    repliedUser: true,
                },
                /*makeCache: Options.cacheWithLimits({
                    ...Options.DefaultMakeCacheSettings,
                    MessageManager: {
                        maxSize: 10,
                        keepOverLimit: message => message.author.id === this.user.id,
                    },
                    ReactionManager: 0,
                    GuildTextThreadManager: 0,
                    GuildBanManager: 0,
                    DMMessageManager: 0,
                    GuildForumThreadManager: 0,
                    GuildInviteManager: 0,
                    GuildScheduledEventManager: 0,
                    ReactionUserManager: 0,
                    StageInstanceManager: 0,
                    AutoModerationRuleManager: 0,
                    ApplicationCommandManager: 0,
                    ThreadMemberManager: 0,
                    GuildMemberManager: {
                        maxSize: Infinity,
                        keepOverLimit: member => Boolean(member?.voice?.channelId || member.permissions.has('Administrator') || member.roles.cache.size >= 1)
                    },
                    PresenceManager: {
                        keepOverLimit: presence => !['invisible', 'offline'].includes(presence.status) && !presence?.member?.user?.bot
                    },
                    ThreadManager: {
                        maxSize: 100,
                        keepOverLimit: thread => thread.type === ChannelType.PrivateThread
                    }
                }),
                sweepers: {
                    ...Options.DefaultSweeperSettings,
                    messages: {
                        interval: 1_800,
                        lifetime: 1_800
                    },
                    guildMembers: {
                        interval: 1_800,
                        filter: () => member => !member?.voice?.channelId && !member.permissions.has('Administrator')
                    },
                    users: {
                        interval: 1_800,
                        filter: () => user => user.id !== user.client.user.id
                    },
                    threadMembers: {
                        interval: 1_800,
                        filter: () => () => true
                    },
                    threads: {
                        interval: 1_800,
                        filter: () => thread => thread.type !== ChannelType.PrivateThread
                    },
                    presences: {
                        interval: 1_800,
                        filter: () => () => true
                    }
                }*/
                sweepers: {
                    ...Options.DefaultSweeperSettings
                },
                makeCache: Options.cacheWithLimits({
                    ...Options.DefaultMakeCacheSettings,
                    MessageManager: {
                        maxSize: 10,
                        keepOverLimit: message => message.author.id === this.user.id,
                    },
                    GuildMemberManager: {
                        maxSize: Infinity,
                        keepOverLimit: member => Boolean(member?.voice?.channelId || member.permissions.has('Administrator') || member.user.id === this.user.id)
                    },
                    ReactionManager: 0,
                    GuildTextThreadManager: 0,
                    GuildBanManager: 0,
                    DMMessageManager: 0,
                    GuildForumThreadManager: 0,
                    GuildInviteManager: 0,
                    GuildScheduledEventManager: 0,
                    ReactionUserManager: 0,
                    //PresenceManager: 0,
                    StageInstanceManager: 0,
                    AutoModerationRuleManager: 0,
                    ApplicationCommandManager: 0,
                    ThreadMemberManager: 0
                })
            }
        )
    }

    public readonly managers: { ws: WebSocketManager } = {
        ws: new WebSocketManager(this)
    }

    public cluster = new ClusterClient(this)
    public constants = new ConstantManager()

    public storage = new DiscordStorage(this)
    public player = new NiakoPlayer(this)
    public logger = new NiakoLogger()

    public voiceManager = new VoiceManager(this)
    public reactions = new ReactionManager(this)
    public cooldown = new CooldownManager(this)
    public request = new RequestManager(this)
    public lang = new LanguageManager(this)

    public canvas = new CanvasClient(this)
    public util = new NiakoUtil(this)
    
    public db = new Mongoose(this)

    public together = new DiscordTogether(this)
    public qiwi = new P2p(config.qiwi)

    async start() {
        await this.db.connect()
        await this.canvas.init()
        await this.reactions.init()

        await this.reload()

        this.login(config.debug ? config.debugToken : config.token)
    }

    async reload() {
        await Promise.all([
            this.storage.slashCommands.load(),
            this.storage.channelMenus.load(),
            this.storage.stringMenus.load(),
            this.storage.userMenus.load(),
            this.storage.buttons.load(),
            this.storage.modals.load(),
            this.storage.events.load()
        ])

        this.constants.init()
    }
}