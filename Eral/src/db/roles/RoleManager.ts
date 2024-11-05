import { Collection } from "discord.js";
import RoleSchema, { TRole } from "./RoleSchema";
import Mongoose from "../Mongoose";

export default class RoleManager {
    private readonly cache: Collection<string, TRole> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            this.cache.set(`${doc.guildId}.${doc.userId}`, doc)
        }
    }

    async array() {
        return (await RoleSchema.find())
    }

    async get(guildId: string, userId: string) {
        const get = this.cache.get(`${guildId}.${userId}`)
        if(get) {
            return get
        } else {
            return (await RoleSchema.findOne({ guildId, userId }) ?? await this.create(guildId, userId))
        }
    }

    async create(guildId: string, userId: string) {
        const doc = await RoleSchema.create({ guildId, userId })
        return this.save(doc)
    }

    async save(doc: TRole) {
        const saved = await doc.save()
        this.cache.set(`${saved.guildId}.${saved.userId}`, saved)
        return saved
    }
}