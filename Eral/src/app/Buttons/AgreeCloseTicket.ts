import { AttachmentBuilder, ButtonInteraction, ChannelType, TextChannel } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";
import moment from "moment-timezone";

export default new BaseInteraction(
    'agreeCloseTicket',
    async (client: RuslanClient, button: ButtonInteraction<'cached'>) => {
        await button.update({ components: [], embeds: [ client.storage.embeds.info('Выполнено') ] })

        const messageId = button.customId.split('.')[1]

        const doc = await client.db.tickets.getMessage(messageId)
        if(!doc) return button.editReply({ content: 'Тикет не найден...' })

        await (button.channel as TextChannel).send({
            embeds: [ client.storage.embeds.info('Данный канал удалится в течение 5 секунд...') ]
        })

        const channel = button.guild.channels.cache.get(client.config.ticket.requestId)
        if(channel && channel.type === ChannelType.GuildText) {
            const message = await channel.messages.fetch(doc.messageId).catch(() => null)
            if(message && message.editable) {
                const embed = client.storage.embeds.copy(message.embeds[0].data)

                if(doc.members.length > 0) {
                    embed.addFields(
                        { name: 'Участники вовлечённые в тикет:', value: doc.members.map((m) => `・<@${m.id}> (\`${m.id}\`) | ${m.removed ? 'Был удалён' : 'Остался'}`).join('\n') }
                    )
                }
                
                let buffer: Buffer
                if(doc.messages.length === 0) {
                    buffer = Buffer.from('Сообщений небыло', 'utf-8')
                } else {
                    buffer = Buffer.from(
                        doc.messages.map((m) => {
                            const date = moment(m.sendedTimestamp).tz('Europe/Moscow').locale('ru-RU').format('DD.MM.YYYY HH:mm:ss')
                            return `| [${date}] ${m.username}: ${m.content}`
                        }).join('\n'),
                        'utf-8')
                }

                const att = new AttachmentBuilder(buffer, { name: 'message.txt' })

                await message.edit({
                    embeds: [
                        embed.setTimestamp(Date.now())
                        .setAuthor({ name: 'Тикет закрыт' })
                    ],
                    files: [ att ],
                    components: []
                })
            }
        }

        return setTimeout(async () => {
            await button.channel!.delete('Закрытие тикета')

            if(client.db.tickets.channels.has(doc.channelId)) {
                client.db.tickets.channels.delete(doc.channelId)
            }

            doc.channelId = '0'
            doc.opened = false
            doc.requested = false
            doc.closedTimestamp = Date.now()
            await client.db.tickets.save(doc)
        }, 5_000)
    }
)