import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildScheduledEvent
} from "discord.js";

export default new BaseEvent(

    {
        name: 'guildScheduledEventUpdate',
        disabled: true
    },

    async (client: NiakoClient, oldGuildScheduledEvent: GuildScheduledEvent, newGuildScheduledEvent: GuildScheduledEvent) => {
        if(!oldGuildScheduledEvent?.guild) return
        if(!newGuildScheduledEvent?.guild) return

        const doc = await client.db.modules.audit.get(oldGuildScheduledEvent.guild.id)
        if(doc.state) {
            const getConfig = doc.channels.find((l) => l.types.includes('guildScheduledEventUpdate'))
            if(getConfig && getConfig.state) {
                let updated = false
                const logger = oldGuildScheduledEvent.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: 'Удаление мероприятия', iconURL: client.config.icons['ScheduledEvent']['Yellow'] })
                    .setFooter({ text: `Id мероприятия: ${oldGuildScheduledEvent.id}` })
                    .setTimestamp()

                    if(newGuildScheduledEvent.name !== oldGuildScheduledEvent.name) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Название',
                                inline: true,
                                value: `\`${oldGuildScheduledEvent.name}\` ➞ \`${newGuildScheduledEvent.name}\``
                            }
                        )
                    } else {
                        embed.addFields(
                            {
                                name: 'Название',
                                inline: true,
                                value: `${oldGuildScheduledEvent.name}`
                            }
                        )
                    }

                    if(oldGuildScheduledEvent.channel !== newGuildScheduledEvent.channel) {
                        updated = true
                        const oldState = oldGuildScheduledEvent.channel ? `${oldGuildScheduledEvent.channel.toString()} | \`${oldGuildScheduledEvent.channel.name}\`` : '\`Нет\`'
                        const newState = newGuildScheduledEvent.channel ? `${newGuildScheduledEvent.channel.toString()} | \`${newGuildScheduledEvent.channel.name}\`` : '\`Нет\`'
                        embed.addFields(
                            {
                                name: 'Канал',
                                inline: true,
                                value: `${oldState} ➞ ${newState}`
                            }
                        )
                    }

                    const action = (await oldGuildScheduledEvent.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.GuildScheduledEventUpdate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Изменил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    if(oldGuildScheduledEvent.status !== newGuildScheduledEvent.status) {
                        updated = true
                        const oldState = oldGuildScheduledEvent.status ? 'Началось' : 'Закончилось'
                        const newState = newGuildScheduledEvent.status ? 'Началось' : 'Закончилось'
                        embed.addFields(
                            {
                                name: 'Статус',
                                value: `\`${oldState}\` ➞ \`${newState}\``
                            }
                        )
                    }

                    if(oldGuildScheduledEvent.description !== newGuildScheduledEvent.description) {
                        updated = true
                        const oldState = oldGuildScheduledEvent.description ?? '\`Нет\`'
                        const newState = newGuildScheduledEvent.description ?? '\`Нет\`'
                        embed.addFields(
                            {
                                name: 'Описание',
                                value: `${oldState} ➞ ${newState}`
                            }
                        )
                    }

                    if(oldGuildScheduledEvent.description !== newGuildScheduledEvent.description) {
                        updated = true
                        const oldState = oldGuildScheduledEvent.image ? `[Перейти](${oldGuildScheduledEvent.coverImageURL({ size: 4096, extension: 'png' })})` : '\`Нет\`'
                        const newState = newGuildScheduledEvent.image ? `[Перейти](${oldGuildScheduledEvent.coverImageURL({ size: 4096, extension: 'png' })})` : '\`Нет\`'
                        embed.addFields(
                            {
                                name: 'Изображение',
                                value: `\`${oldState}\` ➞ \`${newState}\``
                            }
                        )
                    }

                    if(oldGuildScheduledEvent.description !== newGuildScheduledEvent.description) {
                        updated = true
                        const oldState = oldGuildScheduledEvent.userCount ?? 0
                        const newState = newGuildScheduledEvent.userCount ?? 0
                        embed.addFields(
                            {
                                name: 'Участников',
                                value: `\`${oldState}\` ➞ \`${newState}\``
                            }
                        )
                    }

                    if(updated) return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)