import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildBan,
} from "discord.js";

export default new BaseListener(
    { name: 'guildBanRemove' },
    async (client, ban: GuildBan) => {
        const res = await client.db.crashs.get(ban.guild.id)

        if(res.status) {
            await client.db.crashs.push(ban.guild, res, AuditLogEvent.MemberBanRemove, 'MemberUnban', { bannedUser: ban.user })
        }

        const auditChannel = await client.db.audits.resolveChannel(ban.guild, 'GuildBanRemove')
        if(!auditChannel) return

        const embed = client.storage.embeds.green()
        .setAuthor(
            {
                name: ban.user.bot ? 'Бот разблокирован' : 'Участник разблокирован',
                iconURL: client.icons['Member']['Green']
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

        const action = await client.db.audits.getAudit(ban.guild, AuditLogEvent.MemberBanRemove)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Разблокировал:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: true
                }
            )
            .setImage(client.icons['Guild']['Line'])
            .setThumbnail(client.util.getAvatar(action.executor))
        }
        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)