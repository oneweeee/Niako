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
                    interaction.member, 'Установка таймзоны',
                    'Я не нашла такой текст...'
                )
            ],
            ephemeral: true
        })
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Установка таймзоны',
                'Выберите, какая **таймзона** Вам подходит?'
            )
            .setFooter({ text: '・Московское время GMT+3' })
        ],
        components: client.storage.components.chooseTimezone(text, lang),
        files: []
    })
}