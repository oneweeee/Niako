import ModuleBannerManager from "./module_banner/ModuleBannerManager";
import ModuleVoiceManager from "./module_voice/ModuleVoiceManager";
import ModuleAuditManager from "./module_audit/ModuleAuditManager";
import ModuleGroupManager from "./module_group/ModuleGroupManager";
import { NiakoClient } from "../struct/client/NiakoClient";
import AccountManager from "./accounts/AccountManager";
import MemberManager from "./members/MemberManager";
import BackupManager from "./backups/BackupManager";
import GroupManager from "./groups/GroupManager";
import BoostManager from "./boosts/BoostManager";
import BadgeManager from "./badges/BadgeManager";
import QueueManager from "./queue/QueueManager";
import RoomManager from "./rooms/RoomManager";
import mongoose from "mongoose";

export default class Mongoose {
    public inited: boolean = false
    public ping: number = -1

    constructor(
        public client: NiakoClient
    ) {}

    public modules: {
        group: ModuleGroupManager,
        voice: ModuleVoiceManager,
        audit: ModuleAuditManager,
        banner: ModuleBannerManager
    } = {
        group: new ModuleGroupManager(this),
        voice: new ModuleVoiceManager(this),
        audit: new ModuleAuditManager(this),
        banner: new ModuleBannerManager(this)
    }

    public accounts: AccountManager = new AccountManager(this)
    public members: MemberManager = new MemberManager(this)
    public backups: BackupManager = new BackupManager(this)
    public boosts: BoostManager = new BoostManager(this)
    public queues: QueueManager = new QueueManager(this)
    public badges: BadgeManager = new BadgeManager(this)
    public groups: GroupManager = new GroupManager(this)
    public rooms: RoomManager = new RoomManager(this)

    async connect() {
        mongoose.set('strictQuery', false)
        await mongoose.connect(
            this.client.config.debug ? this.client.config.debugMongoUrl : this.client.config.mongoUrl,
            { autoIndex: true }
        )

        setInterval(async () => await this.getPing(), 300_000)

        return this.getPing()
    }

    private async getPing() {
        const ping = await mongoose.connection.db.admin().ping()
        if(ping?.ok) {
            this.ping = ping.ok
        }
    }

    async init() {
        await Promise.all([
            this.modules.banner.init(),
            //this.modules.audit.init(),
            //this.modules.voice.init(),
            //this.modules.group.init(),
            //this.accounts.init(),
            //this.members.init(),
            this.boosts.init(),
            //this.queues.init(),
            this.badges.init(),
            //this.groups.init(),
            this.rooms.init()
        ])
        this.inited = true
        this.client.logger.success('Database MongoDB is inited!')
        return true
    }
}