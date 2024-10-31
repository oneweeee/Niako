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
        name: 'channelDelete'
    },

    async (client: NiakoClient, channel: GuildChannel) => {
        const audit = await client.db.modules.audit.get(channel.guildId)
        const group = await client.db.modules.group.get(channel.guildId)

        if(group.channelId === channel.id) {
            await client.db.modules.group.delete(group, channel.guild)
        }

        const getLoggerIndex = audit.channels.findIndex((l) => l.channelId === channel.id)
        if(getLoggerIndex !== -1) {
            audit.channels.splice(getLoggerIndex, 1)
            await client.db.modules.audit.save(audit)
        }

        if(audit.state) {
            const getConfig = audit.types.find((l) => l.type === 'channelDelete')
            if(getConfig && getConfig.state) {
                const logger = channel.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const channelConfig = client.db.modules.audit.getChannelAssets(channel, 'Red')
                    const embed = client.storage.embeds.loggerRed()
                    .setAuthor({ name: channelConfig.authors['Delete'], iconURL: channelConfig.icon })
                    .setFooter({ text: `Id канала: ${channel.id}` })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Название',
                            inline: true,
                            value: `${channel.name}`
                        }
                    )

                    const action = (await channel.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.ChannelDelete)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Удалил',
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