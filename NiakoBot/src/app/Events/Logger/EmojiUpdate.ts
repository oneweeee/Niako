import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildEmoji
} from "discord.js";

export default new BaseEvent(

    {
        name: 'emojiUpdate'
    },

    async (client: NiakoClient, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
        const doc = await client.db.modules.audit.get(oldEmoji.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'emojiUpdate')
            if(getConfig && getConfig.state) {
                const logger = oldEmoji.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    let updated = false
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: 'Изменение эмодзи', iconURL: client.config.icons['Emote']['Yellow'] })
                    .setFooter({ text: `Id эмодзи: ${oldEmoji.id}` })
                    .setTimestamp()
                    .setThumbnail(oldEmoji.url)
                    
                    if(oldEmoji.name !== newEmoji.name) {
                        updated = true
                        embed.addFields(
                            {
                                name: 'Название',
                                inline: true,
                                value: `\`${oldEmoji.name}\` ➞ \`${newEmoji.name}\``
                            }
                        )
                    } else {
                        embed.addFields(
                            {
                                name: 'Эмодзи',
                                inline: true,
                                value: `${oldEmoji.toString()} | \`${oldEmoji.name}\``
                            }
                        )
                    }

                    const action = (await oldEmoji.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.EmojiUpdate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Изменил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    if(updated) return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)