import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildMember
} from "discord.js";

export default new BaseEvent(

    {
        name: 'guildMemberUpdate'
    },

    async (client: NiakoClient, oldMember: GuildMember, newMember: GuildMember) => {
        if(oldMember.guild.premiumSubscriptionCount !== newMember.guild.premiumSubscriptionCount) {
            client.db.modules.banner.addUpdateGuild(newMember.guild.id)
        }

        if(oldMember.guild.id === client.config.meta.supportGuildId) {
            if(oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) {
                if(!oldMember.premiumSince) {
                    const have = (await client.db.boosts.filter({ userId: oldMember.id })).some((b) => b.gift)
                    if(!have) {
                        await client.db.boosts.create(oldMember.id, true)
                    }
                } else if(oldMember.premiumSince && !newMember.premiumSince) {
                    const find = (await client.db.boosts.filter({ userId: oldMember.id })).find((b) => b.gift)
                    if(find) {
                        await find.remove()
                    }
                }
            } else if(oldMember.roles.cache.size > newMember.roles.cache.size) {
                const roles = newMember.roles.cache.map((r) => r.id)
                const removed = oldMember.roles.cache.filter((r) => !roles.includes(r.id))

                const boosty = Object.keys(client.config.roles.boosty)

                if(removed.some((r) => boosty.includes(r.id))) {
                    await client.db.boosts.removeBoosts(oldMember.id)
                }
            } else if(newMember.roles.cache.size > oldMember.roles.cache.size) {
                const roles = oldMember.roles.cache.map((r) => r.id)
                const added = newMember.roles.cache.filter((r) => !roles.includes(r.id))

                const boosty = Object.keys(client.config.roles.boosty)
                const role = added.find((r) => boosty.includes(r.id))

                if(role) {
                    await client.db.boosts.removeBoosts(oldMember.id)

                    if(newMember.roles.cache.has(client.config.roles.sponsor)) {
                        await client.db.boosts.createMultiple(newMember.id, 7)
                    } else {
                        await client.db.boosts.createMultiple(newMember.id, client.config.roles.boosty[role.id as '1210030504708149258'])
                    }
                }
            }
        }

        if(oldMember.displayName !== newMember.displayName) {
            const doc = await client.db.modules.audit.get(oldMember.guild.id)
            if(doc.state) {
                const getConfig = doc.types.find((l) => l.type === 'guildMemberNicknameUpdate')
                if(getConfig && getConfig.state) {
                    const logger = oldMember.guild.channels.cache.get(getConfig.channelId)
                    if(logger && logger.type === ChannelType.GuildText) {
                        const embed = client.storage.embeds.loggerYellow()
                        .setAuthor({ name: 'Изменение имени пользователя', iconURL: client.config.icons['Member']['Yellow'] })
                        .setFooter({ text: `Id пользователя: ${oldMember.id}` })
                        .setTimestamp()

                        .addFields(
                            {
                                name: 'Пользователь',
                                inline: true,
                                value: `${oldMember.toString()} | \`${oldMember.user.tag}\``
                            },
                            {
                                name: 'Имя',
                                inline: true,
                                value: `\`${oldMember.displayName}\` ➞ \`${newMember.displayName}\``
                            }
                        )
    
                        const action = (await oldMember.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberUpdate)
                        if(action && action?.executor) {
                            embed.addFields(
                                {
                                    name: 'Изменил',
                                    value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                    inline: true
                                }
                            )
                        }
    
                        return logger.send({ embeds: [ embed ] }).catch(() => {})
                    }
                }
            }
        }

        if(oldMember.roles.cache.size > newMember.roles.cache.size) {
            const doc = await client.db.modules.audit.get(oldMember.guild.id)
            if(doc.state) {
                const getConfig = doc.types.find((l) => l.type === 'guildMemberRoleRemove')
                if(getConfig && getConfig.state) {
                    const logger = oldMember.guild.channels.cache.get(getConfig.channelId)
                    if(logger && logger.type === ChannelType.GuildText) {
                        const embed = client.storage.embeds.loggerYellow()
                        .setAuthor({ name: 'Изменение ролей участника', iconURL: client.config.icons['Member']['Yellow'] })
                        .setFooter({ text: `Id пользователя: ${oldMember.id}` })
                        .setTimestamp()

                        .addFields(
                            {
                                name: 'Пользователь',
                                inline: true,
                                value: `${oldMember.toString()} | \`${oldMember.user.tag}\``
                            }
                        )
    
                        const action = (await oldMember.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberRoleUpdate)
                        if(action && action?.executor) {
                            embed.addFields(
                                {
                                    name: 'Забрал',
                                    value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                    inline: true
                                }
                            )
                        }

                        if(action && (action?.changes || [])[0]) {
                            const change = action.changes[0]
                            if(!change || change?.key !== '$remove' || typeof change?.new !== 'object') return

                            embed.addFields(
                                {
                                    name: 'Забраны',
                                    value: (change?.new as any).map((v: any) => `<@&${v.id}> | \`${v.name}\``).join('\n') || 'Ошибка'
                                }
                            )
                        } else {
                            return
                        }
    
                        return logger.send({ embeds: [ embed ] }).catch(() => {})
                    }
                }
            }
        }

        if(newMember.roles.cache.size > oldMember.roles.cache.size) {
            const doc = await client.db.modules.audit.get(oldMember.guild.id)
            if(doc.state) {
                const getConfig = doc.types.find((l) => l.type === 'guildMemberRoleAdd')
                if(getConfig && getConfig.state) {
                    const logger = oldMember.guild.channels.cache.get(getConfig.channelId)
                    if(logger && logger.type === ChannelType.GuildText) {
                        const embed = client.storage.embeds.loggerYellow()
                        .setAuthor({ name: 'Изменение ролей участника', iconURL: client.config.icons['Member']['Yellow'] })
                        .setFooter({ text: `Id пользователя: ${oldMember.id}` })
                        .setTimestamp()

                        .addFields(
                            {
                                name: 'Пользователь',
                                inline: true,
                                value: `${oldMember.toString()} | \`${oldMember.user.tag}\``
                            }
                        )

                        const action = (await oldMember.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberRoleUpdate)
                        
                        if(action && action?.executor) {
                            embed.addFields(
                                {
                                    name: 'Выдал',
                                    value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                    inline: true
                                }
                            )
                        }

                        if(action && (action?.changes || [])[0]) {
                            const change = action.changes[0]
                            if(!change || change?.key !== '$add' || typeof change?.new !== 'object') return

                            embed.addFields(
                                {
                                    name: 'Выданы',
                                    value: ((change?.new || []) as any).map((v: any) => `<@&${v.id}> | \`${v.name}\``).join('\n') || 'Ошибка'
                                }
                            )
                        } else {
                            return
                        }

                        return logger.send({ embeds: [ embed ] }).catch(() => {})
                    }
                }
            }
        }
    }
)