import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {    
    const values = modal.customId.split('.')
    const fullText = modal.fields.getTextInputValue('text')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return modal.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Изменение текста',
                    'Я не нашла текст...'
                )
            ],
            ephemeral: true
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    text.text = fullText
    text.textType = 'Default'
    text.createdTimestamp = Date.now()

    doc.markModified('items')
    await client.db.modules.banner.save(doc)


    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Изменение текста',
                `Вы изменили текст на **${fullText}**`
            )
        ],
        components: client.storage.components.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, true)
    })
}