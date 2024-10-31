import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const angle = modal.fields.getTextInputValue('angle')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка угла',
                    'Я не нашла текст...'
                )
            ]
        })
    }

    if(client.util.isNumber(angle, { maxChecked: 360, minChecked: -360 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка угла',
                    'Вы **не** можете установить **угл** больше **360** или меньше **-360**'
                )
            ]
        })
    }

    if((text.angle === 'None' ? 0 : text.angle) === Number(angle)) {
        return modal.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Установка угла', 'У Вас уже **установлен** данный угол') ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    text.angle = (Number(angle) === 0 ? 'None' : Number(angle))

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    const data = await client.storage.embeds.bannerManageText(interaction.member, doc, text, lang)

    await interaction.editReply({
        ...data,
        components: client.storage.components.manageText(text, lang),
    })


    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка угла',
                `Вы установили угол в **${angle}** градусов`
            )
        ]
    })
}