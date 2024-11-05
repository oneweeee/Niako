import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    TextChannel,
    NewsChannel,
    VoiceChannel,
    ForumChannel,
} from "discord.js";

export default new BaseListener(
    { name: 'webhooksUpdate' },
    async (client, channel: TextChannel | NewsChannel | VoiceChannel | ForumChannel) => {
        const res = await client.db.crashs.get(channel.guild.id)

        if(res.status) {
            return client.db.crashs.push(channel.guild, res, AuditLogEvent.WebhookCreate, 'CreateWebhook', { channel })
        }
    }
)