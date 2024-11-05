import { IGuildMemberHistoryAction, IGuildMemberHistoryNickname } from "#db/guild_members/GuildMemberSchema"
import { IPlaylist, TPlaylist } from "#db/playlists/PlaylistSchema"
import { ICrash, TCrashGroupType } from "#db/crash/CrashSchema"
import { IAudit, IAuditType } from "#db/audit/AuditSchema"
import { Queue, Track } from "../wind/WindPlayer"
import { IRaid } from "#db/raid/RaidSchema"
import WindClient from "../WindClient"
import { Node } from "shoukaku"
import os from "os"
import {
    APIEmbed,
    ButtonInteraction,
    ChannelType,
    ColorResolvable,
    CommandInteraction,
    EmbedBuilder,
    EmbedData,
    Emoji,
    Guild,
    GuildMember,
    Locale,
    Snowflake
} from "discord.js"

export default class extends EmbedBuilder {
    constructor(
        private client: WindClient
    ) {
        super()
    }

    from(data?: EmbedData | APIEmbed) {
        return new EmbedBuilder(data)
    }

    color(color: ColorResolvable) {
        return new EmbedBuilder().setColor(color)
    }

    red() {
        return new EmbedBuilder().setColor(this.client.config.Colors.Red)
    }

    green() {
        return new EmbedBuilder().setColor(this.client.config.Colors.Green)
    }

    yellow() {
        return new EmbedBuilder().setColor(this.client.config.Colors.Yellow)
    }

    loading(locale: Locale, color: ColorResolvable, path?: string) {
        return this.color(color).setAuthor({ name: (this.client.services.lang.get(path || "main.embeds.loading", locale)) })
    } 

    default(member: GuildMember, color: ColorResolvable, title: string, locale: Locale, path: string | null = "commands.antinuke.timeoutEnd", options: { indicateTitle?: boolean, target?: GuildMember } = {}) {
        return this.color(color)
        .setThumbnail(this.client.util.getAvatar((options?.target || member)))
        .setTitle(options.indicateTitle ? `${title} — ${(options?.target?.user || member.user).username}` : title)
        .setDescription(!path ? null : `> ${member.toString()}, ${this.client.services.lang.get(path, locale)}`)
    }

    choose(member: GuildMember, color: ColorResolvable, title: string, locale: Locale, path: string = "commands.antinuke.timeoutEnd", options: { indicateTitle?: boolean, target?: GuildMember } = {}) {
        return this.default(member, color, title, locale, path, options)
        .setDescription(`> ${member.toString()}, ${this.client.services.lang.get(path, locale)}\n> ${this.client.services.lang.get("main.embeds.click_on", locale)} ${this.client.emoji.main.agree}, ${this.client.services.lang.get("main.embeds.click_off", locale)} — ${this.client.emoji.main.refuse}`)
    }

    antinukeMainMenu(interaction: CommandInteraction<'cached'> | ButtonInteraction<'cached'>, color: ColorResolvable, locale: Locale) {
        return this.default(interaction.member, color, `${this.client.services.lang.get("commands.antinuke.configuration", locale)} — ${interaction.guild.name}`, locale, "commands.antinuke.mainMenu.description")
        .addFields(
            {
                inline: true,
                name: `> ${this.client.services.lang.get("commands.antinuke.antiraid.antiraid", locale)}:`,
                value: this.client.util.toCode(this.client.services.lang.get("commands.antinuke.mainMenu.fields.raid", locale))
            },
            {
                inline: true,
                name: `> ${this.client.services.lang.get("commands.antinuke.anticrash.anticrash", locale)}:`,
                value: this.client.util.toCode(this.client.services.lang.get("commands.antinuke.mainMenu.fields.crash", locale))
            }
        )
    }

