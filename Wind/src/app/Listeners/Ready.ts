import BaseListener from "#base/BaseListener";
import WindApi from "../../api/index";

export default new BaseListener(
    { name: 'ready', once: true },
    async (client) => {
        await client.setApplicationCommands()
        await client.managers.request.init()
        await client.db.init()

        const guild = client.guilds.cache.get(client.config.memo.guildId)
        if(guild && !client.config.debug) {
            const channel = guild.channels.cache.get(client.config.memo.channelId)
            if(channel && channel.isTextBased()) {
                const message = client.config.memo.messageId ? await channel.messages.fetch(client.config.memo.messageId).catch(() => null) : null
                if(!message) {
                    await channel.send({ content: 'memo' }).catch(() => {})
                } else {
                    await message.edit({
                        content: null,
                        embeds: [
                            client.storage.embeds.color(client.db.guilds.getColor()).setImage('https://cdn.discordapp.com/attachments/1143241987324133517/1160228555817504840/banner.png')
                        ],
                        components: client.storage.components.getMemoSelect()
                    })
                }
            }
        }

        client.config.developers.map(async (id) => await client.users.fetch(id).catch(() => {}))

        if(client.cluster.id === 0 && !client.config.debug) {
            new WindApi(client)
            await client.db.accounts.init()
            setTimeout(async () => await client.managers.request.postTopGuilds(), 60_000)
            setInterval(async () => await client.sendMonitoringStats(), 300_000)
            setInterval(async () => await client.managers.request.postTopGuilds(), 600_000)
        }

        setTimeout(async () => await client.managers.request.postGuilds(), 2_000)
        
        return client.logger.windConnect(client)
    }
)