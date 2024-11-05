import { ICrashActionType, ICrashPush } from "#db/crash/CrashSchema"
import WindClient from "../WindClient"
import {
    ChannelType,
    EmbedBuilder,
    GuildChannel,
    GuildEmoji,
    GuildMember,
    Locale,
    Role,
    User
} from "discord.js"

type IActionAuditLog = (
    'AntiRaidOn' | 'AntiRaidOff' | 'AntiRaidChannelLogEdit' | 'AntiRaidChannelLogReset' |
    'AntiRaidMemberCountEdit' | 'AntiRaidTimeJoinEdit' | 'AntiRaidPushEdit' |
    'AntiCrashOn' | 'AntiCrashOff' | 'AntiCrashChannelLogEdit' | 'AntiCrashChannelLogReset' |
    'AntiCrashWhitelistAdd' | 'AntiCrashWhitelistRemove' | 'AntiCrashRoleReset' | 'AntiCrashRoleEdit' |
    'AutoTempBanWarns' | 'AntiCrashWarnCountEdit'
)

interface IActionLoggerSendOptions {
    system: 'Raid' | 'Crash',
    action: IActionAuditLog | ICrashActionType,
    locale: Locale,
    actionForMember?: ICrashPush,
    member?: GuildMember,
    customMember?: GuildMember,
    add?: GuildMember,
    remove?: GuildMember,
    bannedUser?: User,
    emoji?: GuildEmoji,
    role?: Role,
    reason?: string,
    channel?: GuildChannel,
    nukeChannel?: GuildChannel,
    oldChannel?: GuildChannel | string,
    newChannel?: GuildChannel | string,
    oldRole?: Role | string,
    newRole?: Role | string,
    custom?: string,
    bot?: GuildMember,
    old?: any,
    new?: any,
    warns?: number
}

export default class AuditManager {
    constructor(
        private client: WindClient
    ) {}

    private actionAuthor(type: 'Raid' | 'Crash', locale: string): string {
        switch(type) {
            case 'Raid':
                return `${this.client.services.lang.get("commands.antinuke.logs.antiraid", locale)}`
            case 'Crash':
                return `${this.client.services.lang.get("commands.antinuke.logs.anticrash", locale)}`
        }
    }

    private actionTitle(type: IActionAuditLog | ICrashActionType, warns: number, locale: string): string {
        switch(type) {
            case 'AntiRaidOn':
                return `${this.client.services.lang.get("commands.antinuke.logs.antiraid_on", locale)}`
            case 'AntiRaidOff':
                return `${this.client.services.lang.get("commands.antinuke.logs.antiraid_off", locale)}`
            case 'AntiRaidChannelLogEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.edit_notification_channel", locale)}`
            case 'AntiRaidChannelLogReset':
                return `${this.client.services.lang.get("commands.antinuke.logs.reset_notification_channel", locale)}`
            case 'AntiRaidMemberCountEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.count_edit", locale)}`
            case 'AntiRaidTimeJoinEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.time_join_edit", locale)}`
            case 'AntiRaidPushEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.push_edit", locale)}`
            case 'AntiCrashOn':
                return `${this.client.services.lang.get("commands.antinuke.logs.anticrash_on", locale)}`
            case 'AntiCrashOff':
                return `${this.client.services.lang.get("commands.antinuke.logs.anticrash_off", locale)}`
            case 'AntiCrashChannelLogEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.edit_notification_channel", locale)}`
            case 'AntiCrashChannelLogReset':
                return `${this.client.services.lang.get("commands.antinuke.logs.reset_notification_channel", locale)}`
            case 'AntiCrashWhitelistAdd':
                return `${this.client.services.lang.get("commands.antinuke.logs.whitelist_add", locale)}`
            case 'AntiCrashWhitelistRemove':
                return `${this.client.services.lang.get("commands.antinuke.logs.whitelist_remove", locale)}`
            case 'AntiCrashRoleReset':
                return `${this.client.services.lang.get("commands.antinuke.logs.reset_role", locale)}`
            case 'AntiCrashRoleEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.set_role", locale)}`
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
            case 'AutoTempBanWarns':
                return `${this.client.services.lang.get("commands.antinuke.logs.auto_warn", locale)}`.replace('5', String(warns))
            case 'AntiCrashWarnCountEdit':
                return `${this.client.services.lang.get("commands.antinuke.logs.edit_warn", locale)}`
            default:
                return type
        }
    }

