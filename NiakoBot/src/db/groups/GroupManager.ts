import { GroupSchema, TGroup } from "./GroupSchema";
import { Collection, Guild } from "discord.js";
import Mongoose from "../Mongoose";

export default class GroupManager {
    private readonly cache: Collection<string, TGroup> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            if(doc.channelId !== '0') {
                const guild = this.db.client.guilds.cache.get(doc.guildId)
                if(guild) {
                    const channel = guild.channels.cache.get(doc.channelId)
                    if(channel) {
                        this.cache.set(`${doc.guildId}.${doc.userId}.${doc.channelId}`, doc)
                    }
                }
            }
        }
    }

    async array(cache: boolean = false, options: { guildId?: string } = {}) {
        return cache ? this.cache.map((g) => g) : (await GroupSchema.find(options))
    }

    async findOne(guildId: string, userId: string, channelId: string) {
        const find = await GroupSchema.findOne({ guildId, userId, channelId })
        if(find) {
            this.cache.set(`${guildId}.${userId}.${channelId}`, find)
            return find
        } else {
            return (await this.create(guildId, userId, channelId))
        }
    }

    async get(guildId: string, userId: string, channelId: string) {
        const key = `${guildId}.${userId}.${channelId}`
        if(this.cache.has(key)) {
            return this.cache.get(key)!
        } else {
            return (await GroupSchema.findOne({ guildId, userId }) ?? await this.create(guildId, userId, channelId))
        }
    }

    async create(guildId: string, userId: string, channelId: string) {
        const doc = await GroupSchema.create({ guildId, userId, channelId })
        return (await this.save(doc))
    }

    async save(doc: TGroup) {
        const saved = await doc.save()
        this.cache.set(`${saved.guildId}.${saved.userId}.${saved.channelId}`, saved)
        return saved
    }

    async remove(doc: TGroup, guild?: Guild) {
        if(this.cache.has(`${doc.guildId}.${doc.userId}.${doc.channelId}`)) {
            this.cache.delete(`${doc.guildId}.${doc.userId}.${doc.channelId}`)
        }

        if(guild) {
            const channel = guild.channels.cache.get(doc.channelId)
            if(channel) await channel.delete().catch(() => {})
        }

        await doc.remove().catch(() => {})
    }

    async removeGuildGroups(guildId: string) {
        const array = await this.array(false, { guildId })
        for ( let i = 0; array.length > i; i++ ) {
            await this.remove(array[i])
        }
    }

    async getChannel(channelId: string) {
        return (await GroupSchema.findOne({ channelId }))
    }

    async getCode(code: string, guildId: string) {
        return (await GroupSchema.findOne({ guildId, code }))
    }

    async getMessage(messageId: string) {
        return (await GroupSchema.findOne({ messageId }))
    }
}