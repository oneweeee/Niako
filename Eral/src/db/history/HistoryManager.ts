import { Collection } from "discord.js";
import HistorySchema, { HistoryTypes, THistory } from "./HistorySchema";
import Mongoose from "../Mongoose";
import ms from "ms";

export default class HistoryManager {
    private readonly cache: Collection<string, THistory> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        setInterval(async () => await this.sweepers(), 180_000)
    }

    async array() {
        return (await HistorySchema.find())
    }

    async find(guildId: string, userId: string) {
        return (await HistorySchema.find({ guildId, userId })).sort((a, b) => b.createdTimestamp - a.createdTimestamp)
    }

    async create(guildId: string, userId: string, staffId: string, type: HistoryTypes, reason: string, time: string) {
        const doc = await HistorySchema.create({ guildId, userId, staffId, type, reason, time, end: Math.round(Date.now() + ms(time)),  })
        return this.save(doc)
    }

    async save(doc: THistory) {
        const saved = await doc.save()
        this.cache.set(`${saved.guildId}.${saved.userId}`, saved)
        return saved
    }

    async sweepers() {
        const array = (await HistorySchema.find({ state: true })).filter((h) => Date.now() > h.end)

        const guild = this.db.client.guilds.cache.get(this.db.client.config.meta.guildId)
        if(!guild) return this.db.client.logger.error('No have guild')

        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]

            const guild = this.db.client.guilds.cache.get(doc.guildId)
            if(guild) {
                const member = await guild.members.fetch(doc.userId).catch(() => null)
                if(member) {
                    if(doc.type === HistoryTypes.Ban && member.roles.cache.has(this.db.client.config.meta.banId)) {
                        await member.roles.remove(this.db.client.config.meta.banId).catch(() => {})
                    }
                }
            }

            doc.state = false
            await this.save(doc)
        }
    }
}