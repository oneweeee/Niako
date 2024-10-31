import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.group.get(interaction.guildId)

    if(!doc.state) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Удаление групп',
                    `У Вас **нет** созданных **групп**`, true
                )
            ]
        })
    }

    await client.db.modules.group.delete(doc, interaction.guild)
    await client.db.groups.removeGuildGroups(interaction.guildId)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Удаление групп',
                `Вы **удалили** систему **групп**`, true
            )
        ]
    }).catch(() => {})
}