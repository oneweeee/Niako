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
                    interaction.member, 'Удаление текста',
                    'Я не нашла текст...'
                )
            ],
            ephemeral: true
        })
    }
    
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Удаление текста',
                `Вы **уверены**, что хотите **удалить** текст **${client.constants.get(text.textType, lang)}**?\nДля **согласия** нажмите на ${client.config.emojis.agree}, для **отказа** - ${client.config.emojis.refuse}`
            )
        ],
        components: client.storage.components.choose(`DeleteText.${text.textType}.${text.createdTimestamp}`, `manageText.${text.textType}.${text.createdTimestamp}`),
        files: []
    })
}