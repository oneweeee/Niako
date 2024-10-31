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
        name: 'stickerCreate'
    },

    async (client: NiakoClient, sticker: Sticker) => {
        if(sticker.type !== StickerType.Guild || !sticker?.guild?.id) return

        const doc = await client.db.modules.audit.get(sticker.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'stickerCreate')
            if(getConfig && getConfig.state) {
                const logger = sticker.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerGreen()
                    .setAuthor({ name: 'Создание стикера', iconURL: client.config.icons['Emote']['Green'] })
                    .setFooter({ text: `Id стикера: ${sticker.id}` })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Стикер',
                            inline: true,
                            value: `${sticker.name}`
                        }
                    )

                    const action = (await sticker.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.StickerCreate)
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