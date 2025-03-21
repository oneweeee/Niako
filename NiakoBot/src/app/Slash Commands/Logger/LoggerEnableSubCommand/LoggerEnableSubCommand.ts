import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.audit.get(interaction.guildId)

    doc.state = true
    await client.db.modules.audit.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Включение модуля аудита',
                `Вы **включили** модуль **логирования** действий`, true
            )
        ]
    })
}