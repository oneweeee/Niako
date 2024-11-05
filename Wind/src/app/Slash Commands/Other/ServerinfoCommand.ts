import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'serverinfo',
        description: 'Посмотреть информацию о сервере',
        descriptionLocalizations: {
            'ru': 'Посмотреть информацию о сервере',
            'en-US': 'View server information'
        },
        category: 'info'
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        return interaction.editReply({
            embeds: [await client.storage.embeds.serverinfo(interaction.guild, client.db.guilds.getColor(interaction.guildId), locale)]
        })
    }
)