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
                    interaction.member, 'Установка выравниваний',
                    'Я не нашла текст...'
                )
            ],
            ephemeral: true
        })
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Установка выравниваний',
                'Выберите, какое **выравнивание** Вы хотите **применить** по **x** или **y** координате?'
            )
        ],
        components: client.storage.components.chooseTextAlignAndBaseline(text, lang),
        files: []
    })
}