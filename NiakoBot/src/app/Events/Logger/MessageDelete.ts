import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Message,
    TextChannel
} from "discord.js";

export default new BaseEvent(

    {
        name: 'messageDelete'
    },

    async (client: NiakoClient, message: Message) => {
        if(!message.guild || message.author.bot || !message.member) return

        const doc = await client.db.modules.audit.get(message.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'messageDelete')
            if(getConfig && getConfig.state) {
                const channel = message.guild.channels.cache.get(getConfig.channelId)
                if(channel && channel.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerRed()
                    .setAuthor({ name: 'Удаление сообщения', iconURL: client.config.icons['Message']['Red'] })
                    .setFooter({ text: `Id автора: ${message.author.id}` })
                    .setTimestamp()
                    
                    const content = !message.content ? 'Нет' : (message.content.length > 1024 ? message.content.substring(0, 1000) + '...' : message.content)

                    embed.addFields(
                        {
                            name: 'Автор',
                            inline: true,
                            value: `${message.member.toString()} | \`${message.author.tag}\``
                        },
                        {
                            name: 'Канал',
                            inline: true,
                            value: `${message.channel.toString()} | \`${(message.channel as TextChannel).name}\``
                        }
                    )


                    const action = (await message.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MessageDelete)
                    if(action && action?.executor) {
                        if(action.executorId === client.user.id) return
                        embed.addFields(
                            {
                                name: 'Удалил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``
                            }
                        )
                    }

                    embed.addFields(
                        {
                            name: 'Сообщение',
                            value: String(content)
                        }
                    )

                    return channel.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)