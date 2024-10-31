import BackupSchema, { ICreateBackupOptions, TBackup, TBackupType } from "./BackupSchema";
import { Collection, GuildMember } from "discord.js";
import Mongoose from "../Mongoose";

export default class BackupManager {
    private readonly cache: Collection<string, TBackup> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async getMemberBackups(member: GuildMember) {
        return [
            ...(await this.filter({ id: member.id, type: 'User' })),
            ...(await this.filter({ id: member.guild.id, type: 'Guild' }))
        ]
    }

    async filter(options: { id: string, type: TBackupType }) {
        return (await BackupSchema.find(options))
    }

    async get(_id: string) {
        return (await BackupSchema.findOne({ _id }))
    }
    
    async create(options: ICreateBackupOptions) {
        const doc = (await BackupSchema.create(options))
        return (await this.save(doc))
    }

    async save(doc: TBackup) {
        await doc.save()
        return doc
    }
}