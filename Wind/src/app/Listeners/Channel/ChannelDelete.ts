import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildChannel,
} from "discord.js";

export default new BaseListener(
    { name: 'channelDelete' },
    async (client, channel: GuildChannel) => {
        const res = await client.db.crashs.get(channel.guild.id)

        if(res.status) {
            await client.db.crashs.push(channel.guild, res, AuditLogEvent.ChannelDelete, 'DeleteChannel', { channel })
        }

        const auditChannel = await client.db.audits.resolveChannel(channel.guild, 'ChannelDelete')
        if(!auditChannel) return

        const channelConfig = client.db.audits.getChannelAssets(channel, 'Red', channel.guild.preferredLocale)

        const embed = client.storage.embeds.red()
        .setAuthor(
            {
                name: channelConfig.authors['Delete'],
                iconURL: channelConfig.icon
            }
        )
        .setThumbnail(channel.guild.iconURL())
        .setImage(client.icons['Guild']['Line'])

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Канал:',
                inline: true,
                value: `・${channel.toString()} \n・${channel.name} \n・${channel.id}`
            }
        )

        const action = await client.db.audits.getAudit(channel.guild, AuditLogEvent.ChannelDelete)
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