import { NiakoClient } from "../../../struct/client/NiakoClient";
import { AuditLogEvent, ChannelType, Collection, GuildEmoji } from "discord.js";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(

    {
        name: 'emojiCreate'
    },

    async (client: NiakoClient, emoji: GuildEmoji) => {
        const doc = await client.db.modules.audit.get(emoji.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'emojiCreate')
            if(getConfig && getConfig.state) {
                const logger = emoji.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerGreen()
                    .setAuthor({ name: 'Создание эмодзи', iconURL: client.config.icons['Emote']['Green'] })
                    .setFooter({ text: `Id эмодзи: ${emoji.id}` })
                    .setThumbnail(emoji.url)
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Эмодзи',
                            inline: true,
                            value: `${emoji.toString()} | \`${emoji.name}\``
                        }
                    )

                    const action = (await emoji.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.EmojiCreate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Создал',
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
)