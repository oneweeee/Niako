import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildMember,
} from "discord.js";

export default new BaseListener(
    { name: 'guildMemberUpdate' },
    async (client, oldMember: GuildMember, newMember: GuildMember) => {
        const res = await client.db.crashs.get(oldMember.guild.id)

        if(res.status) {
            if(typeof oldMember.communicationDisabledUntilTimestamp === 'object' && typeof newMember.communicationDisabledUntilTimestamp === 'number') {
                await client.db.crashs.push(oldMember.guild, res, AuditLogEvent.MemberUpdate, 'MemberTimeout', { member: newMember })
            }

            if(newMember.roles.cache.size > oldMember.roles.cache.size) {
                await client.db.crashs.push(oldMember.guild, res, AuditLogEvent.MemberRoleUpdate, 'AddRoleDefault', { member: newMember })

                const auditChannel = await client.db.audits.resolveChannel(oldMember.guild, 'GuildMemberRoleAdd')
                if(!auditChannel) return

                const embed = client.storage.embeds.yellow()
                .setAuthor(
                    {
                        name: 'Изменинно роль участнику',
                        iconURL: client.icons['Member']['Yellow']
                    }
                )
                .setImage(client.icons['Guild']['Line'])
                .setThumbnail(client.util.getAvatar(oldMember.user))

                .addFields(
                    {
                        name: '> Дата:',
                        inline: false,
                        value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
                    },
                    {
                        name: '> Участник:',
                        inline: true,
                        value: `・${oldMember.toString()} \n・${oldMember.user.tag} \n・${oldMember.user.id}`
                    }
                )

                const action = await client.db.audits.getAudit(oldMember.guild, AuditLogEvent.MemberRoleUpdate)
                if(action && action?.executor) {
                    embed.addFields(
                        {
                            name: '> Выдал:',
                            value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                            inline: true
                        },
                        {
                            name: '> Выданы:',
                            value: (action.changes || []).filter((v) => v.key === '$add').map((v) => ((v?.new || []) as { name: string, id: string }[]).map((v) => `・<@&${v.id}> \n・${v.name} \n・${v.id}`).join('\n')).join('\n') || 'Ошибка, роль не существует'
                        }
                    )
                } else return

                return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
            }

            if(oldMember.roles.cache.size > newMember.roles.cache.size) {
                await client.db.crashs.push(oldMember.guild, res, AuditLogEvent.MemberRoleUpdate, 'RemoveRole', { member: newMember })
                
                const auditChannel = await client.db.audits.resolveChannel(oldMember.guild, 'GuildMemberRoleRemove')
                if(!auditChannel) return

                const embed = client.storage.embeds.yellow()
                .setAuthor(
                    {
                        name: 'Изменинно роль участнику',
                        iconURL: client.icons['Member']['Yellow']
                    }
                )
                .setImage(client.icons['Guild']['Line'])
                .setThumbnail(client.util.getAvatar(oldMember.user))

                .addFields(
                    {
                        name: '> Дата:',
                        inline: false,
                        value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
                    },
                    {
                        name: '> Участник:',
                        inline: true,
                        value: `・${oldMember.toString()} \n・${oldMember.user.tag} \n・${oldMember.user.id}`
                    }
                )

                const action = await client.db.audits.getAudit(oldMember.guild, AuditLogEvent.MemberRoleUpdate)
                if(action && action?.executor) {
                    embed.addFields(
                        {
                            name: '> Забрал:',
                            value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                            inline: true
                        },
                        {
                            name: '> Забраны:',
                            value: (action.changes || []).filter((v) => v.key === '$remove').map((v) => ((v?.new || []) as { name: string, id: string }[]).map((v) => `・<@&${v.id}> \n・${v.name} \n・${v.id}`).join('\n')).join('\n')  || 'Ошибка, роль не существует'
                        }
                    )
                } else return

                return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
            }

            if(newMember.displayName !== oldMember.displayName && newMember.user.username === oldMember.user.username) {
                await client.db.crashs.push(oldMember.guild, res, AuditLogEvent.MemberUpdate, 'EditNicknames', { member: newMember })

                const get = await client.db.guildMembers.get(oldMember)
                const pushed = { old: oldMember.displayName, new: newMember.displayName, executorId: '0', updatedTimestamp: Date.now() }

                const auditChannel = await client.db.audits.resolveChannel(oldMember.guild, 'GuildMemberNicknameUpdate')
                if(!auditChannel) return

                const embed = client.storage.embeds.yellow()
                .setAuthor(
                    {
                        name: 'Измененинно имя участнику',
                        iconURL: client.icons['Member']['Yellow']
                    }
                )
                .setImage(client.icons['Guild']['Line'])
                .setThumbnail(client.util.getAvatar(oldMember.user))

                .addFields(
                    {
                        name: '> Дата:',
                        inline: false,
                        value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
                    },
                    {
                        name: '> Участник',
                        inline: true,
                        value: `・${oldMember.toString()} \n・${oldMember.user.tag} \n・${oldMember.user.id}`
                    },
                    {
                        name: '> Имя:',
                        inline: true,
                        value: `\`${oldMember.displayName}\` ➞ \`${newMember.displayName}\``
                    }
                )

                const action = await client.db.audits.getAudit(oldMember.guild, AuditLogEvent.MemberUpdate)
                if(action && action?.executor) {
                    pushed['executorId'] = action.executor.id
                    embed.addFields(
                        {
                            name: '> Изменил:',
                            value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`
                        }
                    )
                }

                get.nicknames.push(pushed)
                await client.db.guildMembers.save(get)

                return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
            }
        }
    }
)