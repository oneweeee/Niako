import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'ping',
        description: 'Посмотреть задержку бота',
        descriptionLocalizations: {
            'ru': 'Посмотреть задержку бота',
            'en-US': 'View bot latency'
        },
        category: 'info'
    },

    async (client, interaction, { interactionCached, locale }) => {
        await interaction.deferReply()

        return interaction.editReply({
            content: (
                `${client.services.lang.get("commands.info.cluster", locale)}: **${client.util.getClusterName(client.cluster.id+1)}** (${client.cluster.id+1}/${client.cluster.count})` + '\n'
                + `${client.services.lang.get("commands.ping.shards", locale)}: [ ${[...client.cluster.ids.keys()].map((n) => Number(n) + 1).join(', ')} ]` + '\n'
                + `${client.emoji.ping.space}・${client.services.lang.get("commands.ping.delay", locale)}: ${client.ws.ping}${client.services.lang.get("main.time.ms", locale)}` + '\n'
                + `${client.emoji.ping.space}・${client.services.lang.get("commands.ping.processing", locale)}: ${Date.now()-interactionCached}${client.services.lang.get("main.time.ms", locale)}` + '\n'
                + `${client.emoji.ping.space}・${client.services.lang.get("commands.ping.db", locale)}: ${client.db.ping}${client.services.lang.get("main.time.ms", locale)}`
            )
        })
    }
)