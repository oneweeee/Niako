import RaidSchema, { TRaid } from './RaidSchema'
import { Collection } from 'discord.js'
import WindClient from '#client'

export default class RaidManager {
    private readonly cache: Collection<string, TRaid> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const docs = await this.array()
        for ( let i = 0; docs.length > i; i++ ) {
            const guild = this.client.guilds.cache.get(docs[i].guildId)
            if(guild) {}
        }
    }

    async array(cache: boolean = false, options: {} = {}) {
        if(cache) {
            if(Object.keys(options).length > 0) {
                return this.cache.map((c) => c).filter((c) => c)
            }

            return this.cache.map((c) => c)
        } else {
            return (await RaidSchema.find(options))
        }
    }

    async get(guildId: string) {
        if(this.cache.has(guildId)) {
            return this.cache.get(guildId)!
        } else {
            return (await this.find(guildId))
        }
    }

    async find(guildId: string) {
        const doc = await RaidSchema.findOne({ guildId })
        if(doc) {
            this.cache.set(doc.guildId, doc)
            return doc
        } else {
            return (await this.create(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await RaidSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(res: TRaid) {
        const saved = await res.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async remove(res: TRaid) {
        if(this.cache.has(res.guildId)) {
            this.cache.delete(res.guildId)
        }

        const obj = res.toObject()
        await res.deleteOne()

        return obj
    }
}