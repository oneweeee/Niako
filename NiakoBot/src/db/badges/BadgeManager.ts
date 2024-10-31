import { BadgeSchema, IBadge, TBadge, TBadges } from "./BadgeSchema";
import { Collection } from "discord.js";
import Mongoose from "../Mongoose";

export default class BadgeManager {
    private readonly cache: Collection<string, TBadge> = new Collection()
    public readonly partners: Set<string> = new Set()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for( let i = 0; array.length > i; i++ ) {
            const doc = array[i]

            if(doc.type === 'Guild') {
                const guild = this.db.client.guilds.cache.get(doc.guildId)
                if(guild) {
                    this.addGuildCache(doc)
                }
            } else {
                this.cache.set(`${doc.userId}.${doc.badge}`, doc)
            }
        }
    }

    async array(cache: boolean = false) {
        return cache ? this.cache.map((g) => g) : (await BadgeSchema.find())
    }

    async filterUser(userId: string, force: boolean = false) {
        if(force) {
            return (await BadgeSchema.find({ userId, type: 'User' }))
        }

        return this.cache.filter((v, k) => k.startsWith(userId)).map((v) => v)
    }

    async filterGuild(guildId: string, force: boolean = false) {
        if(force) {
            return (await BadgeSchema.find({ guildId, type: 'Guild' }))
        }
        
        return this.cache.filter((v, k) => k.startsWith(guildId)).map((v: TBadge) => v)
    }

    async get(id: string, badge: TBadges, type?: 'Guild' | 'User') {
        if(this.cache.has(`${id}.${badge}`)) {
            return this.cache.get(`${id}.${badge}`)!
        } else {
            if(type) {
                if(type === 'Guild') {
                    return (await BadgeSchema.findOne({ guildId: id, badge, type }))
                } else {
                    return (await BadgeSchema.findOne({ userId: id, badge, type }))
                }
            }
        }
    }

    async create(options: IBadge) {
        const doc = await BadgeSchema.create({ ...options })
        return (await this.save(doc))
    }

    async save(doc: TBadge) {
        const saved = await doc.save()
        this.cache.set(`${doc.type === 'Guild' ? doc.guildId : doc.userId}`, saved)
        return saved
    }

    async remove(id: string, badge: TBadges, type: 'Guild' | 'User') {
        const doc = await this.get(id, badge, type)
        if(doc) {
            this.removeCache(doc)
            await doc.remove()
        }
    }

    removeCache(doc: TBadge) {
        if(!doc?.guildId) return
        
        if(this.cache.has(`${doc.userId}.${doc.badge}`)) {
            this.cache.delete(`${doc.userId}.${doc.badge}`)
        }

        if(this.partners.has(doc.guildId)) {
            this.partners.delete(doc.guildId)
        }
    }

    addGuildCache(doc: TBadge) {
        if(doc.badge === 'NiakoPartner') this.partners.add(doc.guildId)
        this.cache.set(`${doc.guildId}.${doc.badge}`, doc)
    }
}