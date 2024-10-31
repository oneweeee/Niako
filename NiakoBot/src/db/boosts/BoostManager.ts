import { BoostSchema } from "./BoostSchema";
import { Collection } from "discord.js";
import Mongoose from "../Mongoose";
import ms from "ms";

export default class BoostManager {
    public cache: Collection<string, number> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        if(!this.db.client.config.debug && this.db.client.guilds.cache.get(this.db.client.config.meta.supportGuildId)) {
            this.sweeper()
            this.autoAddRole()
        }

        setInterval(async () => {
            const array = await this.array()
            this.cache = new Collection<string, number>()
            for( let i = 0; array.length > i; i++ ) {
                const doc = array[i]
    
                const guild = this.db.client.guilds.cache.get(doc.guildId)
                if(guild) {
                    const count = this.cache.get(guild.id)
                    if(count) {
                        this.cache.set(guild.id, count+1)
                    } else {
                        this.cache.set(guild.id, 1)
                    }
                }
            }
        }, 3_600_000)
    }

    async update() {
        const arr = (await this.array())
        console.log(`Total: ${arr.length}`)
        for ( let i = 0; arr.length > i; i++ ) {
            console.log(i+1)
            const doc = arr[i]
            doc.end = Math.round(ms('31d') + Date.now())
            doc.new = false
            await doc.save()
        }
        console.log('Update docs')
    }

    async getUserSize() {
        const array = await this.array()

        let obj: { [key: string]: string } = {}

        for ( let i = 0; array.length > i; i++ ) {
            obj[array[i].userId] = '1'
        }

        return Object.keys(obj).length
    }

    private async array(options: { userId?: string, new?: boolean } = {}) {
        return (await BoostSchema.find(options))
    }

    async filter(filter: { userId?: string, guildId?: string, boosted?: boolean }) {
        return (await BoostSchema.find(filter))
    }

    async create(userId: string, gift: boolean = false) {
        const doc = await BoostSchema.create({ userId, new: true, gift })
        doc.end = Math.round(ms('31d') + Date.now())
        return (await doc.save())
    }
    
    async createMultiple(userId: string, count: number) {
        if(typeof count !== 'number') return
        
        for ( let i = 0; count > i; i++ ) {
            await this.create(userId)
        }

        return true
    }

    async getMemberBadge(userId: string) {
        const array = await this.filter({ userId, boosted: true })
        if(array.length === 0) return ''

        const first = array.sort((a, b) => a.boostedTimestamp - b.boostedTimestamp)[0]
        const month = Math.trunc((Date.now() - first.boostedTimestamp) / 60 / 60 / 24 / 7 / 30 / 1000)

        if(month >= 24) {
            return 'NiakoBoost_24Months'
        }

        switch(month) {
            case 0:
            case 1:
                return 'NiakoBoost_1Month'

            case 2:
                return 'NiakoBoost_2Months'

            case 3:
            case 4:
            case 5:        
                return 'NiakoBoost_3Months'

            case 6:
            case 7:
            case 8:
                return 'NiakoBoost_6Months'

            case 9:
            case 10:
            case 11:
                return 'NiakoBoost_9Months'

            case 12:
            case 13:
            case 14:
                return 'NiakoBoost_12Months'

            case 15:
            case 16:
            case 17:
                return 'NiakoBoost_15Months'

            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
                return 'NiakoBoost_18Months'

            default:
                return ''
        }
    }

    getMaxCountTextsOnBanner(guildId: string) {
        switch(this.getGuildLevelById(guildId)) {
            case 1:
                return { needLevel: 2, count: 5 }
            case 2:
                return { needLevel: 0, count: 10 }
            case 3:
                return { needLevel: 0, count: 10 }
            default:
                return { needLevel: 1, count: 3 }
        }
    }

    getMaxCountImagesOnBanner(guildId: string) {
        switch(this.getGuildLevelById(guildId)) {
            case 1:
                return { needLevel: 2, count: 2 }
            case 2:
                return { needLevel: 0, count: 3 }
            case 3:
                return { needLevel: 0, count: 3 }
            default:
                return { needLevel: 1, count: 1 }
        }
    }

    getMaxTimeUpdateBanner(guildId: string) {
        switch(this.getGuildLevelById(guildId)) {
            case 1:
                return { needLevel: 2, availables: [ '3m', '4m', '5m' ] }
            case 2:
                return { needLevel: 3, availables: [ '2m', '3m', '4m', '5m' ] }
            case 3:
                return { needLevel: 0, availables: [ '1m', '2m', '3m', '4m', '5m' ] }
            default:
                return { needLevel: 1, availables:  [ '5m' ] }
        }
    }

    getGuildLevel(boostCount: number) {
        if(2 > boostCount) {
            return 0
        } else if(5 > boostCount) {
            return 1
        } else if(7 > boostCount) {
            return 2
        } else {
            return 3
        }
    }

    addBoostGuild(id: string) {
        if(this.cache.has(id)) {
            this.cache.set(id, this.cache.get(id)!+1)
        } else {
            this.cache.set(id, 1)
        }
    }

    async removeBoosts(userId: string) {
        const boosts = await this.array({ userId, new: true })
        if(!boosts.length) return
        
        const obj: { [k: string]: any } = {}
        for ( let i = 0; boosts.length > i; i++ ) {
            if(boosts[i].guildId) {
                this.removeBoostGuild(boosts[i].guildId)
                if(!obj[boosts[i].guildId]) {
                    obj[boosts[i].guildId] = 0
                }

                obj[boosts[i].guildId] += 1
            }

            await boosts[i].remove()
        }

        const ids = Object.keys(obj)
        for ( let i = 0; ids.length > i; i++ ) {
            for ( let j = 0; (obj[ids[i]] || 0) > j; j++ ) {
                this.removeBoostGuild(ids[i])
            }
        }
    }

    removeBoostGuild(id: string) {
        if(this.cache.has(id)) {
            this.cache.set(id, this.cache.get(id)!-1)
        }
    }

    getGuildLevelById(id: string) {
        return this.getGuildLevel(this.cache.get(id) || 0)
    }

    autoAddRole() {
        const guild = this.db.client.guilds.cache.get(this.db.client.config.meta.supportGuildId)
        if(!guild) return

        setInterval(async () => {
            const guild = this.db.client.guilds.cache.get(this.db.client.config.meta.supportGuildId)
            if(!guild) return

            const donate = guild.roles.cache.get(this.db.client.config.roles.hasBoosts)
            if(!donate) return
        
            const roles = guild.roles.cache.filter((r) => Object.keys(this.db.client.config.roles.boosty).includes(r.id))
            const sorted = roles.map((r) => r.members.map((m) => m.id))
            const ids: string[] = []

            for ( let i = 0; sorted.length > i; i++) {
                ids.push(...sorted[i])
            }

            ids.push(...(await this.array()).filter((d) => !ids.includes(d.userId)).map(d => d.userId))
    
            for ( let i = 0; ids.length > i; i++ ) {
                const member = await this.db.client.util.getMember(guild, ids[i])
    
                if(member && !member.roles.cache.has(this.db.client.config.roles.hasBoosts)) {
                    await member.roles.add(this.db.client.config.roles.hasBoosts).catch(() => {})
                }
            }

            const donateMembers = donate.members.filter((m) => !ids.includes(m.id)).map((m) => m)
            for ( let i = 0; donateMembers.length > i; i++ ) {
                const member = await this.db.client.util.getMember(guild, donateMembers[i].id)
                if(member) {
                    await member.roles.remove(this.db.client.config.roles.hasBoosts).catch(() => {})
                }
            }
        }, 300_000)
    }

    sweeper() {
        setInterval(async () => {
            const array = (await this.array()).filter((b) => !b.new && Date.now() > b.end)

            for ( let i = 0; array.length > i; i++ ) {
                const doc = array[i]

                if(doc.guildId !== '0') {
                    await this.resolveFallBoostGuild(doc.guildId)
                }

                await doc.remove()
            }
        }, 1_800_000)
    }

    async resolveFallBoostGuild(guildId: string) {
        const oldLevel = this.getGuildLevelById(guildId)
        this.removeBoostGuild(guildId)
        const newLevel = this.getGuildLevelById(guildId)

        if(oldLevel !== newLevel) {
            const banner = await this.db.modules.banner.get(guildId)
            const moduleVoice = await this.db.modules.voice.get(guildId)
            const texts = banner.items.filter((i) => i.type === 'Text' && !i.disabled)
            const images = banner.items.filter((i) => ['Image', 'ActiveMemberAvatar'].includes(i.type) && !i.disabled)

            if(newLevel !== 3) {
                if(moduleVoice.state) {
                    moduleVoice.buttons = this.db.modules.voice.createRoomComponents(moduleVoice)
                }
            }

            const limitBannerUpdate = this.getMaxTimeUpdateBanner(guildId)
            if(!limitBannerUpdate.availables.includes(banner.updated)) {
                banner.updated = '10m'
            }

            const limitBannerTexts = this.getMaxCountTextsOnBanner(guildId)
            if(texts.length > limitBannerTexts.count) {
                let count = texts.length-limitBannerTexts.count
                for ( let i = 0; count > i; i++ ) {
                    texts[i].disabled = true
                }

                banner.markModified('items')
            }

            
            const limitBannerImages = this.getMaxCountImagesOnBanner(guildId)
            if(images.length > limitBannerImages.count) {
                let count = images.length-limitBannerImages.count
                for ( let i = 0; count > i; i++ ) {
                    images[i].disabled = true
                }

                banner.markModified('items')
            }

            await this.db.modules.banner.save(banner)
            await this.db.modules.voice.save(moduleVoice)
        }
    }
}