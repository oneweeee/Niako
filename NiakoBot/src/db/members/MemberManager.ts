import { MemberSchema, TMember } from "./MemberSchema";
import { Collection } from "discord.js";
import Mongoose from "../Mongoose";

export default class MemberManager {
    private readonly cache: Collection<string, TMember> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            const guild = this.db.client.guilds.cache.get(doc.guildId)
            if(guild) {
                const member = guild.members.cache.get(doc.userId)
                if(member) {
                    this.cache.set(`${guild.id}.${member.id}`, doc)
                }
            }
        }
    }

    async array(cache: boolean = false) {
        return cache ? this.cache.map((m) => m) : await MemberSchema.find()
    }

    async filter(options: { guildId?: string }, cache: boolean = false) {
        if(cache) {
            return this.cache.filter((m) => {
                if(options.guildId) {
                    return m.guildId === options.guildId
                }
            }).map((m) => m)
        } else {
            return (await MemberSchema.find(options))
        }
    }

    async findOne(guildId: string, userId: string) {
        const get = (await MemberSchema.findOne({ guildId, userId }))
        if(get) {
            this.cache.set(`${get.guildId}.${get.userId}`, get)
            return get
        } else return get
    }

    async find(guildId: string, userId: string) {
        const get = (await MemberSchema.findOne({ guildId, userId }))
        if(get) {
            this.cache.set(`${get.guildId}.${get.userId}`, get)
            return get
        } else {
            return (await this.create(guildId, userId))
        }
    }

    async get(guildId: string, userId: string) {
        const get = this.cache.get(`${guildId}.${userId}`)
        if(get) {
            return get
        } else {
            return (await this.find(guildId, userId))
        }
    }

    async create(guildId: string, userId: string) {
        const doc = await MemberSchema.create({ guildId, userId })
        return (await doc.save())
    }

    async save(doc: TMember) {
        const saved = await doc.save().catch(() => null)
        if(saved) {
            this.cache.set(`${saved.guildId}.${saved.userId}`, saved)
        }

        return saved
    }
}