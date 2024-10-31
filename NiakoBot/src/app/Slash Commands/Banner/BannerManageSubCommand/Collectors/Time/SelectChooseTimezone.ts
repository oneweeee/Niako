import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Установка тайм-зоны',
                `Выберите **нужные** Вам **варианты** тайм-зоны на баннере`
            )
        ],
        components: client.storage.components.chooseBannerTimezone(doc.timezone, lang),
        files: []
    })
}