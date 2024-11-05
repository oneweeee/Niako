import BaseListener from "#base/BaseListener";
import {
    Message,
    TextChannel,
} from "discord.js";

export default new BaseListener(
    { name: 'messageUpdate' },
    async (client, oldMessage: Message, newMessage: Message) => {
        if(!oldMessage.guild || !newMessage.guild || oldMessage?.author?.bot) return

        const auditChannel = await client.db.audits.resolveChannel(oldMessage.guild, 'MessageUpdate')
        if(!auditChannel) return

        const embed = client.storage.embeds.yellow()
        .setAuthor(
            {
                name: 'Изменинно сообщение',
                iconURL: client.icons['Message']['Yellow']
            }
        )
        .setImage(client.icons['Guild']['Line'])
        .setThumbnail(client.util.getAvatar(oldMessage.author))

        const oldContent = !oldMessage.content ? 'Отсутствует' : (oldMessage.content.length >= 1024 ? (oldMessage.content.substring(0, 990) + '...') : oldMessage.content)
        const newContent = !newMessage.content ? 'Отсутствует' : (newMessage.content.length >= 1024 ? (newMessage.content.substring(0, 990) + '...') : newMessage.content)

        if(newContent === oldContent) return

        embed.addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Автор:',
                inline: true,
                value: `・${oldMessage.member!.toString()} \n・${oldMessage.author.tag} \n・${oldMessage.author.id}`
            },
            {
                name: '> Канал:',
                inline: true,
                value: `・${oldMessage.channel.toString()} \n・${(oldMessage.channel as TextChannel).name} \n・${oldMessage.channel.id}`
            }
        )

        embed.addFields(
            {
                name: 'Прошлое сообщение:',
                value: client.util.toCode(oldContent)
            },
            {
                name: 'Новое сообщение:',
                value: client.util.toCode(newContent)
            }
        )

        return auditChannel.text.send({
            embeds: [ embed ],
            components: client.storage.components.rowButtonLink(
                `https://discord.com/channels/${oldMessage.guild.id}/${newMessage.channel.id}/${oldMessage.id}`,
                'Перейти к сообщению'
            )
        }).catch(() => {})
    }
)