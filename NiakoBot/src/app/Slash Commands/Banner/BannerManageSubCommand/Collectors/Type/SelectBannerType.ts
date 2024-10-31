import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Изменить качество',
                'Какое **качество** Вы хотите **применить** на баннер?'
            )
        ],
        components: client.storage.components.chooseSetBannerType(doc.type, lang),
        files: []
    })
}