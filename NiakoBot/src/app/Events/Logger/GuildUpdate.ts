import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Guild
} from "discord.js";

export default new BaseEvent(

    {
        name: 'guildUpdate'
    },

    async (client: NiakoClient, oldGuild: Guild, newGuild: Guild) => {
        const doc = await client.db.modules.audit.get(oldGuild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'guildUpdate')
            if(getConfig && getConfig.state) {
                const channel = oldGuild.channels.cache.get(getConfig.channelId)
                if(channel && channel.type === ChannelType.GuildText) {
                    let updated = false
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: 'Изменение сервера', iconURL: client.config.icons['Guild']['Yellow'] })
                    .setFooter({ text: `Id сервера: ${oldGuild.id}` })
                    .setTimestamp()
                    
                    if(oldGuild.name !== newGuild.name) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Название',
                                value: `\`${oldGuild.name}\` ➞ \`${newGuild.name}\``,
                                inline: true
                            }
                        )
                    } else {
                        embed.addFields(
                            {
                                name: 'Сервер',
                                value: `\`${oldGuild.name}\``,
                                inline: true
                            }
                        )
                    }

                    const action = (await oldGuild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.GuildUpdate)
                    if(action && action?.executor) {
                        if(action.executorId === client.user.id) return
                        embed.addFields(
                            {
                                name: 'Изменил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    if (oldGuild.ownerId !== newGuild.ownerId) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Владелец',
                                value: `<@!${oldGuild.ownerId}> ➞ <@!${newGuild.ownerId}>`
                            }
                        )
                    }

                    if (oldGuild.icon !== newGuild.icon) {
                        updated = true
                        const oldIcon = client.util.getIcon(oldGuild)
                        const newIcon = client.util.getIcon(newGuild)
                        embed.addFields(
                            {
                                name: 'Аватар',
                                value: `${oldIcon ? `[Перейти](${oldIcon})` : '`Нет`'} ➞ ${newIcon ? `[Перейти](${newIcon})` : '`Нет`'}`
                            }
                        )
                    }

                    if (oldGuild.banner !== newGuild.banner) {
                        updated = true
                        const oldBanner = client.util.getBanner(oldGuild)
                        const newBanner = client.util.getBanner(newGuild)
                        embed.addFields(
                            {
                                name: 'Баннер',
                                value: `${oldBanner ? `[Перейти](${oldBanner})` : '`Нет`'} ➞ ${newBanner ? `[Перейти](${newBanner})` : '`Нет`'}`
                            }
                        )
                    }

                    if (oldGuild.splash !== newGuild.splash) {
                        updated = true
                        const oldSplash = client.util.getSplash(oldGuild)
                        const newSplash = client.util.getSplash(newGuild)
                        embed.addFields(
                            {
                                name: 'Фон приглашения',
                                value: `${oldSplash ? `[Перейти](${oldSplash})` : '`Нет`'} ➞ ${newSplash ? `[Перейти](${newSplash})` : '`Нет`'}`
                            }
                        )
                    }

                    if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
                        updated = true
                        const oldSplash = client.util.getDiscoverySplash(oldGuild)
                        const newSplash = client.util.getDiscoverySplash(newGuild)
                        embed.addFields(
                            {
                                name: 'Фон поиска',
                                value: `${oldSplash ? `[Перейти](${oldSplash})` : '`Нет`'} ➞ ${newSplash ? `[Перейти](${newSplash})` : '`Нет`'}`
                            }
                        )
                    }

                    if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
                        updated = true
                        const oldDescription = oldGuild.description ?? 'Нет'
                        const newDescription = newGuild.description ?? 'Нет'
                        embed.addFields(
                            {
                                name: 'Описание',
                                value: `\`${oldDescription}\` ➞ \`${newDescription}\``
                            }
                        )
                    }

                    if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                        updated = true
                        const oldVerify = client.constants.get(`verificationGuildLevel.${oldGuild.verificationLevel}`)
                        const newVerify = client.constants.get(`verificationGuildLevel.${newGuild.verificationLevel}`)
                        embed.addFields(
                            {
                                name: 'Уровень верификации',
                                value: `\`${oldVerify}\` ➞ \`${newVerify}\``
                            }
                        )
                    }

                    if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
                        updated = true
                        const oldFilter = client.constants.get(`explicitContentFilter.${oldGuild.explicitContentFilter}`)
                        const newFilter = client.constants.get(`explicitContentFilter.${newGuild.explicitContentFilter}`)
                        embed.addFields(
                            {
                                name: 'Модерация контента',
                                value: `\`${oldFilter}\` ➞ \`${newFilter}\``
                            }
                        )
                    }

                    if (oldGuild.mfaLevel !== newGuild.mfaLevel) {
                        updated = true
                        const oldMfaLevel = client.constants.get(`mfaLevel.${oldGuild.mfaLevel}`)
                        const newMfaLevel = client.constants.get(`mfaLevel.${newGuild.mfaLevel}`)
                        embed.addFields(
                            {
                                name: '2FA',
                                value: `\`${oldMfaLevel}\` ➞ \`${newMfaLevel}\``
                            }
                        )
                    }

                    if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
                        updated = true
                        const oldNSFWLevel = client.constants.get(`nsfwLevel.${oldGuild.mfaLevel}`)
                        const newNSFWLevel = client.constants.get(`nsfwLevel.${newGuild.mfaLevel}`)
                        embed.addFields(
                            {
                                name: 'NSFW',
                                value: `\`${oldNSFWLevel}\` ➞ \`${newNSFWLevel}\``
                            }
                        )
                    }

                    if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
                        updated = true
                        const oldLocale = oldGuild.preferredLocale
                        const newLocale = newGuild.preferredLocale
                        embed.addFields(
                            {
                                name: 'Язык',
                                value: `\`${oldLocale}\` ➞ \`${newLocale}\``
                            }
                        )
                    }
                    
                    if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                        updated = true
                        const oldVanityUrl = oldGuild.vanityURLCode ?? 'Нет'
                        const newVanityUrl = newGuild.vanityURLCode ?? 'Нет'
                        embed.addFields(
                            {
                                name: 'Код приглашения',
                                value: `\`${oldVanityUrl}\` ➞ \`${newVanityUrl}\``
                            }
                        )
                    }
                    
                    if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
                        updated = true
                        const oldRulesChannel = oldGuild.rulesChannel ? `<#${oldGuild.rulesChannelId}>` : '`Нет`'
                        const newRulesChannel = newGuild.rulesChannel ? `<#${newGuild.rulesChannelId}>` : '`Нет`'
                        embed.addFields(
                            {
                                name: 'Канал правила',
                                value: `${oldRulesChannel} ➞ ${newRulesChannel}`
                            }
                        )
                    }

                    if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
                        updated = true
                        const oldSystemChannel = oldGuild.systemChannel ? `<#${oldGuild.systemChannelId}>` : '`Нет`'
                        const newSystemChannel = newGuild.systemChannel ? `<#${newGuild.systemChannelId}>` : '`Нет`'
                        embed.addFields(
                            {
                                name: 'Системный канал',
                                value: `${oldSystemChannel} ➞ ${newSystemChannel}`
                            }
                        )
                    }

                    if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
                        updated = true
                        const oldPublicChannel = oldGuild.publicUpdatesChannel ? `<#${oldGuild.publicUpdatesChannelId}>` : '`Нет`'
                        const newPublicChannel = newGuild.publicUpdatesChannel ? `<#${newGuild.publicUpdatesChannelId}>` : '`Нет`'
                        embed.addFields(
                            {
                                name: 'Публичный канал',
                                value: `${oldPublicChannel} ➞ ${newPublicChannel}`
                            }
                        )
                    }
                    
                    if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
                        updated = true
                        const oldPublicChannel = oldGuild.publicUpdatesChannel ? `<#${oldGuild.publicUpdatesChannelId}>` : '`Нет`'
                        const newPublicChannel = newGuild.publicUpdatesChannel ? `<#${newGuild.publicUpdatesChannelId}>` : '`Нет`'
                        embed.addFields(
                            {
                                name: 'Канал предупреждений',
                                value: `${oldPublicChannel} ➞ ${newPublicChannel}`
                            }
                        )
                    }

                    if (oldGuild.widgetChannelId !== newGuild.widgetChannelId) {
                        updated = true
                        const oldWidgetChannel = oldGuild.widgetChannel ? `<#${oldGuild.widgetChannelId}>` : '`Нет`'
                        const newWidgetChannel = newGuild.widgetChannel ? `<#${newGuild.widgetChannelId}>` : '`Нет`'
                        embed.addFields(
                            {
                                name: 'Виджет канал',
                                value: `${oldWidgetChannel} ➞ ${newWidgetChannel}`
                            }
                        )
                    }

                    if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
                        updated = true
                        const oldAfkChannel = oldGuild.afkChannel ? `<#${oldGuild.afkChannelId}>` : '`Нет`'
                        const newAfkChannel = newGuild.afkChannel ? `<#${newGuild.afkChannelId}>` : '`Нет`'
                        embed.addFields(
                            {
                                name: 'Канал AFK',
                                value: `${oldAfkChannel} ➞ ${newAfkChannel}`
                            }
                        )
                    }

                    if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
                        updated = true
                        const oldAfkTimeout = `${Math.round(oldGuild.afkTimeout / 1000)}с`
                        const newAfkTimeout = `${Math.round(newGuild.afkTimeout / 1000)}с`
                        embed.addFields(
                            {
                                name: 'Таймаут AFK',
                                value: `${oldAfkTimeout} ➞ ${newAfkTimeout}`
                            }
                        )
                    }

                    if(updated) return channel.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)