import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const values = button.customId.split('.')
    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return button.reply({
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

    await button.deferUpdate().catch(() => {})
    
    const data = await client.storage.embeds.bannerManageText(interaction.member, doc, text, lang)

    return interaction.editReply({
        ...data,
        components: client.storage.components.manageText(text, lang),
    })
}