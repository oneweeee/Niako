import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {    
    const values = button.customId.split('.')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Скрытие/Раскрытие текста',
                    'Я не нашла текст...'
                )
            ],
            ephemeral: true
        })
    }

    const res = client.db.boosts.getMaxCountTextsOnBanner(interaction.guildId)
    const texts = client.db.modules.banner.itemsFilterText(doc, true)
    if(texts.length > res.count && text.disabled) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Скрытие/Раскрытие текста',
                    `Вы **не** можете **раскрыть** текст, так как у Вас **недостаточен** уровень.\n> Повысьте **уровень** сервера, чтобы **раскрыть** текст`
                )
            ],
            ephemeral: true
        })
    }
    
    text.disabled = !text.disabled

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        components: client.storage.components.manageText(text, lang),
    })
}