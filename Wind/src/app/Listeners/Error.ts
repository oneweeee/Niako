import BaseListener from "#base/BaseListener";

export default new BaseListener(
    { name: 'error' },
    async (client, error: Error) => {
        console.log(error)
        const embed = client.storage.embeds.color(client.db.guilds.getColor())
        .setTitle(`${error?.name || 'Неизвестная ошибка'}`)
        .setDescription(client.util.toCode(error, 'js'))
        .setTimestamp()
    
        return client.cluster.broadcastEval((client, ctx): any => {
            const channel = client.channels.cache.get(ctx.channelId)
            if(channel && channel.isTextBased()) {
                return channel.send(ctx.message)
            }
        }, { context: { channelId: client.config.logger.error, message: { embeds: [ embed ]} }})
    }
)