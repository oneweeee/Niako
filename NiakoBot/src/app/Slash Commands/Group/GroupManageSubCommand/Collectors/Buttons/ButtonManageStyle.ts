import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.group.get(interaction.guildId)
    const config = doc.buttons.find((b) => b.customId === button.customId.split('.')[1])!

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Изменение стиля кнопоки',
                `Выберите **в меню** нужный Вам **стиль** кнопки`
            )
        ],
        components: client.storage.components.selectGroupButtonStyle(config)
    })
}