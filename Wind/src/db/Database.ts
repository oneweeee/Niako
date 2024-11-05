import GuildMemberManager from "./guild_members/GuildMemberManager"
import PlaylistManager from "./playlists/PlaylistManager"
import AccountManager from "./accounts/AccountManager"
import BackupManager from "./backups/BackupManager"
import AuditManager from "./audit/AuditManager"
import GuildManager from "./guild/GuildManager"
import CrashManager from "./crash/CrashManager"
import RaidManager from "./raid/RaidManager"
import { Collection } from "discord.js"
import WindClient from "#client"
import mongoose from "mongoose"

export default class Database {
    constructor(
        public client: WindClient
    ) {
        this.guildMembers = new GuildMemberManager(client)
        this.playlists = new PlaylistManager(client)
        this.accounts = new AccountManager(client)
        this.backups = new BackupManager(client)
        this.guilds = new GuildManager(client)
        this.audits = new AuditManager(client)
        this.crashs = new CrashManager(client)
        this.raids = new RaidManager(client)
    }

    public ping: number = -1
    public skips: Collection<string, number> = new Collection()

    async connect() {
        mongoose.set('strictQuery', false)

        await mongoose.connect(
            (
                this.client.config.debug ? this.client.config.debugInternal : this.client.config.internal
            ).mongoUrl
        )

        setInterval(async () => await this.getPing(), 300_000)

        return this.getPing()
    }

    async getPing() {
        const ping = await mongoose.connection.db.admin().ping()
        if(ping?.ok) {
            this.ping = ping.ok
        }
    }

    public guildMembers: GuildMemberManager
    public playlists: PlaylistManager
    public accounts: AccountManager
    public backups: BackupManager
    public guilds: GuildManager
    public audits: AuditManager
    public crashs: CrashManager
    public raids: RaidManager

    async init() {
        const promised = await Promise.all([
            this.guildMembers.init(),
            this.backups.init(),
            this.guilds.init(),
            this.audits.init(),
            this.crashs.init(),
            this.raids.init()
        ])
        return promised
    }
}