import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    Guild,
    Invite,
} from "discord.js";

export default new BaseListener(
    { name: 'inviteCreate' },
    async (client, invite: Invite) => {
        if(!(invite.guild instanceof Guild)) return

        client.services.invites.inviteCreate(invite)

        const auditChannel = await client.db.audits.resolveChannel(invite.guild, 'InviteCreate')
        if(!auditChannel) return

        const embed = client.storage.embeds.green()
        .setAuthor(
            {
                name: 'Создание приглашения',
                iconURL: client.icons['Invite']['Green']
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

        const action = await client.db.audits.getAudit(invite.guild, AuditLogEvent.InviteCreate)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Создал:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: false
                }
            )
        }
        
        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)