    async send(channelId: string, data: IActionLoggerSendOptions) {
        const channel = this.client.channels.cache.get(channelId)
        if(channel && channel.type === ChannelType.GuildText) {
            const crashGuild = await this.client.db.crashs.get(channel.guildId)
            const components = []
            const embed = new EmbedBuilder()
            .setColor(this.client.config.Colors.Brand)
            .setImage(this.client.icons['Guild']['Line'])
            .setThumbnail(channel.guild.iconURL())
            .setTimestamp()
            .setAuthor(
                {
                    name: `${this.actionAuthor(data.system, data.locale)}: ${this.actionTitle(data.action, crashGuild.warnResolve, data.locale)}`,
                    iconURL: this.client.icons['Guild']['Antinuke']
                }
            )

            if(data?.member) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.user", data.locale)}:`,
                        value: `・${data.member.toString()} \n・${data.member.user.tag} \n・${data.member.id}`,
                        inline: true
                    }
                )
            }

            if(data?.channel) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.channel", data.locale)}:`,
                        value: `・ ${data.channel.toString()} \n・${data.channel.name} \n・${data.channel.id}`,
                        inline: true
                    }
                )
            }

            if(data?.bannedUser) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.banned", data.locale)}:`,
                        value: `・${data.bannedUser.toString()} \n・${data.bannedUser.tag} \n・${data.bannedUser.id}`,
                        inline: true
                    }
                )
            }

            if(data?.add) {
                if(data?.role) {
                    embed.addFields(
                        {
                            name: '\u200B',
                            value: '\u200B',
                            inline: true
                        }
                    )
                }

                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.added", data.locale)}:`,
                        value: `・${data.add.toString()} \n・${data.add.user.tag} \n・${data.add.id}`,
                        inline: Boolean(data?.role)
                    }
                )
            }

            if(data?.remove) {
                if(data?.role) {
                    embed.addFields(
                        {
                            name: '\u200B',
                            value: '\u200B',
                            inline: true
                        }
                    )
                }

                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.remove", data.locale)}:`,
                        value: `・${data.remove.toString()} \n・${data.remove.user.tag} \n・${data.remove.id}`,
                        inline: Boolean(data?.role)
                    }
                )
            }

            if(data?.role) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.role", data.locale)}:`,
                        value: `・${data.role.toString()} \n・${data.role.name} \n・${data.role.id}`,
                        inline: true
                    }
                )
            }

            if(data?.emoji) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.emoji", data.locale)}:`,
                        value: `・${data?.emoji.toString()} \n・${data?.emoji.name} \n・${data?.emoji.id}`,
                        inline: true
                    }
                )
            }

            if(data?.nukeChannel) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.channel", data.locale)}:`,
                        value: `・${data?.nukeChannel.toString()} \n・${data?.nukeChannel.name} \n・${data?.nukeChannel.id}`,
                        inline: true
                    }
                )
            }

            if(data?.bot) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.bot", data.locale)}:`,
                        value: `・${data.bot.toString()} \n・${data.bot.user.tag} \n・${data.bot.id}`,
                        inline: true
                    }
                )
            }
            
            if(data?.oldChannel) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.old_channel", data.locale)}:`,
                        value: typeof data.oldChannel === 'string' ? `・${this.client.services.lang.get("commands.antinuke.logs.off", data.locale)}` : `・${data.oldChannel.toString()} \n・${data.oldChannel.name} \n・${data.oldChannel.id}`,
                        inline: true
                    }
                )
            }

            if(data?.newChannel) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.new_channel", data.locale)}:`,
                        value: typeof data.newChannel === 'string' ? `・${this.client.services.lang.get("commands.antinuke.logs.off", data.locale)}` : `・${data.newChannel.toString()} \n・${data.newChannel.name} \n・${data.newChannel.id}`,
                        inline: true
                    }
                )
            }

            if(data?.oldRole) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.old_role", data.locale)}:`,
                        value: typeof data?.oldRole === 'string' ? `・${this.client.services.lang.get("commands.antinuke.logs.off", data.locale)}` : `・${data?.oldRole.toString()} \n・${data?.oldRole.name} \n・${data?.oldRole.id}`,
                        inline: true
                    }
                )
            }

            if(data?.newRole) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.new_role", data.locale)}:`,
                        value: typeof data?.newRole === 'string' ? `・${this.client.services.lang.get("commands.antinuke.logs.off", data.locale)}` : `・${data?.newRole.toString()} \n・${data?.newRole.name} \n・${data?.newRole.id}`,
                        inline: true
                    }
                )
            }

            if(data?.actionForMember) {
                if(data.actionForMember === 'Warn' && data.warns) {
                    embed.addFields(
                        {
                            name: `> ${this.client.services.lang.get("commands.antinuke.logs.warn", data.locale)}:`,
                            value: this.client.util.toCode(`${data.warns}/${crashGuild.warnResolve}`, 'js'),
                            inline: false
                        }
                    )
                }

                if(data.actionForMember === 'Lockdown' && data?.member) {
                    components.push(
                        this.client.storage.components.removeLockdown(data.member.id, data.locale)
                    )
                }
            }

            if(data.old) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.old_value", data.locale)}:`,
                        value: this.client.util.toCode(data.old, 'fix'),
                        inline: false
                    }
                )
            }

            if(data.new) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.new_value", data.locale)}:`,
                        value: this.client.util.toCode(data.new, 'fix'),
                        inline: false
                    }
                )
            }

            if(data.reason) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.new_value", data.locale)}:`,
                        value: this.client.util.toCode(data.reason, 'fix'),
                        inline: false
                    }
                )
            }

            if(data?.actionForMember) {
                embed.addFields(
                    {
                        name: `> ${this.client.services.lang.get("commands.antinuke.logs.action", data.locale)}:`,
                        value: this.client.util.toCode(this.client.util.resolvePushType(data?.actionForMember, data.locale), 'fix'),
                        inline: false
                    }
                )
            }

            return channel.send({
                embeds: [embed],
                components
            }).catch(() => {})
        }
    }
}