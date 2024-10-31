import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.group.get(interaction.guildId)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Изменение кнопок',
                `Выберите **в меню** кнопку, для **его** изменения`
            )
        ],
        components: client.storage.components.selectCustomGroupButton(doc, interaction.guild)
    })
}