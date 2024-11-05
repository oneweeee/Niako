import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    Guild,
} from "discord.js";

export default new BaseListener(
    { name: 'guildUpdate' },
    async (client, oldGuild: Guild, newGuild: Guild) => {
        const res = await client.db.crashs.get(oldGuild.id)

        const auditChannel = await client.db.audits.resolveChannel(oldGuild, 'GuildUpdate')
        if(auditChannel) {
            let updated = false
            const embed = client.storage.embeds.yellow()
            .setAuthor(
                {
                    name: 'Изменение сервера',
                    iconURL: client.icons['Guild']['Yellow']
                }
            )
            
            if(oldGuild.name !== newGuild.name) {
                updated = true
                embed.addFields(
                    {
                        name: '> Дата:',
                        inline: false,
                        value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
                    },
                    {
                        name: '> Название:',
                        value: `・${oldGuild.name} ➞ ${newGuild.name}`,
                        inline: true
                    }
                )
            } else {
                embed.addFields(
                    {
                        name: '> Сервер:',
                        value: `・\`${oldGuild.name}\``,
                        inline: true
                    }
                )
            }

            const action = await client.db.audits.getAudit(oldGuild, AuditLogEvent.GuildUpdate)
            if(action && action?.executor) {
                if(action.executorId === client.user.id) return

                embed.addFields(
                    {
                        name: '> Изменил:',
                        value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                        inline: false
                    }
                )
                .setThumbnail(client.util.getAvatar(action.executor))
                .setImage(client.icons['Guild']['Line'])
            }

            if (oldGuild.ownerId !== newGuild.ownerId) {
                updated = true
                embed.addFields(
                    {
                        name: '> Владелец:',
                        value: `・<@!${oldGuild.ownerId}> ➞ <@!${newGuild.ownerId}>`
                    }
                )
            }

            if (oldGuild.icon !== newGuild.icon) {
                updated = true
                const oldIcon = client.util.getIcon(oldGuild)
                const newIcon = client.util.getIcon(newGuild)
                embed.addFields(
                    {
                        name: '> Аватар:',
                        value: `・${oldIcon ? `[Перейти](${oldIcon})` : '`Отсутствует`'} ➞ ${newIcon ? `[Перейти](${newIcon})` : '`Отсутствует`'}`
                    }
                )
            }

            if (oldGuild.banner !== newGuild.banner) {
                if(action?.executor?.bot) return
                
                updated = true
                const oldBanner = client.util.getBanner(oldGuild)
                const newBanner = client.util.getBanner(newGuild)
                embed.addFields(
                    {
                        name: '> Баннер:',
                        value: `・${oldBanner ? `[Перейти](${oldBanner})` : '`Отсутствует`'} ➞ ${newBanner ? `[Перейти](${newBanner})` : '`Отсутствует`'}`
                    }
                )
            }

            if (oldGuild.splash !== newGuild.splash) {
                updated = true
                const oldSplash = client.util.getSplash(oldGuild)
                const newSplash = client.util.getSplash(newGuild)
                embed.addFields(
                    {
                        name: '> Фон приглашения:',
                        value: `・${oldSplash ? `[Перейти](${oldSplash})` : '`Отсутствует`'} ➞ ${newSplash ? `[Перейти](${newSplash})` : '`Отсутствует`'}`
                    }
                )
            }

            if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
                updated = true
                const oldSplash = client.util.getDiscoverySplash(oldGuild)
                const newSplash = client.util.getDiscoverySplash(newGuild)
                embed.addFields(
                    {
                        name: '> Фон поиска:',
                        value: `・${oldSplash ? `[Перейти](${oldSplash})` : '`Отсутствует`'} ➞ ${newSplash ? `[Перейти](${newSplash})` : '`Отсутствует`'}`
                    }
                )
            }

            if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
                updated = true
                const oldDescription = oldGuild.description ?? 'Без описаний'
                const newDescription = newGuild.description ?? 'Без описаний'
                embed.addFields(
                    {
                        name: '> Описание:',
                        value: `・\`${oldDescription}\` ➞ \`${newDescription}\``
                    }
                )
            }

            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                updated = true
                const oldVerify = client.services.lang.get(`verificationGuildLevel.${oldGuild.verificationLevel}`, oldGuild.preferredLocale)
                const newVerify = client.services.lang.get(`verificationGuildLevel.${newGuild.verificationLevel}`, oldGuild.preferredLocale)
                embed.addFields(
                    {
                        name: '> Уровень верификации:',
                        value: `・\`${oldVerify}\` ➞ \`${newVerify}\``
                    }
                )
            }

            if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
                updated = true
                const oldFilter = client.services.lang.get(`explicitContentFilter.${oldGuild.explicitContentFilter}`, oldGuild.preferredLocale)
                const newFilter = client.services.lang.get(`explicitContentFilter.${newGuild.explicitContentFilter}`, oldGuild.preferredLocale)
                embed.addFields(
                    {
                        name: '> Модерация контента:',
                        value: `・\`${oldFilter}\` ➞ \`${newFilter}\``
                    }
                )
            }

            if (oldGuild.mfaLevel !== newGuild.mfaLevel) {
                updated = true
                const oldMfaLevel = client.services.lang.get(`mfaLevel.${oldGuild.mfaLevel}`, oldGuild.preferredLocale)
                const newMfaLevel = client.services.lang.get(`mfaLevel.${newGuild.mfaLevel}`, oldGuild.preferredLocale)
                embed.addFields(
                    {
                        name: '> 2FA:',
                        value: `・\`${oldMfaLevel}\` ➞ \`${newMfaLevel}\``
                    }
                )
            }

            if (oldGuild.nsfwLevel !== newGuild.nsfwLevel) {
                updated = true
                const oldNSFWLevel = client.services.lang.get(`nsfwLevel.${oldGuild.mfaLevel}`, oldGuild.preferredLocale)
                const newNSFWLevel = client.services.lang.get(`nsfwLevel.${newGuild.mfaLevel}`, oldGuild.preferredLocale)
                embed.addFields(
                    {
                        name: '> NSFW:',
                        value: `・\`${oldNSFWLevel}\` ➞ \`${newNSFWLevel}\``
                    }
                )
            }

            if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
                updated = true
                const oldLocale = oldGuild.preferredLocale
                const newLocale = newGuild.preferredLocale
                embed.addFields(
                    {
                        name: '> Язык:',
                        value: `・\`${oldLocale}\` ➞ \`${newLocale}\``
                    }
                )
            }
            
            if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                updated = true
                const oldVanityUrl = oldGuild.vanityURLCode ?? 'Без кода приглашения'
                const newVanityUrl = newGuild.vanityURLCode ?? 'Без кода приглашения'
                embed.addFields(
                    {
                        name: '> Код приглашения:',
                        value: `・\`${oldVanityUrl}\` ➞ \`${newVanityUrl}\``
                    }
                )
            }
            
            if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
                updated = true
                const oldRulesChannel = oldGuild.rulesChannel ? `<#${oldGuild.rulesChannelId}>` : 'Без канала с правилами'
                const newRulesChannel = newGuild.rulesChannel ? `<#${newGuild.rulesChannelId}>` : 'Без канала с правилами'
                embed.addFields(
                    {
                        name: '> Канал правила:',
                        value: `・${oldRulesChannel} ➞ ${newRulesChannel}`
                    }
                )
            }

            if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
                updated = true
                const oldSystemChannel = oldGuild.systemChannel ? `<#${oldGuild.systemChannelId}>` : 'Без системного канала'
                const newSystemChannel = newGuild.systemChannel ? `<#${newGuild.systemChannelId}>` : 'Без системного канала'
                embed.addFields(
                    {
                        name: '> Системный канал:',
                        value: `・${oldSystemChannel} ➞ ${newSystemChannel}`
                    }
                )
            }

            if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
                updated = true
                const oldPublicChannel = oldGuild.publicUpdatesChannel ? `<#${oldGuild.publicUpdatesChannelId}>` : 'Без канала публикаций'
                const newPublicChannel = newGuild.publicUpdatesChannel ? `<#${newGuild.publicUpdatesChannelId}>` : 'Без канала публикаций'
                embed.addFields(
                    {
                        name: '> Публичный канал:',
                        value: `・${oldPublicChannel} ➞ ${newPublicChannel}`
                    }
                )
            }
            
            if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
                updated = true
                const oldPublicChannel = oldGuild.publicUpdatesChannel ? `<#${oldGuild.publicUpdatesChannelId}>` : 'Без канала предупреждений'
                const newPublicChannel = newGuild.publicUpdatesChannel ? `<#${newGuild.publicUpdatesChannelId}>` : 'Без канала предупреждений'
                embed.addFields(
                    {
                        name: '> Канал предупреждений:',
                        value: `・${oldPublicChannel} ➞ ${newPublicChannel}`
                    }
                )
            }

            if (oldGuild.widgetChannelId !== newGuild.widgetChannelId) {
                updated = true
                const oldWidgetChannel = oldGuild.widgetChannel ? `<#${oldGuild.widgetChannelId}>` : 'Без виджет канала'
                const newWidgetChannel = newGuild.widgetChannel ? `<#${newGuild.widgetChannelId}>` : 'Без виджет канала'
                embed.addFields(
                    {
                        name: '> Виджет канал:',
                        value: `・${oldWidgetChannel} ➞ ${newWidgetChannel}`
                    }
                )
            }

            if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
                updated = true
                const oldAfkChannel = oldGuild.afkChannel ? `<#${oldGuild.afkChannelId}>` : 'Без AFK канала'
                const newAfkChannel = newGuild.afkChannel ? `<#${newGuild.afkChannelId}>` : 'Без AFK канала'
                embed.addFields(
                    {
                        name: '> Канал AFK:',
                        value: `・${oldAfkChannel} ➞ ${newAfkChannel}`
                    }
                )
            }

            if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
                updated = true
                const oldAfkTimeout = `${Math.round(oldGuild.afkTimeout / 1000)}с`
                const newAfkTimeout = `${Math.round(newGuild.afkTimeout / 1000)}с`
                embed.addFields(
                    {
                        name: '> Таймаут AFK:',
                        value: `・${oldAfkTimeout} ➞ ${newAfkTimeout}`
                    }
                )
            }

            if(updated) await auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
        }

        if(res.status) {
            if(oldGuild.banner !== newGuild.banner) {
                return client.db.crashs.push(oldGuild, res, AuditLogEvent.GuildUpdate, 'EditGuildBanner')
            }

            if(oldGuild.icon !== newGuild.icon) {
                return client.db.crashs.push(oldGuild, res, AuditLogEvent.GuildUpdate, 'EditGuildIcon')
            }

            if(oldGuild.name !== newGuild.name) {
                return client.db.crashs.push(oldGuild, res, AuditLogEvent.GuildUpdate, 'EditGuildName', { guild: oldGuild })
            }

            if(oldGuild.vanityURLCode && oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
                return client.db.crashs.push(oldGuild, res, AuditLogEvent.GuildUpdate, 'EditGuildLink', { guild: oldGuild })
            }
        }
    }
)