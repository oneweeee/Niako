import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const values = button.customId.split('.')
    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return button.reply({
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

    await button.deferUpdate().catch(() => {})
    
    const data = await client.storage.embeds.bannerManageImage(interaction.member, doc, image, lang)

    return interaction.editReply({
        ...data,
        components: client.storage.components.manageImage(image, lang),
    })
}