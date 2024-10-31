import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildChannel
} from "discord.js";

export default new BaseEvent(

    {
        name: 'channelCreate'
    },

    async (client: NiakoClient, channel: GuildChannel) => {
        const doc = await client.db.modules.audit.get(channel.guildId)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'channelCreate')
            if(getConfig && getConfig.state) {
                const logger = channel.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const channelConfig = client.db.modules.audit.getChannelAssets(channel, 'Green')
                    const embed = client.storage.embeds.loggerGreen()
                    .setAuthor({ name: channelConfig.authors['Create'], iconURL: channelConfig.icon })
                    .setFooter({ text: `Id канала: ${channel.id}` })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Канал',
                            inline: true,
                            value: `${channel.toString()} | \`${channel.name}\``
                        }
                    )

                    const action = (await channel.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.ChannelCreate)
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