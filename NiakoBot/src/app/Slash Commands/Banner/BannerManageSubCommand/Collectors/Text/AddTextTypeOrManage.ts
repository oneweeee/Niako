import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    const value = menu.values[0]

    if(value === 'addText') {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, 'Добавление текста',
                    'Выберите, какой **тип** текста Вы **хотите** добавить?'
                )
            ],
            components: client.storage.components.chooseAddTextType(lang),
            files: []
        })
    } else {
        const values = menu.values[0].split('.')
        const doc = await client.db.modules.banner.get(interaction.guildId)
        const text = client.db.modules.banner.getText(doc, values[0], values[1])
        if(!text) {
            return menu.reply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Управление текстом',
                        'Я не нашла текст...'
                    )
                ],
                ephemeral: true
            })
        }

        await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

        await menu.deferUpdate().catch(() => {})

        const data = await client.storage.embeds.bannerManageText(interaction.member, doc, text, lang)

        return interaction.editReply({
            ...data,
            components: client.storage.components.manageText(text, lang),
        })
    }
}