import { Client, Partials } from "discord.js";
import DiscordStorage from "../discord.js/DiscordStorage";
import VoiceManager from "../managers/VoiceManager";
import CanvasClient from "../canvas/CanvasClient";
import Mongoose from "../../db/Mongoose";
import ClientLogger from "./ClientLogger";
import * as config from "../../config";
import ClientUtil from "./ClientUtil";
import AntispamManager from "../managers/AntispamManager";
import TemplateManager from "../managers/TemplateManagerV2";

export default class extends Client<true> {
    readonly config = config
    
    constructor() {
        super(
            {
                intents: config.intents,
                partials: [ Partials.GuildMember, Partials.Channel, Partials.User ],
                allowedMentions: {
                    parse: ['roles', 'users'],
                    repliedUser: true,
                }
            }
        )
    }

    public template = new TemplateManager(this)

    public storage = new DiscordStorage(this)
    public logger = new ClientLogger()

    public antispamManager = new AntispamManager(this)
    public voiceManager = new VoiceManager(this)

    public canvas = new CanvasClient(this)
    public util = new ClientUtil(this)
    
    public db = new Mongoose(this)

    async start() {
        await this.db.connect()
        await this.canvas.init()
        
        this.reload()
        this.login(config.token)
    }

    reload() {
        this.storage.slashCommands.load()
        this.storage.channelMenus.load()
        this.storage.stringMenus.load()
        this.storage.userMenus.load()
        this.storage.buttons.load()
        this.storage.modals.load()
        this.storage.events.load()
    }
}