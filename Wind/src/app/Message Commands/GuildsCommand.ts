import { Guild } from "discord.js";
import BaseMessageCommand from "#base/BaseMessageCommand";

export default new BaseMessageCommand(
    { name: 'guilds', aliases: [ 'g' ], dev: true },
    async (client, message, args) => {
        const guilds = ((await client.cluster.broadcastEval(
            client => client.guilds.cache.map((g) => g)
        )).flat() as Guild[]).sort((a, b) => b.memberCount - a.memberCount)

        if(args[0]) {
            const g = guilds.find((g) => g.id === args[0]) as any
            if(!g) return

            return message.channel.send({
                embeds: [
                    client.storage.embeds.color(client.db.guilds.getColor(message.guild.id))
                    .setTitle(g.name)
                    .setThumbnail(g.iconURL)
                    .setURL(g?.vanityURLCode ? `https://discord.gg/${g.vanityURLCode}` : null)
                    .setDescription(
                        `**Владелец:** <@!${g.ownerId}>` + '\n'
                        + `**Пользователей:** ${g.memberCount}` +'\n'
                        + `**Каналов:** ${g.channels.length}` + '\n'
                        + `**Ролей:** ${g.roles.length}`
                    )
                    .setImage(client.icons['Guild']['Line'])
                    .setFooter({ text: `ID: ${g.id}` })
                    .setTimestamp(g.createdTimestamp)
                ],
            })
        }

        const options = { extra: true, trash: true, count: 10 }

        const msg = await message.channel.send({
            embeds: [ await client.storage.embeds.guilds(guilds, client.db.guilds.getColor(message.guild.id), message.guild.preferredLocale) ],
            components: client.storage.components.paginator(guilds, { ...options, page: 0 })
        })

        return client.storage.collectors.interaction(
            message, msg, async (int) => {
                if(!int.isButton()) return

                switch(int.customId) {
                    case 'trash':
                        return msg.delete()
                    case 'backward':
                        return msg.edit({
                            embeds: [ await client.storage.embeds.guilds(guilds, client.db.guilds.getColor(message.guild.id), message.guild.preferredLocale) ],
                            components: client.storage.components.paginator(guilds, { ...options, page: 0 })
                        })
                    case 'left':
                        const left = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[0])-2
                        return msg.edit({
                            embeds: [ await client.storage.embeds.guilds(guilds, client.db.guilds.getColor(message.guild.id), message.guild.preferredLocale, left) ],
                            components: client.storage.components.paginator(guilds, { ...options, page: left })
                        })
                    case 'right':
                        const right = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[0])
                        return msg.edit({
                            embeds: [ await client.storage.embeds.guilds(guilds, client.db.guilds.getColor(message.guild.id), message.guild.preferredLocale, right) ],
                            components: client.storage.components.paginator(guilds, { ...options, page: right })
                        })
                    case 'forward':
                        const page = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[1])-1
                        return msg.edit({
                            embeds: [ await client.storage.embeds.guilds(guilds, client.db.guilds.getColor(message.guild.id), message.guild.preferredLocale, page) ],
                            components: client.storage.components.paginator(guilds, { ...options, page })
                        })
                }
            }
        )
    }
)