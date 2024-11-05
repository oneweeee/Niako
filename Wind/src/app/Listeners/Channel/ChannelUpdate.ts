import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    ChannelType,
    ForumChannel,
    GuildChannel,
    NewsChannel,
    StageChannel,
    TextChannel,
    VoiceChannel,
} from "discord.js";

export default new BaseListener(
    { name: 'channelUpdate' },
    async (client, oldChannel: GuildChannel, newChannel: GuildChannel) => {
        if(oldChannel?.parentId !== newChannel?.parentId || oldChannel?.rawPosition !== newChannel?.rawPosition) return

        const res = await client.db.crashs.get(oldChannel.guild.id)

        if(res.status) {
            await client.db.crashs.push(oldChannel.guild, res, AuditLogEvent.ChannelUpdate, 'EditChannel', { oldChannel, channel: newChannel })
        }

        const auditChannel = await client.db.audits.resolveChannel(oldChannel.guild, 'ChannelDelete')
        if(!auditChannel) return

        let updated = false
        const channelConfig = client.db.audits.getChannelAssets(oldChannel, 'Yellow', oldChannel.guild.preferredLocale)

        const embed = client.storage.embeds.yellow()
        .setAuthor(
            {
                name: channelConfig.authors['Update'],
                iconURL: channelConfig.icon
            }
        )
        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            }
        )
        .setImage(client.icons['Guild']['Line'])

        const action = await client.db.audits.getAudit(oldChannel.guild, AuditLogEvent.ChannelUpdate)
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

        
        if(oldChannel.name !== newChannel.name) {
            updated = true
            embed.addFields(
                {
                    name: '> Название:',
                    inline: true,
                    value: `・\`${oldChannel.name}\` ➞ \`${newChannel.name}\``
                },
            )
        } else {
            embed.addFields(
                {
                    name: '> Канал:',
                    inline: false,
                    value: `・${oldChannel.toString()} \n・${oldChannel.name} \n・${oldChannel.id}`
                }
            )
        }

        if([ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(oldChannel.type) && [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(newChannel.type)) {
            const oldTextChannel = oldChannel as TextChannel | NewsChannel
            const newTextChannel = newChannel as TextChannel | NewsChannel

            const oldStateTopic = oldTextChannel?.topic && oldTextChannel.topic !== '' ? oldTextChannel.topic : 'Без Темы'
            const newStateTopic = newTextChannel?.topic && newTextChannel.topic !== '' ? newTextChannel.topic : 'Без Темы'
            if (oldStateTopic !== newStateTopic) {
                updated = true
                embed.addFields(
                    {
                        name: '> Тема:',
                        value: `・\`${oldStateTopic}\` ➞ \`${newStateTopic}\``
                    }
                )
            }
            
            if (oldTextChannel.nsfw !== newTextChannel.nsfw) {
                updated = true
                const oldState = oldTextChannel.nsfw ? 'Включён' : 'Выключён'
                const newState = newTextChannel.nsfw ? 'Включён' : 'Выключён'
                embed.addFields(
                    {
                        name: '> NSFW:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldTextChannel.rateLimitPerUser !== newTextChannel.rateLimitPerUser) {
                updated = true
                const oldState = oldTextChannel.rateLimitPerUser ?? '0'
                const newState = newTextChannel.rateLimitPerUser ?? '0'
                embed.addFields(
                    {
                        name: '> Медленный режим:',
                        value: `・\`${oldState}\`с ➞ \`${newState}\`с`
                    }
                )
            }

            if (oldTextChannel.defaultAutoArchiveDuration !== newTextChannel.defaultAutoArchiveDuration) {
                updated = true
                const oldState = oldTextChannel.defaultAutoArchiveDuration ? client.services.lang.get(`defaultAutoArchiveDuration=${oldTextChannel.defaultAutoArchiveDuration}`, oldChannel.guild.preferredLocale) : 'Отсутсвует'
                const newState = newTextChannel.defaultAutoArchiveDuration ? client.services.lang.get(`defaultAutoArchiveDuration=${newTextChannel.defaultAutoArchiveDuration}`, oldChannel.guild.preferredLocale) : 'Отсутсвует'
                embed.addFields(
                    {
                        name: '> Архивирование сообщений:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }
        } else if(oldChannel.type === ChannelType.GuildVoice && newChannel.type === ChannelType.GuildVoice) {
            const oldVoiceChannel = oldChannel as VoiceChannel
            const newVoiceChannel = newChannel as VoiceChannel

            if (oldVoiceChannel.nsfw !== newVoiceChannel.nsfw) {
                updated = true
                const oldState = oldVoiceChannel.nsfw ? 'Включён' : 'Выключён'
                const newState = newVoiceChannel.nsfw ? 'Включён' : 'Выключён'
                embed.addFields(
                    {
                        name: '> NSFW:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldVoiceChannel.userLimit !== newVoiceChannel.userLimit) {
                updated = true
                const oldState = oldVoiceChannel.userLimit
                const newState = newVoiceChannel.userLimit
                embed.addFields(
                    {
                        name: '> Кол-во участников:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldVoiceChannel.bitrate !== newVoiceChannel.bitrate) {
                updated = true
                const oldState = oldVoiceChannel.bitrate / 1000
                const newState = newVoiceChannel.bitrate / 1000
                embed.addFields(
                    {
                        name: '> Битрейт:',
                        value: `・\`${oldState}kbps\` ➞ \`${newState}kbps\``
                    }
                )
            }

            if (oldVoiceChannel.rtcRegion !== newVoiceChannel.rtcRegion) {
                updated = true
                const oldState = oldVoiceChannel.rtcRegion ?? 'Автоматический выбор'
                const newState = newVoiceChannel.rtcRegion ?? 'Автоматический выбор'
                embed.addFields(
                    {
                        name: '> Регион:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldVoiceChannel.rateLimitPerUser !== newVoiceChannel.rateLimitPerUser) {
                updated = true
                const oldState = oldVoiceChannel.rateLimitPerUser ?? 'Отсутсвует'
                const newState = newVoiceChannel.rateLimitPerUser ?? 'Отсутсвует'
                embed.addFields(
                    {
                        name: '> Медленный режим:',
                        value: `・\`${oldState}\`с ➞ \`${newState}\`с`
                    }
                )
            }
        } else if(oldChannel.type === ChannelType.GuildStageVoice && newChannel.type === ChannelType.GuildStageVoice) {
            const oldStageChannel = oldChannel as StageChannel
            const newStageChannel = newChannel as StageChannel

            const oldStateTopic = oldStageChannel?.topic && oldStageChannel.topic !== '' ? oldStageChannel.topic : 'Без Темы'
            const newStateTopic = newStageChannel?.topic && newStageChannel.topic !== '' ? newStageChannel.topic : 'Без Темы'
            if (oldStateTopic !== newStateTopic) {
                updated = true
                embed.addFields(
                    {
                        name: '> Тема:',
                        value: `・\`${oldStateTopic}\` ➞ \`${newStateTopic}\``
                    }
                )
            }

            if (oldStageChannel.nsfw !== newStageChannel.nsfw) {
                updated = true
                const oldState = oldStageChannel.nsfw ? 'Включён' : 'Выключён'
                const newState = newStageChannel.nsfw ? 'Включён' : 'Выключён'
                embed.addFields(
                    {
                        name: '> NSFW:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldStageChannel.userLimit !== newStageChannel.userLimit) {
                updated = true
                const oldState = oldStageChannel.userLimit
                const newState = newStageChannel.userLimit
                embed.addFields(
                    {
                        name: '> Кол-во участников:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if(oldStageChannel.bitrate !== newStageChannel.bitrate) {
                updated = true
                const oldState = oldStageChannel.bitrate / 1000
                const newState = newStageChannel.bitrate / 1000
                embed.addFields(
                    {
                        name: '> Битрейт:',
                        value: `・\`${oldState}kbps\` ➞ \`${newState}kbps\``
                    }
                )
            }

            if (oldStageChannel.rtcRegion !== newStageChannel.rtcRegion) {
                updated = true
                const oldState = oldStageChannel.rtcRegion ?? 'Автоматический выбор'
                const newState = newStageChannel.rtcRegion ?? 'Автоматический выбор'
                embed.addFields(
                    {
                        name: '> Регион:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }
            
            if (oldStageChannel.rateLimitPerUser !== newStageChannel.rateLimitPerUser) {
                updated = true
                const oldState = oldStageChannel.rateLimitPerUser ?? 'Отсутсвует'
                const newState = newStageChannel.rateLimitPerUser ?? 'Отсутсвует'
                embed.addFields(
                    {
                        name: '> Медленный режим:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

        } else if(oldChannel.type === ChannelType.GuildForum && newChannel.type === ChannelType.GuildForum) {
            const oldForumChannel = oldChannel as ForumChannel
            const newForumChannel = newChannel as ForumChannel
            
            if (oldForumChannel.topic !== newForumChannel.topic) {
                updated = true
                const oldState = oldForumChannel?.topic && oldForumChannel.topic !== '' ? oldForumChannel.topic : 'Без Темы'
                const newState = newForumChannel?.topic && newForumChannel.topic !== '' ? newForumChannel.topic : 'Без Темы'
                embed.addFields(
                    {
                        name: '> Тема:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldForumChannel.nsfw !== newForumChannel.nsfw) {
                updated = true
                const oldState = oldForumChannel.nsfw ? 'Включён' : 'Выключён'
                const newState = newForumChannel.nsfw ? 'Включён' : 'Выключён'
                embed.addFields(
                    {
                        name: '> NSFW:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
                .setImage(client.icons['Guild']['Line'])
            }

            if(oldForumChannel.availableTags.length !== newForumChannel.availableTags.length) {
                updated = true
                const oldState = oldForumChannel.availableTags.map((tag) => `${tag.emoji ? (tag.emoji?.id ? `<:${tag.emoji.name}:${tag.emoji.id}> ` : tag.emoji.name) + ' ' : ''}\`${tag.name}\``).join(', ')
                const newState = newForumChannel.availableTags.map((tag) => `${tag.emoji ? (tag.emoji?.id ? `<:${tag.emoji.name}:${tag.emoji.id}> ` : tag.emoji.name) + ' ' : ''}\`${tag.name}\``).join(', ')
                embed.addFields(
                    {
                        name: '> Тэги:',
                        value: `・${oldState === '' ? '\`Отсутсвует\`' : oldState} ➞ ${newState === '' ? '`\`Отсутсвует\`' : newState}`
                    }
                )
            }

            if (oldForumChannel.defaultAutoArchiveDuration !== newForumChannel.defaultAutoArchiveDuration) {
                updated = true
                const oldState = oldForumChannel.defaultAutoArchiveDuration ? client.services.lang.get(`defaultAutoArchiveDuration=${oldForumChannel.defaultAutoArchiveDuration}`, oldChannel.guild.preferredLocale) : 'Отсутсвует'
                const newState = newForumChannel.defaultAutoArchiveDuration ? client.services.lang.get(`defaultAutoArchiveDuration=${newForumChannel.defaultAutoArchiveDuration}`, oldChannel.guild.preferredLocale) : 'Отсутсвует'
                embed.addFields(
                    {
                        name: '> Архивирование сообщений:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldForumChannel.defaultForumLayout !== newForumChannel.defaultForumLayout) {
                updated = true
                const oldState = client.services.lang.get(`defaultForumLayout=${oldForumChannel.defaultForumLayout}`, oldChannel.guild.preferredLocale)
                const newState = client.services.lang.get(`defaultForumLayout=${newForumChannel.defaultForumLayout}`, oldChannel.guild.preferredLocale)
                embed.addFields(
                    {
                        name: '> Отображение:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
            }

            if (oldForumChannel.defaultReactionEmoji?.id !== newForumChannel.defaultReactionEmoji?.id || oldForumChannel.defaultReactionEmoji?.name !== newForumChannel.defaultReactionEmoji?.name) {
                updated = true
                const oldState = oldForumChannel.defaultReactionEmoji ? (oldForumChannel.defaultReactionEmoji?.id ? `<:${oldForumChannel.defaultReactionEmoji.name}:${oldForumChannel.defaultReactionEmoji.id}> ` : oldForumChannel.defaultReactionEmoji.name) : '\`Отсутсвует\`'
                const newState = newForumChannel.defaultReactionEmoji ? (newForumChannel.defaultReactionEmoji?.id ? `<:${newForumChannel.defaultReactionEmoji.name}:${newForumChannel.defaultReactionEmoji.id}> ` : newForumChannel.defaultReactionEmoji.name) : '\`Отсутсвует\`'
                embed.addFields(
                    {
                        name: '> Эмодзи реакции:',
                        value: `・${oldState} ➞ ${newState}`
                    }
                )
            }

            if (oldForumChannel.defaultSortOrder !== newForumChannel.defaultSortOrder) {
                updated = true
                const oldState = oldForumChannel.defaultSortOrder ? client.services.lang.get(`defaultSortOrder=${oldForumChannel.defaultSortOrder}`, oldChannel.guild.preferredLocale) : 'Недавняя активность'
                const newState = newForumChannel.defaultSortOrder ? client.services.lang.get(`defaultSortOrder=${newForumChannel.defaultSortOrder}`, oldChannel.guild.preferredLocale) : 'Недавняя активность'
                embed.addFields(
                    {
                        name: '> Сортировка:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
                .setImage(client.icons['Guild']['Line'])
            }

            if (oldForumChannel.rateLimitPerUser !== newForumChannel.rateLimitPerUser) {
                updated = true
                const oldState = oldForumChannel.rateLimitPerUser ?? 'Отсутсвует'
                const newState = newForumChannel.rateLimitPerUser ?? 'Отсутсвует'
                embed.addFields(
                    {
                        name: '> Медленный режим:',
                        value: `・\`${oldState}\` ➞ \`${newState}\``
                    }
                )
                .setImage(client.icons['Guild']['Line'])
            }
        } else if(oldChannel.type === ChannelType.GuildCategory && newChannel.type === ChannelType.GuildCategory) {
        } else return

        if(updated) return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)