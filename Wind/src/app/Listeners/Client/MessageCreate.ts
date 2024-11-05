import BaseListener from "#base/BaseListener"
import {
    AuditLogEvent,
    Message,
} from "discord.js"

export default new BaseListener(
    { name: 'messageCreate' },
    async (client, message: Message) => {
        if(!message.guild) return

        const res = await client.db.crashs.get(message.guild.id)

        if(res.status) {
            if(message.content && (message.content.includes('@everyone') || message.content.includes('@here'))) {
                if((message?.member && message.member.permissions.has('MentionEveryone')) || message?.webhookId) {
                    return client.db.crashs.push(message.guild, res, AuditLogEvent.InviteUpdate, 'MentionGuild', { executor: message.member!, message: message })
                }
            }
        }

        return client.watchers.messageCommands.parseMessage(message as Message<true>)
    }
)