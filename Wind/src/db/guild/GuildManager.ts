import GuildSchema, { TGuild } from './GuildSchema'
import WindClient from '#client'
import {
    Collection,
    ColorResolvable,
    Guild,
    Locale
} from 'discord.js'

export default class GuildManager {
    private readonly locales: Collection<string, Locale> = new Collection()
    private readonly colors: Collection<string, ColorResolvable> = new Collection()
    private readonly cache: Collection<string, TGuild> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const docs = await this.array()
        for ( let i = 0; docs.length > i; i++ ) {
            const guild = this.client.guilds.cache.get(docs[i].guildId)
            if(guild) {
                if(docs[i]?.color) {
                    this.colors.set(docs[i].guildId, docs[i].color!)
                }

                if(docs[i]?.locale) {
                    this.locales.set(docs[i].guildId, docs[i].locale!)
                }
            }
        }
    }

    async array(cache: boolean = false, options: {} = {}) {
        if(cache) {
            if(Object.keys(options).length > 0) {
                return this.cache.map((c) => c).filter((c) => c)
            }

            return this.cache.map((c) => c)
        } else {
            return (await GuildSchema.find(options))
        }
    }

    getColor(guildId?: string) {
        if(guildId && this.colors.has(guildId)) {
            return this.colors.get(guildId)!
        }

        return this.client.config.Colors.Brand
    }

    getLocale(guild: Guild) {
        if(this.locales.has(guild.id)) {
            return this.locales.get(guild.id)!
        }

        return guild.preferredLocale
    }

    async get(guildId: string, locale: Locale) {
        if(this.cache.has(guildId)) {
            return this.cache.get(guildId)!
        } else {
            return (await this.find(guildId, locale))
        }
    }

    async find(guildId: string, locale: Locale) {
        const doc = await GuildSchema.findOne({ guildId })
        if(doc) {
            this.cache.set(doc.guildId, doc)
            if(doc.color) {
                this.colors.set(doc.guildId, doc.color)
            } else if(this.colors.has(doc.guildId)) {
                this.colors.delete(doc.guildId)
            }
            if(doc.locale) this.locales.set(doc.guildId, doc.locale)
            return doc
        } else {
            return (await this.create(guildId, locale))
        }
    }

    async create(guildId: string, locale: Locale) {
        const doc = await GuildSchema.create({ guildId, locale })
        return (await this.save(doc))
    }

    async save(res: TGuild) {
        const saved = await res.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async remove(res: TGuild) {
        if(this.cache.has(res.guildId)) {
            this.cache.delete(res.guildId)
        }

        const obj = res.toObject()
        await res.deleteOne()

        return obj
    }
}