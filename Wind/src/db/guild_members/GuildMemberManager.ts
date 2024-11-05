import GuildMemberSchema, { IGuildMemberAction, TGuildMember } from './GuildMemberSchema'
import { Collection, GuildMember, Locale } from 'discord.js'
import WindClient from '#client'

export default class GuildMemberManager {
    private readonly cache: Collection<string, TGuildMember> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const docs = await this.array()
        for ( let i = 0; docs.length > i; i++ ) {
            const guild = this.client.guilds.cache.get(docs[i].guildId)
            if(guild) {
                const member = guild.members.cache.get(docs[i].userId)
                if(member) {
                    this.cache.set(`${docs[i].guildId}.${docs[i].userId}`, docs[i])
                }
            }
        }

        setInterval(() => this.autoSweeperAction(), 300_000)
    }

    async array(cache: boolean = false, options: {} = {}) {
        if(cache) {
            if(Object.keys(options).length > 0) {
                return this.cache.map((c) => c).filter((c) => c)
            }

            return this.cache.map((c) => c)
        } else {
            return (await GuildMemberSchema.find(options))
        }
    }

    async get(member: GuildMember) {
        if(this.cache.has(`${member.guild.id}.${member.id}`)) {
            return this.cache.get(`${member.guild.id}.${member.id}`)!
        } else {
            return (await this.find(member.guild.id, member.id))
        }
    }

    async getOptions(guildId: string, userId: string) {
        if(this.cache.has(`${guildId}.${userId}`)) {
            return this.cache.get(`${guildId}.${userId}`)!
        } else {
            return (await this.find(guildId, userId))
        }
    }

    async find(guildId: string, userId: string) {
        const doc = await GuildMemberSchema.findOne({ guildId, userId })
        if(doc) {
            this.cache.set(`${doc.guildId}.${doc.userId}`, doc)
            return doc
        } else {
            return (await this.create(guildId, userId))
        }
    }

    async create(guildId: string, userId: string) {
        const doc = await GuildMemberSchema.create({ guildId, userId })
        return (await this.save(doc))
    }

    async save(res: TGuildMember) {
        const saved = await res.save().catch(() => null)
        if(!saved) return res
        this.cache.set(`${saved.guildId}.${saved.userId}`, saved)
        return saved
    }

    async remove(res: TGuildMember) {
        if(this.cache.has(res.guildId)) {
            this.cache.delete(res.guildId)
        }

        const obj = res.toObject()
        await res.deleteOne()

        return obj
    }

    async autoSweeperAction() {
        const array = (await this.array(false)).filter((d) => this.client.guilds.cache.has(d.guildId) && d.actions.some((d) => d.active && d.time !== 0))
        for ( let i = 0; array.length > i; i++ ) {
            const res = array[i]
            const guild = this.client.guilds.cache.get(res.guildId)
            if(guild) {
                const target = guild.members.cache.get(res.userId)
                if(target) {
                    const actions = res.actions.filter((a) => a.active && Date.now() > (a.time + a.createdTimestamp))
                    for ( let j = 0; actions.length > j; j++ ) {
                        actions[j].active = false
                        await this.client.db.audits.sendCustomModLogger((await this.resolveActionType(actions[j].type, target, guild.preferredLocale)), 'Автоснятие', target, {}, guild.preferredLocale)
                        res.markModified('actions')
                        await this.save(res)
                    }
                } else {
                    const actions = res.actions.filter((a) => a.active && Date.now() > (a.time + a.createdTimestamp))
                    for ( let j = 0; actions.length > j; j++ ) {
                        actions[j].active = false
                        if(actions[j].type === 'Ban') {
                            await guild.bans.remove(res.userId).catch(() => {})
                        }
                        res.markModified('actions')
                        await this.save(res)
                    }
                }
            }
        }
    }

    private async resolveActionType(type: IGuildMemberAction, target: GuildMember, locale: Locale) {
        switch(type) {
            case 'Ban':
                return 'GuildBanRemove'
            case 'Lockdown':
                const crash = await this.client.db.crashs.get(target.guild.id)
                if(target.guild.roles.cache.has(crash.banId) && target.roles.cache.has(crash.banId)) {
                    await target.roles.remove(crash.banId).catch(() => {})
                }
                return 'GuildBanRemove'
            default:
                const doc = await this.client.db.guilds.get(target.guild.id, locale)

                if(doc.mutes.general?.roleId && target.roles.cache.has(doc.mutes.general?.roleId)) {
                    await target.roles.remove(doc.mutes.general.roleId).catch(() => {})
                }
                
                if(doc.mutes.text?.roleId && target.roles.cache.has(doc.mutes.text?.roleId)) {
                    await target.roles.remove(doc.mutes.text.roleId).catch(() => {})
                }
            
                if(doc.mutes.voice?.roleId && target.roles.cache.has(doc.mutes.voice?.roleId)) {
                    await target.roles.remove(doc.mutes.voice.roleId).catch(() => {})
                }
            
                if((target?.communicationDisabledUntilTimestamp ?? 0) > Date.now()) {
                    await target.disableCommunicationUntil(null).catch(() => {})
                }

                return 'GuildMuteRemove'
        }
    }
}