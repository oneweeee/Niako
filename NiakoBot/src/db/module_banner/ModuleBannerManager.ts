import ModuleBannerSchema, { IItemImage, IItemText, TModuleBanner } from "./ModuleBannerSchema";
import { Collection } from "discord.js";
import Mongoose from "../Mongoose";

export default class ModuleBannerManager {
    private readonly cache: Collection<string, TModuleBanner> = new Collection()
    private readonly updateBanner: Set<string> = new Set()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for( let i = 0; array.length > i; i++ ) {
            const guild = this.db.client.guilds.cache.get(array[i].guildId)
            if(guild && array[i].state) {
                this.cache.set(array[i].guildId, array[i])
            }
        }
    }

    itemsFilterImage(doc: TModuleBanner, forceNoDisable: boolean = false) {
        if(forceNoDisable) {
            return doc.items.filter((i) => ['Image', 'ActiveMemberAvatar'].includes(i.type) && !i.disabled)
        }

        return doc.items.filter((i) => ['Image', 'ActiveMemberAvatar'].includes(i.type))
    }

    itemsFilterText(doc: TModuleBanner, forceNoDisable: boolean = false) {
        if(forceNoDisable) {
            return doc.items.filter((i) => i.type === 'Text' && !i.disabled)
        }

        return doc.items.filter((i) => i.type === 'Text')
    }

    getText(doc: TModuleBanner, type: string, createdTimestamp: string | number) {
        return doc.items.find((i) => i.type === 'Text' && i.textType === type && i.createdTimestamp === Number(createdTimestamp)) as IItemText
    }
    
    getTextIndex(doc: TModuleBanner, type: string, createdTimestamp: string | number) {
        return doc.items.findIndex((i) => i.type === 'Text' && i.textType === type && i.createdTimestamp === Number(createdTimestamp))
    }

    getImage(doc: TModuleBanner, type: string, createdTimestamp: string | number) {
        return doc.items.find((i) => i.type === type && i.createdTimestamp === Number(createdTimestamp)) as IItemImage
    }
    
    getImageIndex(doc: TModuleBanner, type: string, createdTimestamp: string | number) {
        return doc.items.findIndex((i) => i.type === type && i.createdTimestamp === Number(createdTimestamp))
    }

    async array(cache: boolean = false, options: { state?: boolean } = {}) {
        return cache ? this.cache.map((g) => g) : (await ModuleBannerSchema.find(options))
    }

    async findOne(guildId: string) {
        const find = await ModuleBannerSchema.findOne({ guildId })
        if(find) {
            this.cache.set(find.guildId, find)
            return find
        } else {
            return (await this.create(guildId))
        }
    }

    async get(guildId: string) {
        if(this.cache.has(guildId)) {
            return this.cache.get(guildId)!
        } else {
            return (await this.findOne(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await ModuleBannerSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(doc: TModuleBanner) {
        const saved = await doc.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    resolveItems(items: any[], compressed: boolean = true) {
        return items.map((i) => {
            if(i.type === 'Image' || i.type === 'ActiveMemberAvatar') {
                i.height = Math.round(i.height*(compressed ? 0.5625 : 1.778))
            }
    
            if(i.type === 'Text') {
                i.size = Math.round(i.size*(compressed ? 0.5625 : 1.778))
            }
    
            if(typeof i.width === 'number') {
                i.width = Math.round(i.width*(compressed ? 0.5625 : 1.778))
            }
    
            return {
                ...i,
                x: Number((i.x*(compressed ? 0.5625 : 1.778)).toFixed(2)),
                y: Number((i.y*(compressed ? 0.5625 : 1.778)).toFixed(2))
            }
        })
    }

    addUpdateGuild(guildId: string) {
        if(!this.updateBanner.has(guildId)) {
            this.updateBanner.add(guildId)
        }
    }

    hasUpdateGuild(doc: TModuleBanner) {
        return (doc.items.some((t) => t.type === 'Text' && t.textType === 'Time') || this.updateBanner.has(doc.guildId))
    }
    
    removeUpdateBanner(guildId: string) {
        if(this.updateBanner.has(guildId)) {
            this.updateBanner.delete(guildId)
        }
    }
}