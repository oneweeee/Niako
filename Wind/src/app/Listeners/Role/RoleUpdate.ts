import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    Role,
} from "discord.js";

export default new BaseListener(
    { name: 'roleUpdate' },
    async (client, oldRole: Role, newRole: Role) => {
        if(oldRole?.position !== newRole?.position) return

        const res = await client.db.crashs.get(oldRole.guild.id)

        if(res.status) {
            if(!oldRole.permissions.has('Administrator') && newRole.permissions.has('Administrator')) {
                await client.db.crashs.push(oldRole.guild, res, AuditLogEvent.RoleUpdate, 'AddRoleAdminPerms', { role: newRole, oldRole: oldRole })
            } else if(
                oldRole.name !== newRole.name || oldRole.hexColor !== newRole.hexColor || oldRole.icon !== newRole.icon
                || oldRole.hoist !== newRole.hoist || oldRole.mentionable !== newRole.mentionable
                || oldRole.permissions.toArray().length !== newRole.permissions.toArray().length
            ) {
                await client.db.crashs.push(oldRole.guild, res, AuditLogEvent.RoleUpdate, 'EditRole', { oldRole, role: newRole })
            }
        }

        const auditChannel = await client.db.audits.resolveChannel(oldRole.guild, 'RoleUpdate')
        if(!auditChannel) return

        let updated = false
        const embed = client.storage.embeds.yellow()
        .setAuthor(
            {
                name: 'Изменение роли',
                iconURL: client.icons['Role']['Yellow']
            }
        )
        .setImage(client.icons['Guild']['Line']).addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            }
        )

        const action = await client.db.audits.getAudit(oldRole.guild, AuditLogEvent.RoleUpdate)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Изменил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: true
                }
            )
            .setThumbnail(client.util.getAvatar(action.executor))
        }
        
        if(oldRole.name !== newRole.name) {
            updated = true
            embed.addFields(
                {
                    name: '> Название:',
                    inline: false,
                    value: `・\`${oldRole.name}\` ➞ \`${newRole.name}\``
                }
            )
        } else {
            embed.addFields(
                {
                    name: '> Роль:',
                    inline: false,
                    value: `・${oldRole.toString()} \n・${oldRole.name} \n・${oldRole.id}`
                }
            )
        }

        if(oldRole.hexColor !== newRole.hexColor) {
            updated = true
            const oldState = oldRole.hexColor
            const newState = newRole.hexColor
            embed.addFields(
                {
                    name: '> Цвет:',
                    value: `・\`${oldState}\` ➞ \`${newState}\``
                }
            )
        }

        if(oldRole.icon !== newRole.icon) {
            updated = true
            const oldState = oldRole.icon ? `[Перейти](${client.util.getIcon(oldRole)})` : '\`Без иконки\`'
            const newState = newRole.icon ? `[Перейти](${client.util.getIcon(newRole)})` : '\`Без иконки\`'
            embed.addFields(
                {
                    name: '> Иконка:',
                    value: `・${oldState} ➞ ${newState}`
                }
            )
        }

        if(oldRole.hoist !== newRole.hoist) {
            updated = true
            const oldState = oldRole.hoist ? 'Да' : 'Нет'
            const newState = newRole.hoist ? 'Да' : 'Нет'
            embed.addFields(
                {
                    name: '> Отображать отдельно:',
                    value: `・\`${oldState}\` ➞ \`${newState}\``
                }
            )
        }

        if(oldRole.mentionable !== newRole.mentionable) {
            updated = true
            const oldState = oldRole.mentionable ? 'Да' : 'Нет'
            const newState = newRole.mentionable ? 'Да' : 'Нет'
            embed.addFields(
                {
                    name: '> Разрешить упоминать:',
                    value: `・\`${oldState}\` ➞ \`${newState}\``
                }
            )
        }

        if(oldRole.permissions.toArray().length !== newRole.permissions.toArray().length) {
            const resolve = client.util.resolveEditingPermissions(oldRole.permissions, newRole.permissions)

            if(resolve.allow.length > 0) {
                updated = true
                embed.addFields(
                    {
                        name: '> Выдали права доступа:',
                        value: resolve.allow.map((p) => `\`${p}\``).join(', ')
                    }
                )
            }

            if(resolve.deny.length > 0) {
                updated = true
                embed.addFields(
                    {
                        name: '> Забрали права доступа:',
                        value: resolve.deny.map((p) => `\`${p}\``).join(', ')
                    }
                )
            }
        }


        if(updated) return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)