    antiraidMainMenu(interaction: CommandInteraction<'cached'> | ButtonInteraction<'cached'>, color: ColorResolvable, res: IRaid, locale: Locale) {
        return this.default(interaction.member, color, `${this.client.services.lang.get("commands.antinuke.antiraid.antiraidSystem", locale)} — ${interaction.guild.name}`, locale, "commands.antinuke.getSystemConfig")
        .setDescription(`> ${this.client.services.lang.get("commands.antinuke.getSystemConfig", locale)}`)
        .addFields(
            {
                name: `> ${this.client.services.lang.get("commands.antinuke.main_info", locale)}:`,
                value: (
                    `**・${res.memberCount}** ${this.client.services.lang.get("commands.antinuke.antiraid.visits", locale)} ${this.client.services.lang.get("commands.antinuke.antiraid.pretext.on", locale)} **${Math.round(res.timeJoin/1000)}${this.client.services.lang.get("main.time.s", locale)}** ${this.client.services.lang.get("commands.antinuke.antiraid.time", locale)}` + '\n'
                    + `**・**${this.client.services.lang.get("commands.antinuke.antiraid.punishment", locale)}: **${this.client.util.resolvePushType(res.push, interaction.locale)}**` + '\n'
                    + `**・**${this.client.services.lang.get("commands.antinuke.channelNotification", locale)}: **${res.channelId === '0' ? this.client.services.lang.get("commands.antinuke.module.off", locale).toLowerCase() : `<#${res.channelId}>`}**`
                )
            }
        )
    }

    async anticrashMainMenu(interaction: CommandInteraction<'cached'> | ButtonInteraction<'cached'>, color: ColorResolvable, res: ICrash, locale: Locale) {
        const members = await interaction.guild.members.fetch().catch(() => null)
        return this.default(interaction.member, color, `${this.client.services.lang.get("commands.antinuke.anticrash.anticrashSystem", locale)} — ${interaction.guild.name}`, locale, "commands.antinuke.getSystemConfig")
        .setDescription(`> ${this.client.services.lang.get("commands.antinuke.getSystemConfig", locale)}`)
        .addFields(
            {
                name: `> ${this.client.services.lang.get("commands.antinuke.main_info", locale)}:`,
                value: (
                    `**・**${this.client.services.lang.get("commands.antinuke.anticrash.role_quarantine", locale)}: **${res.banId === '0' ? this.client.services.lang.get("commands.antinuke.module.off", locale).toLowerCase() : `<@&${res.banId}>`}**` + '\n'
                    + `**・**${this.client.services.lang.get("commands.antinuke.channelNotification", locale)}: **${res.channelId === '0' ? this.client.services.lang.get("commands.antinuke.module.off", locale).toLowerCase() : `<#${res.channelId}>`}**` + '\n'
                    + `**・**${this.client.services.lang.get("commands.antinuke.anticrash.punishments.warn_total", locale)}: **${res.warnResolve}**`
                )
            },
            {
                name: `> ${this.client.services.lang.get("commands.antinuke.anticrash.groups", locale)}:`,
                inline: true,
                value: (
                    res.groups.length > 0 ? res.groups.slice(0, res.groups.length > 15 ? 15 : res.groups.length).map((group) => {
                        const role = interaction.guild.roles.cache.get(group.roleId)
                        if(role) return `**・**${role.toString()}${group?.name ? ` **&** ${group.name}` : ''}`
                        else if(group?.name) return `**・**${group.name}`
                        else return `**・**${this.client.services.lang.get("commands.antinuke.anticrash.unknownGroup", locale)} ... (${group.type})`
                    }).join('\n') + (res.groups.length > 15 ? '...' : '') : this.client.services.lang.get("commands.antinuke.anticrash.empty", locale)
                )
            },
            {
                name: `> ${this.client.services.lang.get("commands.antinuke.anticrash.whitelist", locale)}:`,
                inline: true,
                value: (
                    res.whiteList.length > 0 ? res.whiteList.slice(0, res.whiteList.length > 15 ? 15 : res.whiteList.length).map(id => {
                        const member = (members ?? interaction.guild.members.cache).get(id)
                        if(member) return `**・**${member.toString()}`
                        else return `**・**${id}`
                    }).join('\n') + (res.whiteList.length > 15 ? '...' : '') : this.client.services.lang.get("commands.antinuke.anticrash.empty", locale)
                )
            }
        )
    }

