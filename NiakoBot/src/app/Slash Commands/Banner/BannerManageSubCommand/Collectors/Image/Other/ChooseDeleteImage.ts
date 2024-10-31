import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {    
    const values = button.customId.split('.')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Удаление изображения',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }
    
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Удаление изображения',
                `Вы **уверены**, что хотите **удалить** изображение **${image.name}**?\nДля **согласия** нажмите на ${client.config.emojis.agree}, для **отказа** - ${client.config.emojis.refuse}`
            )
        ],
        components: client.storage.components.choose(`DeleteImage.${image.type}.${image.createdTimestamp}`, `manageImage.${image.type}.${image.createdTimestamp}`),
        files: []
    })
}