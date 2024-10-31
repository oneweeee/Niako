import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Выбор действия бэкапа',
                'Выберите, с каким **бэкапом** Вы хотите **взаимодействовать** из меню ниже?'
            )
        ],
        components: (await client.storage.components.chooseBackupAction(interaction.member, lang)),
        files: []
    })
}