import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    const value = menu.values[0]

    if(value === 'addImage') {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, 'Добавление изображения',
                    'Выберите, какой **тип** изображения Вы **хотите** добавить?'
                )
            ],
            components: client.storage.components.chooseAddImageType(lang),
            files: []
        })
    } else {
        const values = menu.values[0].split('.')
        const doc = await client.db.modules.banner.get(interaction.guildId)
        const image = client.db.modules.banner.getImage(doc, values[0], values[1])
        if(!image) {
            return menu.reply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Управление изображением',
                        'Я не нашла такое изображение...'
                    )
                ],
                ephemeral: true
            })
        }

        await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

        await menu.deferUpdate().catch(() => {})

        const data = await client.storage.embeds.bannerManageImage(interaction.member, doc, image, lang)

        return interaction.editReply({
            ...data,
            components: client.storage.components.manageImage(image, lang),
        })
    }
}