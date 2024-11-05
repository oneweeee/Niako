import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildEmoji,
} from "discord.js";

export default new BaseListener(
    { name: 'emojiUpdate' },
    async (client, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
        const res = await client.db.crashs.get(oldEmoji.guild.id)

        if(res.status) {
            await client.db.crashs.push(oldEmoji.guild, res, AuditLogEvent.EmojiUpdate, 'EditEmoji', { emoji: newEmoji })
        }

        const auditChannel = await client.db.audits.resolveChannel(oldEmoji.guild, 'EmojiUpdate')
        if(!auditChannel) return

        let updated = false
        const embed = client.storage.embeds.yellow()
        .setAuthor(
            {
                name: 'Изменение эмодзи',
                iconURL: client.icons['Emote']['Yellow']
            }
        )
        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            }
        )

        const action = await client.db.audits.getAudit(oldEmoji.guild, AuditLogEvent.EmojiUpdate)
        if(action && action?.executor) {
            embed.addFields(
                {
                    name: '> Изменил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: true
                }
            )
            .setThumbnail(client.util.getAvatar(action.executor))
            .setImage(client.icons['Guild']['Line'])
        }

        if(oldEmoji.name !== newEmoji.name) {
            updated = true
            embed.addFields(
                {
                    name: '> Название:',
                    inline: true,
                    value: `・\`${oldEmoji.name}\` ➞ \`${newEmoji.name}\``
                },
            )
        } else {
            embed.addFields(
                {
                    name: '> Канал:',
                    inline: true,
                    value: `・${oldEmoji.toString()} \n・${oldEmoji.name} \n・${oldEmoji.id}`
                }
            )
        }

        if(updated) return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
)