import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    ForumChannel,
    GuildChannel,
    NewsChannel,
    StageChannel,
    TextChannel,
    VoiceChannel
} from "discord.js";

export default new BaseEvent(

    {
        name: 'channelUpdate'
    },

    async (client: NiakoClient, oldChannel: GuildChannel, newChannel: GuildChannel) => {
        if (oldChannel.rawPosition !== newChannel.rawPosition && oldChannel.parentId == newChannel.parentId) return
        if (oldChannel.parentId && !newChannel.parentId && !oldChannel.guild.channels.cache.has(oldChannel.parentId)) return
        if (oldChannel.permissionOverwrites.cache.size !== newChannel.permissionOverwrites.cache.size) return

        const doc = await client.db.modules.audit.get(oldChannel.guildId)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'channelUpdate')
            if(getConfig && getConfig.state) {
                const logger = oldChannel.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    let updated = false
                    const channelConfig = client.db.modules.audit.getChannelAssets(oldChannel, 'Yellow')
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: channelConfig.authors['Update'], iconURL: channelConfig.icon })
                    .setFooter({ text: `Id канала: ${oldChannel.id}` })
                    .setTimestamp()
                    
                    
                    if(oldChannel.name !== newChannel.name) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Название',
                                inline: true,
                                value: `${oldChannel.name} ➞ ${newChannel.name}`
                            }
                        )
                    } else {
                        embed.addFields(
                            {
                                name: 'Канал',
                                inline: true,
                                value: `${oldChannel.toString()} | \`${oldChannel.name}\``
                            }
                        )
                    }

                    const action = (await oldChannel.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.ChannelUpdate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Изменил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    if([ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(oldChannel.type) && [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(newChannel.type)) {
                        const oldTextChannel = oldChannel as TextChannel | NewsChannel
                        const newTextChannel = newChannel as TextChannel | NewsChannel

                        if (oldTextChannel.topic !== newTextChannel.topic) {
                            updated = true
                            const oldState = oldTextChannel?.topic && oldTextChannel.topic !== '' ? oldTextChannel.topic : 'Нет'
                            const newState = newTextChannel?.topic && newTextChannel.topic !== '' ? newTextChannel.topic : 'Нет'
                            embed.addFields(
                                {
                                    name: 'Тема',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }
                        
                        if (oldTextChannel.nsfw !== newTextChannel.nsfw) {
                            updated = true
                            const oldState = oldTextChannel.nsfw ? 'Да' : 'Нет'
                            const newState = newTextChannel.nsfw ? 'Да' : 'Нет'
                            embed.addFields(
                                {
                                    name: 'NSFW',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldTextChannel.rateLimitPerUser !== newTextChannel.rateLimitPerUser) {
                            updated = true
                            const oldState = oldTextChannel.rateLimitPerUser ?? 'Нет'
                            const newState = newTextChannel.rateLimitPerUser ?? 'Нет'
                            embed.addFields(
                                {
                                    name: 'Медленный режим',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldTextChannel.defaultAutoArchiveDuration !== newTextChannel.defaultAutoArchiveDuration) {
                            updated = true
                            const oldState = oldTextChannel.defaultAutoArchiveDuration ? client.constants.get(`defaultAutoArchiveDuration.${oldTextChannel.defaultAutoArchiveDuration}`) : 'Нет'
                            const newState = newTextChannel.defaultAutoArchiveDuration ? client.constants.get(`defaultAutoArchiveDuration.${newTextChannel.defaultAutoArchiveDuration}`) : 'Нет'
                            embed.addFields(
                                {
                                    name: 'Архивирование сообщений',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }
                    } else if(oldChannel.type === ChannelType.GuildVoice && newChannel.type === ChannelType.GuildVoice) {
                        const oldVoiceChannel = oldChannel as VoiceChannel
                        const newVoiceChannel = newChannel as VoiceChannel

                        if (oldVoiceChannel.nsfw !== newVoiceChannel.nsfw) {
                            updated = true
                            const oldState = oldVoiceChannel.nsfw ? 'Да' : 'Нет'
                            const newState = newVoiceChannel.nsfw ? 'Да' : 'Нет'
                            embed.addFields(
                                {
                                    name: 'NSFW',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldVoiceChannel.userLimit !== newVoiceChannel.userLimit) {
                            updated = true
                            const oldState = oldVoiceChannel.userLimit
                            const newState = newVoiceChannel.userLimit
                            embed.addFields(
                                {
                                    name: 'Кол-во участников',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldVoiceChannel.bitrate !== newVoiceChannel.bitrate) {
                            updated = true
                            const oldState = oldVoiceChannel.bitrate / 1000
                            const newState = newVoiceChannel.bitrate / 1000
                            embed.addFields(
                                {
                                    name: 'Битрейт',
                                    value: `\`${oldState}kbps\` ➞ \`${newState}kbps\``
                                }
                            )
                        }

                        if (oldVoiceChannel.rtcRegion !== newVoiceChannel.rtcRegion) {
                            updated = true
                            const oldState = oldVoiceChannel.rtcRegion ?? 'Нет'
                            const newState = newVoiceChannel.rtcRegion ?? 'Нет'
                            embed.addFields(
                                {
                                    name: 'Регион',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldVoiceChannel.rateLimitPerUser !== newVoiceChannel.rateLimitPerUser) {
                            updated = true
                            const oldState = oldVoiceChannel.rateLimitPerUser ?? 'Нет'
                            const newState = newVoiceChannel.rateLimitPerUser ?? 'Нет'
                            embed.addFields(
                                {
                                    name: 'Медленный режим',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }
                    } else if(oldChannel.type === ChannelType.GuildStageVoice && newChannel.type === ChannelType.GuildStageVoice) {
                        const oldStageChannel = oldChannel as StageChannel
                        const newStageChannel = newChannel as StageChannel

                        if (oldStageChannel.topic !== newStageChannel.topic) {
                            updated = true
                            const oldState = oldStageChannel?.topic ? client.util.stringResize(oldStageChannel.topic, 450) : 'Нет'
                            const newState = newStageChannel?.topic ? client.util.stringResize(newStageChannel.topic, 450) : 'Нет'
                            embed.addFields(
                                {
                                    name: 'Тема',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldStageChannel.nsfw !== newStageChannel.nsfw) {
                            updated = true
                            const oldState = oldStageChannel.nsfw ? 'Да' : 'Нет'
                            const newState = newStageChannel.nsfw ? 'Да' : 'Нет'
                            embed.addFields(
                                {
                                    name: 'NSFW',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldStageChannel.userLimit !== newStageChannel.userLimit) {
                            updated = true
                            const oldState = oldStageChannel.userLimit
                            const newState = newStageChannel.userLimit
                            embed.addFields(
                                {
                                    name: 'Кол-во участников',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if(oldStageChannel.bitrate !== newStageChannel.bitrate) {
                            updated = true
                            const oldState = oldStageChannel.bitrate / 1000
                            const newState = newStageChannel.bitrate / 1000
                            embed.addFields(
                                {
                                    name: 'Битрейт',
                                    value: `\`${oldState}kbps\` ➞ \`${newState}kbps\``
                                }
                            )
                        }

                        if (oldStageChannel.rtcRegion !== newStageChannel.rtcRegion) {
                            updated = true
                            const oldState = oldStageChannel.rtcRegion ?? 'Нет'
                            const newState = newStageChannel.rtcRegion ?? 'Нет'
                            embed.addFields(
                                {
                                    name: 'Регион',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }
                        
                        if (oldStageChannel.rateLimitPerUser !== newStageChannel.rateLimitPerUser) {
                            updated = true
                            const oldState = oldStageChannel.rateLimitPerUser ?? 'Нет'
                            const newState = newStageChannel.rateLimitPerUser ?? 'Нет'
                            embed.addFields(
                                {
                                    name: 'Медленный режим',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }
                    } else if(oldChannel.type === ChannelType.GuildForum && newChannel.type === ChannelType.GuildForum) {
                        const oldForumChannel = oldChannel as ForumChannel
                        const newForumChannel = newChannel as ForumChannel
                        
                        if (oldForumChannel.topic !== newForumChannel.topic) {
                            updated = true
                            const oldState = oldForumChannel?.topic && oldForumChannel.topic !== '' ? oldForumChannel.topic : 'Нет'
                            const newState = newForumChannel?.topic && newForumChannel.topic !== '' ? newForumChannel.topic : 'Нет'
                            embed.addFields(
                                {
                                    name: 'Тема',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldForumChannel.nsfw !== newForumChannel.nsfw) {
                            updated = true
                            const oldState = oldForumChannel.nsfw ? 'Да' : 'Нет'
                            const newState = newForumChannel.nsfw ? 'Да' : 'Нет'
                            embed.addFields(
                                {
                                    name: 'NSFW',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if(oldForumChannel.availableTags.length !== newForumChannel.availableTags.length) {
                            updated = true
                            const oldState = oldForumChannel.availableTags.map((tag) => `${tag.emoji ? (tag.emoji?.id ? `<:${tag.emoji.name}:${tag.emoji.id}> ` : tag.emoji.name) + ' ' : ''}\`${tag.name}\``).join(', ')
                            const newState = newForumChannel.availableTags.map((tag) => `${tag.emoji ? (tag.emoji?.id ? `<:${tag.emoji.name}:${tag.emoji.id}> ` : tag.emoji.name) + ' ' : ''}\`${tag.name}\``).join(', ')
                            embed.addFields(
                                {
                                    name: 'Тэги',
                                    value: `${oldState === '' ? 'Нет' : oldState} ➞ ${newState === '' ? 'Нет' : newState}`
                                }
                            )
                        }

                        if (oldForumChannel.defaultAutoArchiveDuration !== newForumChannel.defaultAutoArchiveDuration) {
                            updated = true
                            const oldState = oldForumChannel.defaultAutoArchiveDuration ? client.constants.get(`defaultAutoArchiveDuration.${oldForumChannel.defaultAutoArchiveDuration}`) : 'Нет'
                            const newState = newForumChannel.defaultAutoArchiveDuration ? client.constants.get(`defaultAutoArchiveDuration.${newForumChannel.defaultAutoArchiveDuration}`) : 'Нет'
                            embed.addFields(
                                {
                                    name: 'Архивирование сообщений',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldForumChannel.defaultForumLayout !== newForumChannel.defaultForumLayout) {
                            updated = true
                            const oldState = client.constants.get(`defaultForumLayout.${oldForumChannel.defaultForumLayout}`)
                            const newState = client.constants.get(`defaultForumLayout.${newForumChannel.defaultForumLayout}`)
                            embed.addFields(
                                {
                                    name: 'Отображение',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldForumChannel.defaultReactionEmoji !== newForumChannel.defaultReactionEmoji) {
                            updated = true
                            const oldState = oldForumChannel.defaultReactionEmoji ? (oldForumChannel.defaultReactionEmoji?.id ? `<:${oldForumChannel.defaultReactionEmoji.name}:${oldForumChannel.defaultReactionEmoji.id}> ` : oldForumChannel.defaultReactionEmoji.name) : '\`Нет\`'
                            const newState = newForumChannel.defaultReactionEmoji ? (newForumChannel.defaultReactionEmoji?.id ? `<:${newForumChannel.defaultReactionEmoji.name}:${newForumChannel.defaultReactionEmoji.id}> ` : newForumChannel.defaultReactionEmoji.name) : '\`Нет\`'
                            embed.addFields(
                                {
                                    name: 'Эмодзи реакции',
                                    value: `${oldState} ➞ ${newState}`
                                }
                            )
                        }

                        if (oldForumChannel.defaultSortOrder !== newForumChannel.defaultSortOrder) {
                            updated = true
                            const oldState = oldForumChannel.defaultSortOrder ? client.constants.get(`defaultSortOrder.${oldForumChannel.defaultSortOrder}`) : 'Нет'
                            const newState = newForumChannel.defaultSortOrder ? client.constants.get(`defaultSortOrder.${newForumChannel.defaultSortOrder}`) : 'Нет'
                            embed.addFields(
                                {
                                    name: 'Сортировка',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }

                        if (oldForumChannel.rateLimitPerUser !== newForumChannel.rateLimitPerUser) {
                            updated = true
                            const oldState = oldForumChannel.rateLimitPerUser ?? 'Нет'
                            const newState = newForumChannel.rateLimitPerUser ?? 'Нет'
                            embed.addFields(
                                {
                                    name: 'Медленный режим',
                                    value: `\`${oldState}\` ➞ \`${newState}\``
                                }
                            )
                        }
                    } else if(oldChannel.type === ChannelType.GuildCategory && newChannel.type === ChannelType.GuildCategory) {
                    } else return

                    if(updated) return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)