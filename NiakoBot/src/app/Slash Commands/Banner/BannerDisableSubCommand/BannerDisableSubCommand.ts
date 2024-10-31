import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)

    doc.state = false
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Выключение модуля баннера',
                `Вы **выключили** модуль **обновления** баннера`, true
            )
        ]
    })
}