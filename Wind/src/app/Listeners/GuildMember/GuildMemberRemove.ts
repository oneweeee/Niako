import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildMember,
} from "discord.js";

export default new BaseListener(
    { name: 'guildMemberRemove' },
    async (client, member: GuildMember) => {
        const res = await client.db.crashs.get(member.guild.id)

        if(res.whiteList.includes(member.id)) {
            res.whiteList.splice(res.whiteList.indexOf(member.id), 1)
            await client.db.crashs.save(res)
        
            await client.managers.audit.send(
                res.channelId, {
                    action: 'AntiCrashWhitelistRemove',
                    system: 'Crash',
                    locale: client.db.guilds.getLocale(member.guild),
                    reason: 'Выход с сервера',
                    remove: member
                }
            )
        }

        if(res.status) {
            await client.db.crashs.push(member.guild, res, AuditLogEvent.MemberKick, 'MemberKick', { member: member })
        }
        
        const auditChannel = await client.db.audits.resolveChannel(member.guild, ['GuildMemberRemove', 'GuildBotRemove'])
        if(!auditChannel) return

        const embed = client.storage.embeds.red()
        .setAuthor(
            {
                name: (member.user.bot ? 'Бота выгнали с сервера' : 'Пользователь вышел с сервера'),
                iconURL: client.icons[member.user.bot ? 'Bot' : 'Member']['Red']
            }
        )
        .setImage(client.icons['Guild']['Line'])
        .setThumbnail(client.util.getAvatar(member))
        
        .addFields(
            {
                name: '> Дата выхода:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: `> ${client.db.audits.getMemberName(member.guild, member.user)}:`,
                inline: true,
                value: `・${member.toString()} \n・${member.user.tag} \n・${member.user.id}`
            },
            {
                name: '> Дата создания аккаунта:',
                inline: true,
                value: `・<t:${Math.round(member.user.createdTimestamp / 1000)}:f> \n・<t:${Math.round(member.user.createdTimestamp / 1000)}:R>`
            }
        )

        if(member.user.bot) {
            const action = await client.db.audits.getAudit(member.guild, AuditLogEvent.BotAdd)
            if(action && action?.executor) {
                embed.addFields(
                    {
                        name: '> Выгнал:',
                        value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                        inline: false
                    }
                )
            }
        }

        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)