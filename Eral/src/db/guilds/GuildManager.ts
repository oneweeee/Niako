import { Collection } from "discord.js";
import GuildSchema, { TGuild } from "./GuildSchema";
import Mongoose from "../Mongoose";

export default class GuildManager {
    private readonly cache: Collection<string, TGuild> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            this.cache.set(doc.guildId, doc)
        }
    }

    async array(cache: boolean = false) {
        return cache ? this.cache.map((g) => g) : (await GuildSchema.find())
    }

    async get(guildId: string) {
        const get = this.cache.get(guildId)
        if(get) return get
        else {
            return (await GuildSchema.findOne({ guildId }) ?? await this.create(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await GuildSchema.create({ guildId })
        return this.save(doc)
    }

    async save(doc: TGuild) {
        const saved = await doc.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }
}