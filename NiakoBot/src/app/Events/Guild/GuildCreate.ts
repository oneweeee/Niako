import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import { Guild } from "discord.js";

export default new BaseEvent(

    {
        name: 'guildCreate'
    },

    async (client: NiakoClient, guild: Guild) => {
        client.request.resolveGuild(guild.id, true)

        const owner = await guild.fetchOwner().catch(() => null)
        const guilds = ((await client.cluster.broadcastEval(
            client => client.guilds.cache.map((g) => g)
        )).flat() as Guild[]).sort((a, b) => b.memberCount - a.memberCount)

        const embed = client.storage.embeds.color()
        .setColor(0x28C76F)
        .setAuthor({ name: `Добавлена на сервере ${guild.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1098190090116812850.png?size=4096' })
        .setThumbnail(client.util.getIcon(guild))
        .setImage(client.config.meta.line)

        .addFields(
            {
                name: `> Владелец:`,
                value: `・${owner ? owner.user.toString() : `<@!${guild.ownerId}>`} \n・${owner ? owner.user.username : 'Unknown'} \n・\`${owner ? owner.user.id : guild.ownerId}\``,
                inline: true
            },
            {
                name: `> Ссылка:`,
                value: `${guild?.vanityURLCode ? `[Зайти](https://discord.gg/${guild.vanityURLCode})` : 'Отсутсвует'}`,
                inline: false
            },
            {
                name: `> Участников:`,
                value: `\`\`\`yaml\n${guild.memberCount}\`\`\``,
                inline: true
            },
        )
        .setFooter({ text: `ID: ${guild.id}・Серверов: ${guilds.length}`})
        .setTimestamp(guild.createdTimestamp || Date.now())

        await client.cluster.broadcastEval((client, ctx): any => {
            const channel = client.channels.cache.get(ctx.channelId)
            if(channel && channel.isTextBased()) {
                return channel.send(ctx.message)
            }
        }, { context: { channelId: client.config.channels.joinGuild, message: { embeds: [ embed ]} }})

        return client.voiceManager.initVoiceGuildMemberOnline(guild)
    }
)