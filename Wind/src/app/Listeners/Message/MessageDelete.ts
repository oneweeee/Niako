import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    Message,
    TextChannel,
} from "discord.js";

export default new BaseListener(
    { name: 'messageDelete' },
    async (client, message: Message) => {
        if(!message.guild || message?.author?.bot) return

        const channel = await client.db.audits.resolveChannel(message.guild, 'MessageDelete')
        if(!channel) return

        const embed = client.storage.embeds.red()
        .setAuthor(
            {
                name: 'Удалено сообщение',
                iconURL: client.icons['Message']['Red']
            }
        )
        .setImage(client.icons['Guild']['Line'])
        .setThumbnail(client.util.getAvatar(message.author))

        const content = !message.content ? 'Отсутствует' : (message.content.length >= 1024 ? (message.content.substring(0, 990) + '...') : message.content)

        embed.addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Автор:',
                inline: true,
                value: `・${message.author.toString()} \n・${message.author.tag} \n・${message.author.id}`
            },
            {
                name: '> Канал:',
                inline: true,
                value: `・${message.channel.toString()} \n・${(message.channel as TextChannel).name} \n・${message.channel.id}`
            }
        )

        const action = await client.db.audits.getAudit(message.guild, AuditLogEvent.MessageDelete)
        if(action && action?.executor) {
            if(action.executorId === client.user.id) return
            embed.addFields(
                {
                    name: '> Удалил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`
                }
            )
        }

        embed.addFields(
            {
                name: '> Удаленное сообщение:',
                value: client.util.toCode(content)
            }
        )

        return channel.text.send({ embeds: [ embed ] }).catch(() => {})
    }
)