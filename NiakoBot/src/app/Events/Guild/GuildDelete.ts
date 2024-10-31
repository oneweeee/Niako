import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import { Guild } from "discord.js";

export default new BaseEvent(

    {
        name: 'guildDelete'
    },

    async (client: NiakoClient, guild: Guild) => {
        if(!guild?.name) return

        client.request.resolveGuild(guild.id, false)
        
        const boosts = await client.db.boosts.filter({ guildId: guild.id })

        if(boosts.length > 0) {
            boosts.map(async (b) => {
                b.boosted = false
                b.boostedTimestamp = 0
                b.guildId = '0'
                await b.save()
            })
        }

        const badges = await client.db.badges.filterGuild(guild.id)
        if(badges.some((b) => b.badge === 'NiakoPartner')) {
            if(client.db.badges.partners.has(guild.id)) {
                client.db.badges.partners.delete(guild.id)
            }

            await client.db.badges.remove(guild.id, 'NiakoPartner', 'Guild')
        }

        const owner = await guild.fetchOwner().catch(() => null)
        const guilds = ((await client.cluster.broadcastEval(
            client => client.guilds.cache.map((g) => g)
        )).flat() as Guild[]).sort((a, b) => b.memberCount - a.memberCount)

        const embed = client.storage.embeds.color()
        .setColor(0xEA5455)
        .setAuthor({ name: `Выгнана с сервера ${guild.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1098190093111537694.png?size=4096' })
        .setThumbnail(client.util.getIcon(guild))
        .setImage(client.config.meta.line)

        .addFields(
            {
                name: `> Владелец:`,
                value: `・${owner ? owner.user.toString() : `<@!${guild.ownerId}>`} \n・${owner ? owner.user.username : 'Unknown'} \n・\`${owner ?owner.user.id : guild.ownerId}\``,
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
            }
        )
        .setFooter({ text: `ID: ${guild.id}・Серверов: ${guilds.length}`})
        .setTimestamp(guild.createdTimestamp || Date.now())

        return client.cluster.broadcastEval((client, ctx): any => {
            const channel = client.channels.cache.get(ctx.channelId)
            if(channel && channel.isTextBased()) {
                return channel.send(ctx.message)
            }

        }, { context: { channelId: client.config.channels.joinGuild, message: { embeds: [ embed ]} }})
    }
)