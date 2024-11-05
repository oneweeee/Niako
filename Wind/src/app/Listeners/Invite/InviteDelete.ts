import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    Guild,
    Invite,
} from "discord.js";

export default new BaseListener(
    { name: 'inviteDelete' },
    async (client, invite: Invite) => {
        if(!(invite.guild instanceof Guild)) return

        client.services.invites.inviteDelete(invite)

        const auditChannel = await client.db.audits.resolveChannel(invite.guild, 'InviteDelete')
        if(!auditChannel) return

        const embed = client.storage.embeds.red()
        .setAuthor(
            {
                name: 'Удаление приглашения',
                iconURL: client.icons['Invite']['Red']
            }
        )
        .setImage(client.icons['Guild']['Line'])
        .setThumbnail(client.util.getAvatar(invite.inviter!))

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Ссылка:',
                inline: false,
                value: `・[Перейти](https://discord.gg/${invite.code}) \n・${invite.code}`
            }
        )

        const action = await client.db.audits.getAudit(invite.guild, AuditLogEvent.InviteDelete)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Удалил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: false
                }
            )
        }
        
        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)