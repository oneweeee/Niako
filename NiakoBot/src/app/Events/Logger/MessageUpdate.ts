import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ChannelType, Message, TextChannel } from "discord.js";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(

    {
        name: 'messageUpdate'
    },

    async (client: NiakoClient, oldMessage: Message, newMessage: Message) => {
        if(!oldMessage.guild || oldMessage.author.bot || !oldMessage.member || !oldMessage.content) return
        if(!newMessage.guild || newMessage.author.bot || !newMessage.member || !newMessage.content) return

        const doc = await client.db.modules.audit.get(oldMessage.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'messageUpdate')
            if(getConfig && getConfig.state) {
                const channel = oldMessage.guild.channels.cache.get(getConfig.channelId)
                if(channel && channel.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerYellow()
                    .setAuthor({ name: 'Изменение сообщения', iconURL: client.config.icons['Message']['Yellow'] })
                    .setFooter({ text: `Id автора: ${oldMessage.author.id}` })
                    .setTimestamp()
                    
                    const oldContent = !oldMessage.content ? 'Нет' : (oldMessage.content.length > 1024 ? oldMessage.content.substring(0, 1000) + '...' : oldMessage.content)
                    const newContent = !newMessage.content ? 'Нет' : (newMessage.content.length > 1024 ? newMessage.content.substring(0, 1000) + '...' : newMessage.content)

                    embed.addFields(
                        {
                            name: 'Автор',
                            inline: true,
                            value: `${oldMessage.member.toString()} | \`${oldMessage.author.tag}\``
                        },
                        {
                            name: 'Канал',
                            inline: true,
                            value: `${newMessage.channel.toString()} | \`${(newMessage.channel as TextChannel).name}\``
                        }
                    )

                    embed.addFields(
                        {
                            name: 'До',
                            value: `${oldContent}`
                        },
                        {
                            name: 'После',
                            value: `${newContent}`
                        }
                    )

                    return channel.send({
                        embeds: [ embed ],
                        components: client.storage.components.rowButtonLink(
                            `https://discord.com/channels/${oldMessage.guild.id}/${newMessage.channel.id}/${oldMessage.id}`,
                            'Перейти к сообщению'
                        )
                    }).catch(() => {})
                }
            }
        }
    }
)