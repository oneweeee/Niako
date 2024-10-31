import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Выбор типа бэкапа',
                'Выберите, какое **тип** Вы хотите применить **из** предложенных?'
            )
        ],
        components: client.storage.components.chooseBackupType(lang)
    })
}