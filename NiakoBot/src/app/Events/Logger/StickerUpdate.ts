import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Sticker,
    StickerType
} from "discord.js";

export default new BaseEvent(

    {
        name: 'stickerUpdate'
    },

    async (client: NiakoClient, oldSticker: Sticker, newSticker: Sticker) => {
        if(oldSticker.type !== StickerType.Guild || !oldSticker?.guild?.id) return
        if(newSticker.type !== StickerType.Guild || !newSticker?.guild?.id) return

        const doc = await client.db.modules.audit.get(oldSticker.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'stickerUpdate')
            if(getConfig && getConfig.state) {
                const logger = oldSticker.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    let updated = false
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: 'Изменение стикера', iconURL: client.config.icons['Emote']['Yellow'] })
                    .setFooter({ text: `Id стикера: ${oldSticker.id}` })
                    .setTimestamp()
                    
                    if(oldSticker.name !== newSticker.name) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Название',
                                inline: true,
                                value: `\`${oldSticker.name}\` ➞ \`${newSticker.name}\``
                            }
                        )
                    } else {
                        embed.addFields(
                            {
                                name: 'Стикер',
                                inline: true,
                                value: `${oldSticker.name}`
                            }
                        )
                    }

                    const action = (await oldSticker.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.StickerUpdate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Изменил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    if(oldSticker.description !== newSticker.description) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Описание',
                                value: `\`${oldSticker.description}\` ➞ \`${newSticker.description}\``
                            }
                        )
                    }

                    if(updated) return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)