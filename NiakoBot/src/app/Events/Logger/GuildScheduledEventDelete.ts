import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildScheduledEvent
} from "discord.js";

export default new BaseEvent(

    {
        name: 'guildScheduledEventDelete',
        disabled: true
    },

    async (client: NiakoClient, guildScheduledEvent: GuildScheduledEvent) => {
        if(!guildScheduledEvent?.guild) return

        const doc = await client.db.modules.audit.get(guildScheduledEvent.guild.id)
        if(doc.state) {
            const getConfig = doc.channels.find((l) => l.types.includes('guildScheduledEventDelete'))
            if(getConfig && getConfig.state) {
                const logger = guildScheduledEvent.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerRed()
                    .setAuthor({ name: 'Удаление мероприятия', iconURL: client.config.icons['ScheduledEvent']['Red'] })
                    .setFooter({ text: `Id мероприятия: ${guildScheduledEvent.id}` })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Название',
                            inline: true,
                            value: `${guildScheduledEvent.name}`
                        },
                        {
                            name: 'Канал',
                            inline: true,
                            value: guildScheduledEvent.channel ? `${guildScheduledEvent.channel.toString()} | \`${guildScheduledEvent.channel.name}\`` : 'Нет'
                        }
                    )

                    const action = (await guildScheduledEvent.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.GuildScheduledEventDelete)
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