    whitelist(interaction: CommandInteraction<'cached'>, color: ColorResolvable, whitelist: Snowflake[], locale: Locale, page: number = 0) {
        let text: string = ''
        for ( let i = page*15; (i < whitelist.length && i < 15*(page+1)) ; i++ ) {
            const member = interaction.guild.members.cache.get(whitelist[i])

            text += (`**${i+1})** ${member ? member.toString() : whitelist[i]}` + '\n')
        }

        return this.default(interaction.member, color, `${this.client.services.lang.get("commands.antinuke.anticrash.whitelist_antinuke", locale)}`, locale, `${this.client.services.lang.get("commands.antinuke.collectors.crash.select_change", locale)}`)
        .addFields(
            {
                name: `> **${this.client.services.lang.get("commands.antinuke.collectors.crash.whitelist_users", locale)}:**`,
                value: (
                    text || `${this.client.services.lang.get("commands.antinuke.anticrash.empty", locale)}`
                )
            }
        )
        .setFooter({ text: `${this.client.services.lang.get("main.embeds.page", locale)}: ${page+1}/${this.client.util.getMaxPage(whitelist, 15)}` })
    }

    groupAction(interaction: CommandInteraction<'cached'>, color: ColorResolvable, res: ICrash, type: TCrashGroupType, locale: Locale) {
        return this.default(interaction.member, color, `${this.client.services.lang.get("commands.antinuke.anticrash.anticrash_group", locale)} ${this.client.services.lang.get("commands.antinuke.anticrash.roles", locale)}`, locale, `${this.client.services.lang.get("commands.antinuke.anticrash.server_group", locale)}`)
        .addFields(
            res.groups.filter((g) => g.type === type).map((r) => {
                if(type === 'Role') {
                    const role = interaction.guild.roles.cache.get(r.roleId)

                    if(!role) {
                        return {
                            name: `${r.roleId}`,
                            value: `${this.client.services.lang.get("commands.antinuke.delete_group", locale)}`,
                            inline: true
                        }
                    }
    
                    return {
                        name: `${role.name} (${role.members.size})`,
                        value: (
                            role.members.size > 0 ? (role.members.map((m) => m.toString()).slice(0, role.members.size > 15 ? 15 : role.members.size).join('\n') + `${role.members.size > 15 ? '...' : ''}`) : `${this.client.services.lang.get("commands.antinuke.nobody", locale)}`
                        ),
                        inline: true
                    }
                } else {
                    return {
                        name: `${r?.name} (${r.members.length})`,
                        inline: true,
                        value: r.members.length > 0 ? (r.members.map((m) => {
                            const member = interaction.guild.members.cache.get(m)
                            return member ? member.toString() : m
                        }).slice(0, r.members.length > 15 ? 15 : r.members.length).join('\n') + `${r.members.length > 15 ? '...' : ''}`) : `${this.client.services.lang.get("commands.antinuke.anticrash.empty", locale)}`
                    }
                }
            })
        )
    }

