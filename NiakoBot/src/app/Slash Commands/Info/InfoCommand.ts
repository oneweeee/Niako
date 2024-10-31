import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";

export default new BaseSlashCommand(
    'info',
    {
        module: 'info',
        name: 'info',
        description: 'Посмотреть информацию о боте',
        detailedDescription: 'Показывает информацию о боте: статистика, версияя, создатели, а также ссылки на ресурсы'
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        return interaction.editReply({
            embeds: [ await client.storage.embeds.botinfo(lang) ]
        })
    }
)