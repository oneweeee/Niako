import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Role
} from "discord.js";

export default new BaseEvent(

    {
        name: 'roleUpdate'
    },

    async (client: NiakoClient, oldRole: Role, newRole: Role) => {
        if(oldRole.position !== newRole.position) return

        const doc = await client.db.modules.audit.get(oldRole.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'roleUpdate')
            if(getConfig && getConfig.state) {
                const logger = oldRole.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    let updated = false
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: 'Изменение роли', iconURL: client.config.icons['Role']['Yellow'] })
                    .setFooter({ text: `Id роли: ${oldRole.id}` })
                    .setTimestamp()
                    
                    if(oldRole.name !== newRole.name) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Название',
                                inline: true,
                                value: `\`${oldRole.name}\` ➞ \`${newRole.name}\``
                            }
                        )
                    } else {
                        embed.addFields(
                            {
                                name: 'Роль',
                                inline: true,
                                value: `${oldRole.toString()} | \`${oldRole.name}\``
                            }
                        )
                    }

                    const action = (await oldRole.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.RoleUpdate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Изменил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    if(oldRole.hexColor !== newRole.hexColor) {
                        updated = true
                        const oldState = oldRole.hexColor
                        const newState = newRole.hexColor
                        embed.addFields(
                            {
                                name: 'Цвет',
                                value: `\`${oldState}\` ➞ \`${newState}\``
                            }
                        )
                    }

                    if(oldRole.icon !== newRole.icon) {
                        updated = true
                        const oldState = oldRole.icon ? `[Перейти](${client.util.getIcon(oldRole)})` : '\`Нет\`'
                        const newState = newRole.icon ? `[Перейти](${client.util.getIcon(newRole)})` : '\`Нет\`'
                        embed.addFields(
                            {
                                name: 'Иконка',
                                value: `${oldState} ➞ ${newState}`
                            }
                        )
                    }

                    if(oldRole.hoist !== newRole.hoist) {
                        updated = true
                        const oldState = oldRole.hoist ? 'Да' : 'Нет'
                        const newState = newRole.hoist ? 'Да' : 'Нет'
                        embed.addFields(
                            {
                                name: 'Отображать отдельно',
                                value: `\`${oldState}\` ➞ \`${newState}\``
                            }
                        )
                    }

                    if(oldRole.mentionable !== newRole.mentionable) {
                        updated = true
                        const oldState = oldRole.mentionable ? 'Да' : 'Нет'
                        const newState = newRole.mentionable ? 'Да' : 'Нет'
                        embed.addFields(
                            {
                                name: 'Разрешить упоминать',
                                value: `\`${oldState}\` ➞ \`${newState}\``
                            }
                        )
                    }

                    if(oldRole.permissions.toArray().length !== newRole.permissions.toArray().length) {
                        const resolve = client.util.resolveEditingPermissions(oldRole.permissions, newRole.permissions)

                        if(resolve.allow.length > 0) {
                            updated = true
                            embed.addFields(
                                {
                                    name: 'Выдали права доступа',
                                    value: resolve.allow.map((p) => `\`${p}\``).join(', ')
                                }
                            )
                        }

                        if(resolve.deny.length > 0) {
                            updated = true
                            embed.addFields(
                                {
                                    name: 'Забрали права доступа',
                                    value: resolve.deny.map((p) => `\`${p}\``).join(', ')
                                }
                            )
                        }
                    }

                    if(updated) return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)