    async guilds(guilds: Guild[], color: ColorResolvable, locale: Locale, page: number = 0) {
        const embed = this.color(color)
        .setThumbnail(this.client.util.getAvatar(this.client.user))
        .setFooter({ text: `${this.client.services.lang.get("main.embeds.page", locale)}: ${page+1}/${this.client.util.getMaxPage(guilds, 10)}` })

        let text = `${this.client.services.lang.get("main.developer_commands.guilds.total_servers", locale)}: **${guilds.length}**\n${this.client.services.lang.get("main.developer_commands.guilds.total_user", locale)}: **${guilds.reduce((n, g) => n + g.memberCount, 0)}**\n\n`
        for (let i = page*10; (i < guilds.length && i < 10*(page+1)); i++) {
            const g = guilds[i]
            const mCount = this.client.util.razbitNumber(g.memberCount)
            text += `**${i+1})** \`${g.name}\` — ${g?.vanityURLCode ? `[${mCount}]` : mCount}${g?.vanityURLCode ? `(https://discord.gg/${g.vanityURLCode})` : ''}` + '\n'
        }

        embed.setDescription(text)

        return embed
    }

    info(guilds: { id: string, memberCount: number }[][], color: ColorResolvable, pings: number[], locale: Locale) {
        const embed = this
        .color(color)
        .setTitle(`${this.client.services.lang.get("commands.info.hello", locale)}`)
        .setThumbnail(this.client.util.getAvatar(this.client.user))

        const packages = require('../../../package.json') as any

        let allMemberCount = 0
        for ( let i = 0; guilds.length > i; i++ ) {
            const memberCount = guilds[i].reduce((n, g) => n + g.memberCount, 0)
            embed.addFields(
                {
                    name: `> ${this.client.util.getPingEmoji(pings[i])} ${this.client.services.lang.get("commands.info.cluster", locale)} \`#${i+1}\``,
                    value: `・${this.client.services.lang.get("commands.info.ping", locale)}: ${pings[i]}\n・${this.client.services.lang.get("commands.info.servers", locale)}: **${guilds[i].length}**\n・${this.client.services.lang.get("commands.info.users", locale)}: **${memberCount}**`,
                    inline: true
                }
            )

            allMemberCount += memberCount
        }

        embed.addFields(
            {
                name: `> ${this.client.emoji.info.dev} ${this.client.services.lang.get("commands.antinuke.main", locale)}:`,
                value: (
                    `・${this.client.services.lang.get("commands.info.developers", locale)}: ${this.client.config.developers.map((id) => (`\`${this.client.users.cache.get(id)?.username || 'unknown'}\``)).join(' | ')} \n・${this.client.services.lang.get("commands.info.build", locale)}: \`Discord.js ${packages['dependencies']['discord.js'].replace('^', '')}\` | \`TypeScript ${packages['dependencies']['typescript'].replace('^', '')}\`` + '\n'
                )
            },
            {
                name: `> ${this.client.emoji.info.members} ${this.client.services.lang.get("commands.info.statistic", locale)}:`,
                value: `・${this.client.services.lang.get("commands.info.servers", locale)}: \`${guilds.flat().length}\`\n・${this.client.services.lang.get("commands.info.users", locale)}: \`${allMemberCount}\``,
                inline: true
            },
            {
                name: `> ${this.client.emoji.info.computer} ${this.client.services.lang.get("commands.info.system", locale)}:`,
                value: `・${this.client.services.lang.get("commands.info.platform", locale)}: \`${process.platform}\`\n・${this.client.services.lang.get("commands.info.uptime", locale)}: <t:${Math.round((Date.now()-this.client.uptime)/1000)}:R>`,
                inline: true
            }
        )
        .setTimestamp()

        return embed
    }

    autoRoles(member: GuildMember, color: ColorResolvable, ids: Snowflake[], locale: Locale) {
        const embed = this.default(member, color, `${this.client.services.lang.get("autorole.auto_role", locale)}`, locale, `${this.client.services.lang.get("autorole.select", locale)}`)

        const roles = member.guild.roles.cache.filter((r) => ids.includes(r.id)).map((r) => `・${r.toString()}`)
        if(roles.length > 0) {
            embed.addFields(
                {
                    name: `> ${this.client.services.lang.get("autorole.active_roles", locale)}:`,
                    value: roles.join('\n')
                }
            )
        }

        return embed
    }

    
    gameRoles(member: GuildMember, color: ColorResolvable, positionId: string, locale: Locale) {
        const embed = this.default(member, color, 'Авто выдача игровые роли', locale, `что Вы **хотите** сделать?`)

        const role = member.guild.roles.cache.get(positionId)
        if(role) {
            embed.addFields(
                {
                    name: `> Роль позиции:`,
                    value: role.toString()
                }
            )
        }

        return embed
    }

    manageAudit(member: GuildMember, color: ColorResolvable, doc: IAudit, locale: Locale, page: number = 0) {
        const array = this.client.services.constants.auditTypes
        let text: string = ''
        for ( let i = page*10; (i < array.length && i < 10*(page+1)) ; i++ ) {
            const type = array[i]
            const channelId = doc.types.find((t) => t.type === type)?.channelId
            text += (`・${this.client.db.audits.resolveAuditType(type as IAuditType, locale)}: **${channelId && member.guild.channels.cache.has(channelId) ? `<#${channelId}>` : 'нет'}**` + '\n')
        }

        return this.default(member, color, `Аудит — ${member.guild.name}`, locale, null)
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(array, 10)}` })
        .setDescription(`${member.toString()}, что Вы **хотите** сделать?\n\n> Список каналов аудита:\n${text}`)
    }

    async serverinfo(guild: Guild, color: ColorResolvable, locale: Locale) {
        const bots = guild.members.cache.filter((m) => m.user.bot).size
        const owner = await guild.fetchOwner().catch(() => null)
        const voices = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
        const texts = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
        return this.color(color)
        .setTitle(`${this.client.services.lang.get("commands.serverinfo.info", locale)} ${guild.name}`)
        .setThumbnail(this.client.util.getIcon(guild))
        .setImage(this.client.util.getBanner(guild))
        .setDescription(
            `**${this.client.services.lang.get("commands.serverinfo.owner", locale)}:** <@!${guild.ownerId}> | \`${owner?.user?.username || 'unknown'}\`` + '\n'
            + `**${this.client.services.lang.get("commands.serverinfo.image", locale)}:** [${this.client.services.lang.get("commands.serverinfo.icon", locale)}](${this.client.util.getIcon(guild)})${guild?.banner ? ` | [${this.client.services.lang.get("commands.serverinfo.banner", locale)}](${this.client.util.getBanner(guild)})` : ''}${guild?.splash ? ` | [${this.client.services.lang.get("commands.serverinfo.splash", locale)}](${this.client.util.getSplash(guild)})` : ''}` + '\n'
            + `**${this.client.services.lang.get("commands.serverinfo.verify", locale)}:** ${this.client.util.getVerify(guild.verificationLevel, locale)}` + '\n'
            + `**${this.client.services.lang.get("commands.serverinfo.description", locale)}:** ${guild.description ?? `${this.client.services.lang.get("commands.serverinfo.missings", locale)}`}`
        )
        .addFields(
            {
                name: `> ${this.client.services.lang.get("commands.serverinfo.users", locale)}:`,
                inline: true,
                value: `${this.client.services.lang.get("commands.serverinfo.total", locale)}: **${guild.memberCount}** \n${this.client.services.lang.get("commands.serverinfo.people", locale)}: **${guild.memberCount-bots}**\n${this.client.services.lang.get("commands.serverinfo.bots", locale)}: **${bots}**`
            },
            {
                name: `> ${this.client.services.lang.get("commands.serverinfo.channels", locale)}:`,
                inline: true,
                value: `${this.client.services.lang.get("commands.serverinfo.total", locale)}: **${guild.channels.cache.size}** \n${this.client.services.lang.get("commands.serverinfo.texts", locale)}: **${texts}**\n${this.client.services.lang.get("commands.serverinfo.voices", locale)}: **${voices}**`
            },
            {
                name: `> ${this.client.services.lang.get("commands.serverinfo.afk", locale)}:`,
                inline: false,
                value: `${this.client.services.lang.get("commands.serverinfo.channel", locale)}: ${guild.afkChannelId ? `<#${guild.afkChannelId}>` : `${this.client.services.lang.get("commands.serverinfo.missings", locale)}`}\n${this.client.services.lang.get("commands.serverinfo.timeout", locale)}: **${Math.round(guild.afkTimeout / 60)}${this.client.services.lang.get("main.time.m", locale)}**`
            },
            {
                name: `> ${this.client.services.lang.get("commands.serverinfo.other", locale)}:`,
                inline: true,
                value: `${this.client.services.lang.get("commands.serverinfo.roles", locale)}: **${guild.roles.cache.size}**\n${this.client.services.lang.get("commands.serverinfo.emoji", locale)}: **${guild.emojis.cache.size}**`
            },
            {
                name: `> ${this.client.services.lang.get("commands.serverinfo.boosts", locale)}:`,
                inline: true,
                value: `${this.client.services.lang.get("commands.serverinfo.level", locale)}: **${guild.premiumTier}**\n${this.client.services.lang.get("commands.serverinfo.boosts_total", locale)}: **${guild.premiumSubscriptionCount}**`
            },
            {
                name: `> ${this.client.services.lang.get("commands.serverinfo.date_creation", locale)}:`,
                inline: false,
                value: `<t:${Math.round( guild.createdTimestamp / 1000)}:f> \n<t:${Math.round( guild.createdTimestamp / 1000)}:R>`
            },
        )
        .setFooter({ text: `ID: ${guild.id}・${this.client.services.lang.get("commands.serverinfo.segments", locale)}: #${guild.shardId+1} (${this.client.util.getClusterName(this.client.cluster.id+1)})` })
    }

    async userinfo(member: GuildMember, color: ColorResolvable, locale: Locale) {
        const user = await member.user.fetch()

        const embeds: EmbedBuilder[] = []

        embeds.push(
            this.color(color)
            .setTitle(user.username)
            .setImage(this.client.util.getAvatar(user))
            .setURL(`https://discord.com/users/${member.id}`)
            .setFooter({ text: `ID: ${member.id}` })
            .setTimestamp()
        )

        if(member.displayName !== (user.globalName ?? user.username)) {
            embeds[0].addFields({ name: '> Серверный ник:', value: member.displayName })
        }

        embeds[0].addFields(
            {
                name: `> Роли: ${member.roles.cache.size - 1}`,
                value: member.roles.cache.map(r => `${r}`).filter((a,i)=>i<10).join(' | ').replace("| @everyone", " ")
            },
            {
                name: '> Аккаунт создан:',
                inline: true,
                value: `<t:${Math.round(user.createdTimestamp / 1000)}:f>`
            },
            {
                name: '> Зашел на сервер:',
                inline: true,
                value: `<t:${Math.round((member.joinedTimestamp || 1) / 1000)}:f>`
            }
        )

        if(user?.banner) {
            embeds.push(this.color(color).setImage(this.client.util.getBanner(user)))
        }

        return embeds
    }

    emojis(interaction: CommandInteraction<'cached'>, color: ColorResolvable, emojis: Emoji[], page: number = 0) {
        let text: string = ''
        for ( let i = page*15; (i < emojis.length && i < 15*(page+1)) ; i++ ) {
            const e = emojis[i]
            text += (`${e.toString()} - [\`<${e.animated?'a':''}:${e.name}:${e.id}>\`](${e.url})` + '\n')
        }

        return this.default(interaction.member, color, `Эмодзи сервера ${interaction.guild.name}`, interaction.locale, null)
        .setDescription(text || 'Пусто')
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(emojis, 15)}` })
    }

    nicknames(interaction: CommandInteraction<'cached'>,  color: ColorResolvable, target: GuildMember, nicknames: IGuildMemberHistoryNickname[], locale: Locale, page: number = 0) {
        let df: string = ''
        let ef: string = ''
        for ( let i = page*5; (i < nicknames.length && i < 5*(page+1)) ; i++ ) {
            const n = nicknames[i]
            const e = interaction.guild.members.cache.get(n.executorId)
            df += `<t:${Math.round(n.updatedTimestamp / 1000)}:t> <t:${Math.round(n.updatedTimestamp / 1000)}:d> ${e ? e.toString() : n.executorId}` + '\n'
            ef += `\`${n.old}\` -> \`${n.new}\`` + '\n'
        }

        const embed =  this.default(interaction.member, color, `История неймнеймов`, locale, null, { indicateTitle: true, target })
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(nicknames, 5)}` })

        if(df && ef) {
            embed.addFields(
                {
                    name: '> Дата/Исполнитель:',
                    value: df,
                    inline: true
                },
                {
                    name: '> Никнейм:',
                    value: ef,
                    inline: true
                }
            )
        } else {
            embed.setDescription(df || 'Пусто')
        }

        return embed
    }

    pushments(interaction: CommandInteraction<'cached'>, color: ColorResolvable, target: GuildMember, pushments: IGuildMemberHistoryAction[], locale: Locale, page: number = 0) {
        let text: string = ''
        for ( let i = page*8; (i < pushments.length && i < 8*(page+1)) ; i++ ) {
            const p = pushments[i]
            const e = interaction.guild.members.cache.get(p.executorId)
            text += (
                `[<t:${Math.round(p.createdTimestamp / 1000)}:f>] ${e ? e.toString() : p.executorId}` + '\n'
                + `> \`${p?.reason || 'Без причины'}\` на ${p.time}`
            )
        }

        return this.default(interaction.member, color, `История нарушений`, locale, null, { indicateTitle: true, target })
        .setDescription(text || 'Пусто')
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(pushments, 8)}` })
    }

    playlist(res: { playlistInfo: { name: string } | null, data: any[] }, color: ColorResolvable, locale: Locale) {
        return this.color(color)
        .setAuthor({ name: `Был добавлен в очередь плейлист "${res.playlistInfo!.name}" состоящий из ${res.data.length} треков` })
    }

    track(queue: Queue, color: ColorResolvable) {
        const track = this.client.util.endElement(queue.tracks)
        return this.color(color)
        .setAuthor({ name: `Был добавлен в очередь трек "${track.info.author} — ${track.info.title}"` })
    }

    playerEnd(track: Track, color: ColorResolvable, locale: Locale, pausedTimestamp: number) {
        return this.color(color)
        .setAuthor({ name: track.info.author })
        .setTitle(track.info.title).setURL(track.info.uri!)
        .setThumbnail(track?.thumbnail || null)
        .addFields(
            {
                name: `> Статус:`,
                value: (
                    `Прослушано (${this.client.player.formatLength(Date.now()-track.startPlaying-(pausedTimestamp === 0 ? 0 : Date.now()-pausedTimestamp))})`
                    + ' — ' + `${track.user.username}`
                )
            }
        )
        .setTimestamp()
    }

    player(queue: Queue, node: Node, color: ColorResolvable, locale: Locale) {
        const track = queue.tracks[0]!
        const memory = Math.round((node.stats!.memory.used / os.totalmem()) * 100)
        const embed = this.color(color)
        .setAuthor({ name: track.info.author })
        .setTitle(track.info.title).setURL(track.info.uri!)
        .setThumbnail(track?.thumbnail || null)
        .addFields(
            {
                name: `> Запрос от ${track.user.username}:`,
                value: (
                    `${this.client.emoji.music[queue.player.paused ? 'pause' : 'play']}` + ' '
                    + `${this.client.player.getProgress(track, queue.pausedTimestamp)}` + '\n'
                    + `Играет — \`[${this.client.player.formatLength(Date.now()-track.startPlaying-(queue.pausedTimestamp === 0 ? 0 : Date.now()-queue.pausedTimestamp))}` + '/'
                    + `${this.client.player.formatLength(track.info.length)}]\``
                )
            }
        )
        .setFooter(
            {
                iconURL: (this.client.util.getAvatar(this.client.user) || undefined),
                text: `Нагрузка: ${memory}% (${node.name}, Голосовых соединений: ${node?.stats?.players || 1})`
            }
        )

        return embed
    }

    queue(interaction: CommandInteraction<'cached'>, color: ColorResolvable, tracks: Track[], locale: Locale, page: number = 0) {
        let text: string = `**Сейчас играет:** [${tracks[0].info.title}](${tracks[0].info.uri})` + '\n\n'
        for ( let i = page*12-1; (i < tracks.length && i < 12*(page+1)) ; i++ ) {
            const track = tracks[i]
            text += `**${i})** [${track.info.title}](${track.info.uri}) | \`${this.client.player.formatLength(track.info.length)}\` | \`${track.user.username}\`` + '\n'
        }

        return this.default(interaction.member, color, `Очередь сервера ${interaction.guild.name}`, interaction.locale, null)
        .setDescription(text || 'Пусто')
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(tracks, 12)}` })
    }

    manageSeek(queue: Queue, color: ColorResolvable, locale: Locale) {
        const track = queue.tracks[0]!
        return this.color(color)
        .setTitle('Управление позицией')
        .addFields(
            {
                name: '> Текущая позиция:',
                inline: true,
                value: `${this.client.player.formatLength(Date.now()-track.startPlaying-(queue.pausedTimestamp === 0 ? 0 : Date.now()-queue.pausedTimestamp))}`
            },
            {
                name: '> Длительность трека:',
                inline: true,
                value: `${this.client.player.formatLength(track.info.length)}`
            }
        )
    }

    manageVolume(volume: number, color: ColorResolvable, locale: Locale) {
        return this.color(color)
        .setTitle('Управление громкостью')
        .addFields(
            {
                name: 'Громкость:',
                value: String(volume)
            }
        )
    }


    playlistInfo(guild: Guild, color: ColorResolvable, playlist: IPlaylist) {
        const member = guild.members.cache.get(playlist.userId)
        const embed = this.color(color)
        .setTitle(`Плейлист — ${playlist.name}`)
        .setThumbnail(playlist.isLove ? 'https://cdn.discordapp.com/avatars/758717520525000794/fa48d5ff09ac7f25c908b46355273fa9.png?size=4096' : !playlist.image ? 'https://cdn.discordapp.com/avatars/758717520525000794/fa48d5ff09ac7f25c908b46355273fa9.png?size=4096' : playlist.image)
        .addFields(
            {
                name: '> Автор',
                value: this.client.util.toCode(member?.user ? member.user.tag : playlist.userId),
                inline: true
            },
            {
                name: '> Треков',
                value: this.client.util.toCode(playlist.tracks.length),
                inline: true
            }
        )

        if(playlist.type !== 'Private') {
            embed.addFields(
                { name: '> Нравится', value: this.client.util.toCode(playlist.likes.length), inline: true}
            )
        }

        return embed
    }

    playlistTracks(interaction: CommandInteraction<'cached'>, color: ColorResolvable, playlist: TPlaylist, locale: Locale, page: number = 0) {
        let text: string = ''
        for ( let i = page*8; (i < playlist.tracks.length && i < 8*(page+1)); i++ ) {
            const track = playlist.tracks[i]
            text += (`**${i+1})** [${track.author} — ${track.title}](${track.uri})` + '\n')
        }

        return this.default(interaction.member, color, `Треки плейлиста ${playlist.name}`, locale, null)
        .setDescription(text || 'Пусто')
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(playlist.tracks, 8)}` })
    }

    lyric(title: string | undefined, color: ColorResolvable, array: string[], page: number = 0) {
        const lyric = array[page]
        
        return this.color(color)
        .setTitle(title || 'Названия трека не найдено')
        .setDescription(lyric)
        .setFooter({ text: `Страница: ${page+1}/${this.client.util.getMaxPage(array, 1)}` })
    }
}