import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'info',
        description: 'Информация о Wind',
        descriptionLocalizations: {
            'ru': 'Информация о Wind',
            'en-US': 'Infomartion Wind'
        },
        category: 'info'
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        const pings = await client.cluster.fetchClientValues('ws.ping') as number[]
        const guilds = (await client.cluster.broadcastEval(
            (client) => client.guilds.cache.map((g) => ({ id: g.id, memberCount: g.memberCount }))
        ))
        
        return interaction.editReply({
            content: `${client.emoji.info.info}・\`${interaction.guild.name}\` ${client.services.lang.get("commands.info.located", locale)} \`#${client.cluster.id+1}\` ${client.services.lang.get("commands.info.toCluster", locale)} \`#${interaction.guild.shardId+1}\` ${client.services.lang.get("commands.info.toShard", locale)}`,
            embeds: [ client.storage.embeds.info(guilds, client.db.guilds.getColor(interaction.guildId), pings, locale) ],
            components: client.storage.components.info(locale)
        })
    }
)