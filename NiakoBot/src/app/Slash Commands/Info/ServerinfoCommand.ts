import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";

export default new BaseSlashCommand(
    'serverinfo',
    {
        module: 'info',
        name: 'serverinfo',
        description: 'Посмотреть информацию о сервере',
        detailedDescription: 'Показывает информацию о сервере: создатель, уровень проверки, количество участников и многое другое'
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        return interaction.editReply({
            embeds: [ await client.storage.embeds.serverinfo(interaction.guild, lang) ]
        })
    }
)