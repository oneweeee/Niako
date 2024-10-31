import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Время обновления',
                `Выберите **нужные** Вам **варианты** обновления **баннера** или **самого активного** участника`
            )
        ],
        components: client.storage.components.chooseBannerAndActiveUpdate(doc.updated, doc.activeUserUpdated, lang),
        files: []
    })
}