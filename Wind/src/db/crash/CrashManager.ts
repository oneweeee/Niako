import CrashSchema, { ICrashActionType, TCrash } from './CrashSchema'
import WindClient from '#client'
import {
    AuditLogEvent,
    Collection,
    Guild,
    GuildChannel,
    GuildEmoji,
    GuildMember,
    Role,
    User,
    GuildAuditLogsEntry,
    GuildAuditLogsActionType,
    GuildAuditLogsTargetType,
    Message,
    ChannelType,
    CategoryChannel,
    VoiceChannel
} from 'discord.js'

export default class CrashManager {
    private readonly cache: Collection<string, TCrash> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const docs = await this.array()
        for ( let i = 0; docs.length > i; i++ ) {

            const guild = this.client.guilds.cache.get(docs[i].guildId)
            if(guild) {
                if(!docs[i].groups.map((g) => g.roleId).includes(docs[i].guildId)) {
                    docs[i].groups.push({
                        roleId: docs[i].guildId,
                        actions: [],
                        members: [],
                        type: 'Role'
                    })
                    await this.save(docs[i])
                } else {}
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
            return (await CrashSchema.find(options))
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
        const doc = await CrashSchema.findOne({ guildId })
        if(doc) {
            this.cache.set(doc.guildId, doc)
            return doc
        } else {
            return (await this.create(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await CrashSchema.create({ guildId })
        doc.groups.push({
            roleId: guildId,
            members: [],
            actions: [],
            type: 'Role'
        })
        return (await this.save(doc))
    }

    async save(res: TCrash) {
        const saved = await res.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async remove(res: TCrash) {
        if(this.cache.has(res.guildId)) {
            this.cache.delete(res.guildId)
        }

        const obj = res.toObject()
        await res.deleteOne()

        return obj
    }

    private isRoleAdmin(guild: Guild, action: GuildAuditLogsEntry<null, GuildAuditLogsActionType, GuildAuditLogsTargetType, AuditLogEvent> | { executor: GuildMember, changes: {key: string, old: any[], new: any[]}[] }, stringActionType: ICrashActionType, member?: GuildMember) {
        switch(stringActionType) {
            case 'AddRoleDefault':
            case 'AddMemberRoleAdmin':
                const changeAdd = action.changes[0]
                if(changeAdd && changeAdd?.key === '$add' && typeof changeAdd?.new === 'object' && (changeAdd.new as any[]).length > 0) {
                    for (const data of (changeAdd.new as { name: string, id: string }[])) {
                        const role = guild.roles.cache.get(data.id)
                        if(role) {
                            if(role.permissions.has('Administrator')) {
                                stringActionType = 'AddMemberRoleAdmin'
                            } else {
                                stringActionType = 'AddRoleDefault'
                            }
                        }
                    }
                }
                break
        }

        return stringActionType
    }

    private async resolveGuildMemberRoleUpdate(guild: Guild, action: GuildAuditLogsEntry<null, GuildAuditLogsActionType, GuildAuditLogsTargetType, AuditLogEvent> | { executor: GuildMember, changes: {key: string, old: any[], new: any[]}[] }, stringActionType: ICrashActionType, member?: GuildMember) {
        let returnedRemoveRole: Role | undefined = undefined
        let returnedAddRole: Role | undefined = undefined

        switch(stringActionType) {
            case 'AddRoleDefault':
            case 'AddMemberRoleAdmin':
                const changeAdd = action.changes[0]
                if(changeAdd && changeAdd?.key === '$add' && typeof changeAdd?.new === 'object' && (changeAdd.new as any[]).length > 0) {
                    for (const data of (changeAdd.new as { name: string, id: string }[])) {
                        const role = guild.roles.cache.get(data.id)
                        if(role) {
                            returnedAddRole = role
                            if(role.permissions.has('Administrator')) {
                                stringActionType = 'AddMemberRoleAdmin'
                            } else {
                                stringActionType = 'AddRoleDefault'
                            }

                            if(member) {
                                await member.roles.remove(role.id).catch(() => {})
                            }
                        }
                    }
                }
                break
            case 'RemoveRole':
                const changeRemove = action.changes[0]
                if(changeRemove && changeRemove?.key === '$remove' && typeof changeRemove?.new === 'object' && (changeRemove.new as any[]).length > 0) {
                    for (const data of (changeRemove.new as { name: string, id: string }[])) {
                        const role = guild.roles.cache.get(data.id)
                        if(role && member) {
                            returnedRemoveRole = role
                            await member.roles.add(role.id).catch(() => {})
                        }
                    }
                }
                break
        }

        return { add: returnedAddRole, remove: returnedRemoveRole }
    }

    async revokeMemberAction(stringActionType: ICrashActionType, setting: { bot?: GuildMember, channel?: GuildChannel, oldChannel?: GuildChannel, role?: Role, oldRole?: Role, emoji?: GuildEmoji, guild?: Guild, bannedUser?: User, member?: GuildMember, executor?: GuildMember, message?: Message } = {}) {
        switch(stringActionType) {
            case 'EditGuildName':
                if(setting?.guild) {
                    await setting.guild.setName(setting.guild.name).catch(() => {})
                }
                break
            case 'MemberBan':
                if(setting?.bannedUser && setting?.guild) {
                    await setting.guild.bans.remove(setting.bannedUser.id).catch(() => {})
                }
            case 'EditGuildLink':
                    /*await fetch(
                        `https://discord.com/api/v9/guilds/${setting.guild.id}/vanity-url`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bot ${this.client.token}`
                            },
                            body: {
                                code: setting.guild.vanityURLCode
                            } as any
                        }
                    )
                    .then(async (res) => console.log(await res.json()))
                    .catch((err) => console.log(err))*/
                break
            case 'AddBot':
                if(setting?.bot) {
                    const verifiedBot = (await setting.bot.user.fetchFlags()).toArray().find(b => b === 'VerifiedBot')
                    if(!verifiedBot) {
                        await setting.bot.ban().catch(() => {})
                    }
                }
                break
            case 'CreateAdminRole':
            case 'CreateRole':
                if(setting?.role) {
                    await setting.role.delete().catch(() => {})
                }
                break
            case 'CreateChannel':
                if(setting?.channel) {
                    await setting.channel.delete().catch(() => {})
                }
                break
            case 'AddRoleAdminPerms':
                if(setting?.role && setting?.oldRole) {
                    await setting.role.setPermissions(setting.oldRole.permissions).catch(() => {})
                }
                break
            case 'MentionGuild':
                if(setting?.message && setting?.message?.deletable) {
                    await setting.message.delete().catch(() => {})
                }
                break
            case 'CreateWebhook':
                return
            case 'DeleteRole':
                if(setting?.role) {
                    const role = await setting.role.guild.roles.create({
                        name: setting.role.name,
                        color: setting.role.hexColor,
                        permissions: setting.role.permissions.toArray(),
                        hoist: setting.role.hoist,
                        mentionable: setting.role.mentionable,
                        position: setting.role.position
                    }).catch(() => null)

                    if(role) {
                        const members = setting.role.members.map((m) => m)
                        for ( let i = 0; members.length > i; i++ ) {
                            if(members[i]) {
                                await members[i].roles.add(role.id).catch(() => {})
                            }
                        }
                    }
                }
                break
            case 'EditRole':
                if(setting?.role && setting?.oldRole) {
                    if(setting.oldRole.name !== setting.role.name) {
                        await setting.role.setName(setting.oldRole.name).catch(() => {})
                    }
    
                    if(setting.oldRole.hexColor !== setting.role.hexColor) {
                        await setting.role.setColor(setting.oldRole.hexColor).catch(() => {})
                    }
    
                    if(setting.oldRole.hoist !== setting.role.hoist) {
                        await setting.role.setHoist(setting.oldRole.hoist).catch(() => {})
                    }
    
                    if(setting.oldRole.mentionable !== setting.role.mentionable) {
                        await setting.role.setMentionable(setting.oldRole.mentionable).catch(() => {})
                    }
                }
                break
            case 'DeleteChannel':
                if(setting?.channel) {
                    let permissionOverwrites = []
                    if(setting.channel.permissionOverwrites.cache.size > 0) {
                        permissionOverwrites = setting.channel.permissionOverwrites.cache.map((p: any) => {
                            const id = setting.channel!.guild.roles.cache.find((r) => r.name === p.name)?.id
                            if(id) {
                                return { ...p, id }
                            } else {
                                return null
                            }
                        }).filter((c: any) => Boolean(c))
                    }
        
                    const channel = await setting.channel.guild.channels.create({
                        name: setting.channel.name,
                        type: setting.channel.type as any,
                        permissionOverwrites
                    }).catch(() => null) as GuildChannel | null

                    if(channel) {
                        if(setting.channel.type === ChannelType.GuildCategory && channel.type === ChannelType.GuildCategory) {
                            const childs = (setting.channel as CategoryChannel).children.cache.map((c) => c)
                            for ( let i = 0; childs.length > i; i++ ) {
                                if(childs[i]) {
                                    await childs[i].setParent(channel.id).catch(() => {})
                                }
                            }
                        }
                    }
                }
                break
            case 'EditChannel':
                if(setting?.channel && setting?.oldChannel) {
                    if(setting.oldChannel.name !== setting.channel.name) {
                        await setting.channel.setName(setting.oldChannel.name).catch(() => {})
                    }
        
                    if(setting.oldChannel.position !== setting.channel.position) {
                        await setting.channel.setPosition(setting.oldChannel.position).catch(() => {})
                    }
        
                    if(setting.oldChannel.parentId !== setting.channel.parentId) {
                        await setting.channel.setParent(setting.oldChannel.parentId).catch(() => {})
                    }
        
                    if(setting.oldChannel.isTextBased() && setting.channel.isTextBased()) {
                        if(setting.oldChannel.nsfw !== setting.channel.nsfw) {
                            await setting.channel.setNSFW(setting.oldChannel.nsfw).catch(() => {})
                        }
        
                        if(setting.oldChannel.rateLimitPerUser !== setting.channel.rateLimitPerUser) {
                            await setting.channel.setRateLimitPerUser(setting.oldChannel.rateLimitPerUser ?? 0).catch(() => {})
                        }
                    }
        
                    if(setting.oldChannel.isVoiceBased() && setting.channel.isVoiceBased()) {
                        if(setting.oldChannel.userLimit !== setting.channel.userLimit) {
                            await (setting.channel as VoiceChannel).setUserLimit(setting.oldChannel.userLimit).catch(() => {})
                        }
        
                        if(setting.oldChannel.bitrate !== setting.channel.bitrate) {
                            await (setting.channel as VoiceChannel).setBitrate(setting.oldChannel.bitrate).catch(() => {})
                        }
                    }
                }
                break
        }

        return stringActionType
    }

    async push(guild: Guild, res: TCrash, actionType: AuditLogEvent, stringActionType: ICrashActionType, setting: { bot?: GuildMember, channel?: GuildChannel, oldChannel?: GuildChannel, role?: Role, oldRole?: Role, emoji?: GuildEmoji, guild?: Guild, bannedUser?: User, member?: GuildMember, executor?: GuildMember, message?: Message } = {}) {
        const audit = stringActionType === 'MentionGuild' ? undefined : (await guild.fetchAuditLogs({ limit: 1, type: actionType }).catch(
            () => ({ entries: new Collection<any, GuildAuditLogsEntry<AuditLogEvent>>() })
        )).entries.first() as GuildAuditLogsEntry | undefined
        const action = (setting?.executor ? { executor: setting?.executor, changes: [] } : undefined) || audit ? audit : undefined

        if(action && action.executor) {
            if(Date.now() > action.createdTimestamp+300000) return

            if([this.client.user!.id, ...res.whiteList, ...this.client.config.developers].includes(action.executor.id)) return
            
            const executor = await guild.members.fetch(action.executor.id).catch(() => null)

            if(['AddMemberRoleAdmin', 'AddRoleDefault'].includes(stringActionType)) {
                stringActionType = this.isRoleAdmin(guild, action, stringActionType)
            }

            if(stringActionType === 'AddRoleDefault' && setting.member && action.executor.id === setting.member.id) return

            const target = action?.targetId ? (await guild.members.fetch(action.targetId).catch(() => null) ?? executor) : executor

            if(executor && executor?.guild?.ownerId !== executor?.id) {
                if(guild.members?.me) {
                    if(executor.roles.highest.position >= guild.members.me.roles.highest.position) return
                } else {
                    const me = await guild.members.fetchMe().catch(() => null)
                    if(me && executor.roles.highest.position >= me.roles.highest.position) return
                }
                
                const filterRolesId = executor.roles.cache.sort((a, b) => b.position-a.position).map((r) => r.id)
                const findRole = res.groups.filter((g) => guild.roles.cache.has(g.roleId)).sort((a, b) => (guild.roles.cache.get(b.roleId)?.position || 0) - (guild.roles.cache.get(a.roleId)?.position || 0)).find((g) => !g?.disabled && filterRolesId.includes(g.roleId))

                if(findRole) {
                    let warns = 0
                    let banned: boolean = false
                    const dbAction = findRole.actions.find((a) => a.type === stringActionType)
                    if(dbAction) {
                        if(dbAction.push !== 'None') {
                            await this.resolveGuildMemberRoleUpdate(guild, action, stringActionType, target!)
                            await this.revokeMemberAction(stringActionType, setting)
                        } else if(executor.user.bot && executor.roles.botRole) {
                            return executor.ban().catch(() => {})
                        }

                        switch(dbAction.push) {
                            case 'Ban':
                                await executor.ban().catch(() => {})
                                break
                            case 'Kick':
                                await executor.kick().catch(() => {})
                                break
                            case 'Warn':
                            case 'Lockdown':
                                const doc = await this.client.db.guildMembers.find(guild.id, executor.id)
                                if(dbAction.push === 'Warn') {
                                    doc.warns += 1
                                    warns = doc.warns
                                    if(doc.warns >= res.warnResolve) {
                                        doc.warns = 0
                                        banned = true
                                    }
                                }
                                if(banned || dbAction.push === 'Lockdown') {
                                    const roles = executor.roles.cache.map((r) => r.id)
                                    if(!doc.roles.length) {
                                        doc.roles = roles
                                    }
                                    await this.client.util.removeRoles(executor, roles)
                                    if(res.banId !== '0' && !executor.roles.cache.has(res.banId)) {
                                        await executor.roles.add(res.banId).catch(() => {})
                                    }
                                }
                                await this.client.db.guildMembers.save(doc)
                                break
                            case 'None':
                                return
                        }

                        await this.client.managers.audit.send(res.channelId, {
                            member: executor,
                            system: 'Crash',
                            locale: guild.preferredLocale,
                            action: stringActionType,
                            actionForMember: dbAction.push,
                            bot: setting?.bot,
                            nukeChannel: setting?.channel,
                            emoji: setting?.emoji,
                            role: setting?.role,
                            bannedUser: setting?.bannedUser,
                            customMember: setting?.member,
                            warns
                        })
                    
                        if(banned) {
                            await this.client.managers.audit.send(res.channelId, {
                                member: executor,
                                system: 'Crash',
                                locale: guild.preferredLocale,
                                action: 'AutoTempBanWarns',
                                actionForMember: 'Lockdown',
                                bot: setting?.bot,
                                nukeChannel: setting?.channel,
                                emoji: setting?.emoji,
                                role: setting?.role,
                                bannedUser: setting?.bannedUser,
                                customMember: setting?.member, warns
                            })
                        }
                    }

                    return
                }
            }
        } else if(setting?.message && setting?.executor) {
            if([this.client.user!.id, ...res.whiteList, ...this.client.config.developers].includes(setting.executor.id)) return

            if(setting.member && setting.executor.id === setting.member.id) return

            if(['MemberKick', 'AddRoleDefault'].includes(stringActionType)) {
                if(audit?.targetId && setting?.member && setting.member.id !== audit.targetId) return
            }

            const filterRolesId = setting.executor.roles.cache.sort((a, b) => b.position-a.position).map((r) => r.id)
            const findRole = res.groups.filter((g) => guild.roles.cache.has(g.roleId)).sort((a, b) => (guild.roles.cache.get(b.roleId)?.position || 0) - (guild.roles.cache.get(a.roleId)?.position || 0)).find((g) => !g?.disabled && filterRolesId.includes(g.roleId))

            if(findRole) {
                let warns = 0
                let banned: boolean = false
                const dbAction = findRole.actions.find((a) => a.type === stringActionType)
                if(dbAction) {
                    if(dbAction.push !== 'None') {
                        await this.revokeMemberAction(stringActionType, setting)
                    } else if(setting.executor.user.bot && setting.executor.roles.botRole) {
                        return setting.executor.ban().catch(() => {})
                    }

                    switch(dbAction.push) {
                        case 'Ban':
                            await setting.executor.ban().catch(() => {})
                            break
                        case 'Kick':
                            await setting.executor.kick().catch(() => {})
                            break
                        case 'Warn':
                        case 'Lockdown':
                            const doc = await this.client.db.guildMembers.find(guild.id, setting.executor.id)
                            if(dbAction.push === 'Warn') {
                                doc.warns += 1
                                warns = doc.warns
                                if(doc.warns >= res.warnResolve) {
                                    doc.warns = 0
                                    banned = true
                                }
                            }
                            if(banned || dbAction.push === 'Lockdown') {
                                const roles = setting.executor.roles.cache.map((r) => r.id)
                                doc.roles = roles
                                await this.client.util.removeRoles(setting.executor, roles)
                                if(res.banId !== '0' && !setting.executor.roles.cache.has(res.banId)) {
                                    await setting.executor.roles.add(res.banId).catch(() => {})
                                } else {
                                    return
                                }
                            }
                            await this.client.db.guildMembers.save(doc)
                            break
                        case 'None':
                            return
                    }

                    if(setting.message.deletable) {
                        await setting.message.delete().catch(() => {})
                    }

                    await this.client.managers.audit.send(res.channelId, {
                        member: setting.executor,
                        system: 'Crash',
                        locale: guild.preferredLocale,
                        action: stringActionType,
                        actionForMember: dbAction.push,
                        bot: setting?.bot,
                        nukeChannel: setting?.channel,
                        emoji: setting?.emoji,
                        role: setting?.role,
                        bannedUser: setting?.bannedUser,
                        customMember: setting?.member,
                        warns
                    })
                
                    if(banned) {
                        await this.client.managers.audit.send(res.channelId, {
                            member: setting.executor,
                            system: 'Crash',
                            locale: guild.preferredLocale,
                            action: 'AutoTempBanWarns',
                            actionForMember: 'Lockdown',
                            bot: setting?.bot,
                            nukeChannel: setting?.channel,
                            emoji: setting?.emoji,
                            role: setting?.role,
                            bannedUser: setting?.bannedUser,
                            customMember: setting?.member, warns
                        })
                    }
                }

                return
            }
        }
    }

    resolveCrashType(type: ICrashActionType, locale: string) {
        switch(type) {
            case 'AddBot':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.bot_add", locale)}`
            case 'CreateChannel':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.channel_create", locale)}`
            case 'DeleteChannel':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.channel_delete", locale)}`
            case 'EditChannel':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.channel_edit", locale)}`
            case 'EditEmoji':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.emoji_edit", locale)}`
            case 'EditGuildBanner':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.banner_edit", locale)}`
            case 'EditGuildIcon':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.icon_edit", locale)}`
            case 'EditGuildName':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.guild_edit_name", locale)}`
            case 'EditGuildLink':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.link_edit", locale)}`
            case 'MemberBan':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.ban", locale)}`
            case 'AddRoleDefault':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.role_add", locale)}`
            case 'AddMemberRoleAdmin':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.role_add_admin", locale)}`
            case 'MemberKick':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.kick", locale)}`
            case 'EditNicknames':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.nickname", locale)}`
            case 'RemoveRole':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.remove_role", locale)}`
            case 'MemberTimeout':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.timeout_add", locale)}`
            case 'MemberUnban':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.unban", locale)}`
            case 'MentionGuild':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.mention", locale)}`
            case 'CreateRole':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.create_role", locale)}`
            case 'CreateAdminRole':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.create_admin_role", locale)}`
            case 'DeleteRole':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.delete_role", locale)}`
            case 'AddRoleAdminPerms':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.add_role_perms", locale)}`
            case 'EditRole':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.edit_role", locale)}`
            case 'CreateWebhook':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.events.create_webhook", locale)}`
            default:
                return type
        }
    }
}