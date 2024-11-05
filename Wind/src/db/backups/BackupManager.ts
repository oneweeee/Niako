import BackupSchema, { TBackup } from './BackupSchema'
import WindClient from '#client'
import {
    ChannelType,
    Collection,
    Guild,
    GuildMember,
    Role,
    TextChannel
} from 'discord.js'

export default class BackupManager {
    private readonly cache: Collection<string, TBackup> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const docs = await this.array()
        for ( let i = 0; docs.length > i; i++ ) {
            this.cache.set(this.getDocKey(docs[i]), docs[i])
        }
    }

    async array(cache: boolean = false, options: { guildId?: string, userId?: string } = {}) {
        if(cache) {
            if(Object.keys(options).length > 0) {
                return this.cache.map((b) => b).filter((b) => {
                    if(options?.guildId && options.guildId !== b.guildId) return false
                    if(options?.userId && options.userId !== b.userId) return false

                    return true
                })
            }

            return this.cache.map((c) => c)
        } else {
            return (await BackupSchema.find(options))
        }
    }

    async getMemberBackups(member: GuildMember) {
        return (await BackupSchema.find()).filter(
            (d) => d.guildId === member.guild.id || d.userId === member.id
        )
    }

    getDocKey(doc: TBackup) {
        return `${doc.guildId}.${doc.userId}.${doc.createdTimestamp}`
    }

    async create(member: GuildMember, name: string) {
        const data = this.buildGuildData(member.guild)

        try {
            const json = JSON.stringify(data)
            const doc = await BackupSchema.create(
                {
                    guildId: member.guild.id, createdTimestamp: Date.now(),
                    userId: member.id, name, data: json
                }
            )
            return (await this.save(doc))
        } catch {
            return null
        }
    }

    async save(res: TBackup) {
        const saved = await res.save()
        this.cache.set(this.getDocKey(res), saved)
        return saved
    }

    async remove(res: TBackup) {
        if(this.cache.has(this.getDocKey(res))) {
            this.cache.delete(this.getDocKey(res))
        }

        const obj = res.toObject()
        await res.deleteOne().catch(() => {})

        return obj
    }

    async load(guild: Guild, ignoreId: string, doc: TBackup, ignored: boolean) {
        const errors: { name: string, err: Error }[] = []
        let res: any = {}

        try {
            res = JSON.parse(doc.data)
        } catch {
            return null
        }

        if(Object.keys(res).length === 0) return null

        const roles = guild.roles.cache.map((r) => r)
        for ( let i = 0; roles.length > i; i++ ) {
            const role = roles[i]
            if(ignored) {
                const r = res.roles.find((r: any) => r.name === role.name)
                if(!r) {
                    await role.delete().catch(() => {})
                }
            } else {
                await role.delete().catch(() => {})
            }
            await this.ratelimit()
        }

        const channels = guild.channels.cache.map((r) => r)
        for ( let i = 0; channels.length > i; i++ ) {
            const channel = channels[i]
            if(channel.manageable && channel.id !== ignoreId) {
                if(ignored) {
                    const c = res.channels.find((c: any) => c.name === channel.name)
                    if(!c) {
                        await channel.delete().catch(() => {})
                    }
                } else {
                    await channel.delete().catch(() => {})
                    await this.ratelimit()
                }
            }
        }

        await Promise.all(
            [
                guild.setName(res.name).catch((err) => errors.push({ name: 'Установка названия сервера', err })),
                guild.setIcon(res.icon).catch((err) => errors.push({ name: 'Установка иконки сервера', err })),
                guild.setBanner(res.banner).catch((err) => errors.push({ name: 'Установка баннера сервера', err })),
                guild.setSplash(res.splash).catch((err) => errors.push({ name: 'Установка сплеша сервера', err })),
                guild.setVerificationLevel(res.verificationLevel).catch((err) => errors.push({ name: 'Установка верификации сервера', err })),
                guild.setPremiumProgressBarEnabled(res.premiumProgressBarEnabled).catch((err) => errors.push({ name: 'Установка прогресса бустинга сервера', err })),
                guild.setDefaultMessageNotifications(res.defaultMessageNotifications).catch((err) => errors.push({ name: 'Установка статуса уведомлений сервера', err })),
                guild.setAFKTimeout(res.afkTimeout).catch((err) => errors.push({ name: 'Установка афк таймаута сервера', err }))
            ]
        )

        await this.ratelimit(5000)

        const createdRoles: Role[] = []
        const sortRoles = res.roles.sort((a: Role, b: Role) => b.position - a.position)
        
        for ( let i = 0; sortRoles.length > i; i++ ) {
            const data = sortRoles[i]
            if(ignored) {
                const r = guild.roles.cache.find((r) => r.name === data.name)
                if(!r) {
                    const role = await guild.roles.create(data).catch((err) => errors.push({ name: `Создание роли ${data.name}`, err }))
                    if(typeof role !== 'number') {
                        createdRoles.push(role)
                        await this.ratelimit()
                    }
                }
            } else {
                const role = await guild.roles.create({ ...data, position: undefined }).catch((err) => errors.push({ name: `Создание роли ${data.name}`, err }))
                if(typeof role !== 'number') {
                    createdRoles.push(role)
                    await this.ratelimit()
                }
            }
        }

        const createdChannels: any[] = []
        const sortChannels = res.channels.sort(
            (a: any, b: any) => this.getChannelIndex(b.type) - this.getChannelIndex(a.type)
        )
        
        for ( let i = 0; res.channels.length > i; i++ ) {
            const data = sortChannels[i]

            let permissionOverwrites = []
            if(data.permissionOverwrites.length > 0) {
                permissionOverwrites = data.permissionOverwrites.map((p: any) => {
                    const id = guild.roles.cache.find((r) => r.name === p.name)?.id
                    if(id) {
                        return { ...p, id }
                    } else {
                        return null
                    }
                }).filter((c: any) => Boolean(c))
            }

            if(ignored) {
                const c = guild.channels.cache.find((c) => c.name === data.name)
                if(!c) {
                    const channel = await guild.channels.create(
                        { ...data, permissionOverwrites, parent: null }
                    ).catch((err) => errors.push({ name: `Создание канала ${data.name}`, err }))
        
                    if(typeof channel !== 'number') {
                        if(data?.parent) {
                            const findId = guild.channels.cache.find(
                                (c) => c.type === ChannelType.GuildCategory && c.name === data.parent.name
                            )?.id
        
                            if(findId) await channel.setParent(findId)
                        }
        
                        createdChannels.push(channel)
                        await this.ratelimit()
                    }
                }
            } else {
                const channel = await guild.channels.create(
                    { ...data, permissionOverwrites, parent: null }
                ).catch((err) => errors.push({ name: `Создание канала ${data.name}`, err }))
    
                if(typeof channel !== 'number') {
                    if(data?.parent) {
                        const find = createdChannels.find(
                            (c) => c.type === ChannelType.GuildCategory && c.name === data.parent.name
                        )
    
                        if(find) {
                            await channel.setParent(find.id).catch(() => {})
                        }
                    }
    
                    createdChannels.push(channel)
                    await this.ratelimit()
                }
            }
        }

        if(res.afkChannel) {
            const afkChannel = createdChannels.find((c) => c.name === res.afkChannel.name)
            if(afkChannel && afkChannel.type === ChannelType.GuildVoice) {
                await guild.setAFKChannel(afkChannel).catch((err) => errors.push({ name: `Установка афк канала`, err }))
                await this.ratelimit(5000)
            }
        }

        for ( let i = 0; createdRoles.length > i; i++ ) {
            const get = res.roles.find((d: any) => d.name === createdRoles[i].name)
            if(get && get.members.length > 0) {
                for ( let j = 0; get.members.length > j; j++ ) {
                    const member = guild.members.cache.get(get.members[j])
                    if(member && !member.roles.cache.has(createdRoles[i].id)) {
                        await member.roles.add(createdRoles[i].id).catch(() => {})
                        await this.ratelimit()
                    }
                }
            }
        }

        return { status: true, errors: errors }
    }

    buildGuildData(guild: Guild) {
        return {
            name: guild.name,
            icon: this.client.util.getIcon(guild),
            banner: this.client.util.getBanner(guild),
            splash: this.client.util.getSplash(guild),
            verificationLevel: guild.verificationLevel,
            premiumProgressBarEnabled: guild.premiumProgressBarEnabled,
            defaultMessageNotifications: guild.defaultMessageNotifications,
            afkTimeout: guild.afkTimeout,
            afkChannel: guild.afkChannelId ? ({
                name: guild.channels.cache.get(guild.afkChannelId)?.name || null,
                createdTimestamp: guild.channels.cache.get(guild.afkChannelId)?.createdTimestamp || null
            }) : null,

            roles: guild.roles.cache.map((role) => {
                if(role.flags.toArray().length > 0 || role.id === guild.id) return null
                if(
                    role.tags?.availableForPurchase || role.tags?.botId ||
                    role.tags?.guildConnections || role.tags?.integrationId ||
                    role.tags?.premiumSubscriberRole || role.tags?.subscriptionListingId
                ) return null

                return {
                    id: role.id,
                    name: role.name,
                    color: role.hexColor,
                    permissions: role.permissions.toArray(),
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.position,
                    createdTimestamp: role.createdTimestamp,
                    members: role.members.map((m) => m.id)
                }
            }).filter((r) => Boolean(r)),

            channels: guild.channels.cache.filter((c) => !c.isThread()).sort(
                (a: any, b: any) => this.getChannelIndex(b.type) - this.getChannelIndex(a.type)
            ).map((channel) => {
                if(channel.flags.toArray().length > 0) return null

                let defaultOptions = {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    parent: channel.parent?.type === ChannelType.GuildCategory ? ({
                        id: channel.parent.id,
                        name: channel.parent.name,
                        createdTimestamp: channel.parent.createdTimestamp
                    }) : null,
                    permissionOverwrites: (channel as TextChannel).permissionOverwrites.cache.map((c) => ({
                        name: guild.roles.cache.get(c.id)?.name, ...c
                    })),
                    createdTimestamp: channel.createdTimestamp
                }

                switch(channel.type) {
                    case ChannelType.GuildAnnouncement:
                    case ChannelType.GuildText:
                    case ChannelType.GuildForum:
                        return {
                            ...defaultOptions,
                            topic: channel.topic,
                            nsfw: channel.nsfw,
                            position: channel.position,
                        }
                    case ChannelType.GuildCategory:
                        return {
                            ...defaultOptions,
                            position: channel.position,
                            childrens: channel.children.cache.map((c) => ({ name: c.name, createdTimestamp: c.createdTimestamp })),
                        }
                    case ChannelType.GuildStageVoice:
                    case ChannelType.GuildVoice:
                        return {
                            ...defaultOptions,
                            nsfw: channel.nsfw,
                            bitrate: channel.bitrate,
                            position: channel.position,
                            userLimit: channel.userLimit,
                        }
                    default:
                        return null
                }
            }).filter((r) => Boolean(r))
        }
    }

    ratelimit(ms: number = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private getChannelIndex(type: ChannelType) {
        if(type === ChannelType.GuildCategory) {
            return 1
        } else {
            return 0
        }
    }
}