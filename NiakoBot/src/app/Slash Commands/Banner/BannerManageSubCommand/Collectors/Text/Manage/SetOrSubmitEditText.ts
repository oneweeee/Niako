import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const values = menu.customId.split('.')
    const textType = menu.values[0]

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return menu.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Изменение текста',
                    'Я не нашла текст...'
                )
            ],
            ephemeral: true
        })
    }
    
    if(textType === text.textType) {
        return menu.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Изменение текста',
                    'Текст и так **является** этим типом'
                )
            ],
            ephemeral: true
        })
    }

    if(textType === 'Default') {
        return menu.showModal(
            new ModalBuilder()
            .setCustomId(`modalWindowEditTextSize.${text.textType}.${text.createdTimestamp}`)
            .setTitle('Изменить')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('text')
                    .setLabel('Текст')
                    .setMaxLength(32)
                    .setPlaceholder('Niako лучший бот')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }

    text.textType = textType as any
    text.createdTimestamp = Date.now()

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Изменение текста',
                `Вы изменили **тип** текста`
            )
        ],
        components: client.storage.components.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, true)
    })
}