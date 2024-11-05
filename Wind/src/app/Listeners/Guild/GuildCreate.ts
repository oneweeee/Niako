import { Guild } from "discord.js";
import BaseListener from "#base/BaseListener";

export default new BaseListener(
    { name: 'guildCreate' },
    async (client, guild: Guild) => {
        await client.managers.request.putGuild(guild.id, true)
        const owner = await guild.fetchOwner().catch(() => null)

        const guilds = ((await client.cluster.broadcastEval(
            client => client.guilds.cache.map((g) => g)
        )).flat() as Guild[]).sort((a, b) => b.memberCount - a.memberCount)

        const embed = client.storage.embeds.color(client.db.guilds.getColor(guild.id))
        .setColor(client.config.Colors.Green)
        .setAuthor(
            {
                name: `Добавлен на сервере ${guild.name}`,
                iconURL: client.icons['Guild']['Join']
            }
        )
        .setThumbnail(client.util.getIcon(guild))
        .addFields(
            {
                name: '> Присоединился:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Владелец:',
                value: `・${owner ? owner.user.toString() : `<@!${guild.ownerId}>`} \n・${owner ? owner.user.username : 'Unknown'} \n・\`${owner ?owner.user.id : guild.ownerId}\``,
                inline: true
            },
            {
                name: '> Создан:',
                value: `・<t:${Math.round( guild.createdTimestamp / 1000)}:f> \n・<t:${Math.round( guild.createdTimestamp / 1000)}:R>`,
                inline: false
            },
            {
                name: '> Участников:',
                value: `\`\`\`yaml\n${guild.memberCount}\`\`\``,
                inline: false
            }
        )
        .setImage(client.icons['Guild']['Line'])
        .setFooter(
            {
                text: `ID: ${guild.id}・Серверов: ${guilds.length}`
            }
        )
        .setTimestamp()

        return client.cluster.broadcastEval((client, ctx): any => {
            const channel = client.channels.cache.get(ctx.channelId)
            if(channel && channel.isTextBased()) {
                return channel.send(ctx.message)
            }
        }, { context: { channelId: client.config.logger.guildCreate, message: { embeds: [ embed ]} }})
    }
)