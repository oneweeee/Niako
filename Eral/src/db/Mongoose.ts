import { Collection } from "discord.js";
import TicketManager from "./tickets/TicketManager";
import HistoryManager from "./history/HistoryManager";
import GuildManager from "./guilds/GuildManager";
import RoleManager from "./roles/RoleManager";
import Client from "../struct/client/Client";
import mongoose from "mongoose";

export default class Mongoose {
    public inited: boolean = false
    public appeal: Set<string> = new Set()

    constructor(
        public client: Client
    ) {}

    public history: HistoryManager = new HistoryManager(this)
    public tickets: TicketManager = new TicketManager(this)
    public guilds: GuildManager = new GuildManager(this)
    public role: RoleManager = new RoleManager(this)

    public set: Collection<string, number> = new Collection()

    async connect() {
        mongoose.set('strictQuery', false)
        await mongoose.connect(this.client.config.mongoUrl, { autoIndex: true })
        this.client.logger.success('Database MongoDB is inited!')
    }

    async init() {
        await Promise.all([
            await this.history.init(),
            await this.tickets.init(),
            await this.guilds.init()
        ])
        return (this.inited = true)
    }
}