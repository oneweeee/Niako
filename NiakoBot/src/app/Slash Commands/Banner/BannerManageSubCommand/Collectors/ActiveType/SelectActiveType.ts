import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Изменить тип активности',
                'Какой **тип** Вы хотите **применить** на активного участника?'
            )
        ],
        components: client.storage.components.chooseSetActiveType(doc.activeType, lang),
        files: []
    })
}