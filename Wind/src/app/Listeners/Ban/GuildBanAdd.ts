import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildBan,
} from "discord.js";

export default new BaseListener(
    { name: 'guildBanAdd' },
    async (client, ban: GuildBan) => {
        const res = await client.db.crashs.get(ban.guild.id)

        if(res.status) {
            await client.db.crashs.push(ban.guild, res, AuditLogEvent.MemberBanAdd, 'MemberBan', { guild: ban.guild, bannedUser: ban.user })
        }

        const auditChannel = await client.db.audits.resolveChannel(ban.guild, 'GuildBanAdd')
        if(!auditChannel) return

        const embed = client.storage.embeds.red()
        .setAuthor(
            {
                name: ban.user.bot ? 'Бот заблокирован' : 'Участник заблокирован',
                iconURL: client.icons['Member']['Red']
            }
        )
        .setThumbnail(ban.guild.iconURL())
        .setImage(client.icons['Guild']['Line'])

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: `> ${client.db.audits.getMemberName(ban.guild, ban.user)}:`,
                inline: true,
                value: `・${ban.user.toString()} \n・${ban.user.tag} \n・${ban.user.id}`
            }
        )

        const action = await client.db.audits.getAudit(ban.guild, AuditLogEvent.MemberBanAdd)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Заблокировал:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: true
                }
            )
            .setImage(client.icons['Guild']['Line'])
            .setThumbnail(client.util.getAvatar(action.executor))
        }

        const fetchBan = await ban.fetch().catch(() => null)

        if(fetchBan?.reason) {
            embed.addFields(
                {
                    name: '> Причина:',
                    value: `・\`${String(fetchBan.reason)}\``,
                    inline: false
                }
            )
        }

        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)