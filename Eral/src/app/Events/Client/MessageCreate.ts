import { ChannelType, Message } from "discord.js";
import Client from "../../../struct/client/Client";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'messageCreate'
    },
    async (client: Client, message: Message) => {
        if(message.author.bot) return
        if(!message.guild || !message.member || message.channel.type !== ChannelType.GuildText) return

        /*if(message.content === '!test') {
            return client.template.resolveCode(message, `$args[0]\n$nomention\nabc`).catch((err: any): any => {
                return message.channel.send({ content: client.template.createError(err.message) })
            })
        }*/

        if(message.channel?.parentId === client.config.ticket.parentId) {
            if(!message.content) return

            const doc = await client.db.tickets.getChannel(message.channelId)
            if(doc) {
                doc.messages.push({ userId: message.member.id, username: message.author.username, sendedTimestamp: Date.now(), content: message.content})
                doc.markModified('messages')
                await client.db.tickets.save(doc)
            }
        }

        return client.antispamManager.send(message)
    }
)