import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    Role,
} from "discord.js";

export default new BaseListener(
    { name: 'roleCreate' },
    async (client, role: Role) => {
        const res = await client.db.crashs.get(role.guild.id)

        if(res.status) {
            if(role.permissions.has('Administrator')) {
                await client.db.crashs.push(role.guild, res, AuditLogEvent.RoleCreate, 'CreateAdminRole', { role })
            } else {
                await client.db.crashs.push(role.guild, res, AuditLogEvent.RoleCreate, 'CreateRole', { role })
            }
        }

        const auditChannel = await client.db.audits.resolveChannel(role.guild, 'RoleCreate')
        if(!auditChannel) return

        const embed = client.storage.embeds.green()
        .setAuthor(
            {
                name: 'Создание роли',
                iconURL: client.icons['Role']['Green']
            }
        )
        .setImage(client.icons['Guild']['Line'])

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Роль:',
                inline: true,
                value: `・${role.toString()} \n・${role.name} \n・${role.id}`
            }
        )

        const action = await client.db.audits.getAudit(role.guild, AuditLogEvent.RoleCreate)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: 'Создал',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: true
                }
            )
            .setThumbnail(client.util.getAvatar(action.executor))
        }

        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)