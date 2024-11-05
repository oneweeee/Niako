import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildEmoji,
} from "discord.js";

export default new BaseListener(
    { name: 'emojiDelete' },
    async (client, emoji: GuildEmoji) => {
        const auditChannel = await client.db.audits.resolveChannel(emoji.guild, 'EmojiDelete')
        if(!auditChannel) return

        const embed = client.storage.embeds.red()
        .setAuthor(
            {
                name: 'Удаление эмодзи',
                iconURL: client.icons['Emote']['Red']
            }
        )
        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Эмодзи:',
                inline: true,
                value: `・[${emoji.name}](${emoji.url}) \n・${emoji.id}`
            }
        )

        const action = await client.db.audits.getAudit(emoji.guild, AuditLogEvent.EmojiDelete)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Удалил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: true
                }
            )
            .setThumbnail(client.util.getAvatar(action.executor))
            .setImage(client.icons['Guild']['Line'])
        }

        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)