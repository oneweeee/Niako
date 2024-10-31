import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.voice.get(interaction.guildId)

    if(!doc.state) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Удаление приватных комнат',
                    `У Вас **нет** созданных **приватных комнат**`, true
                )
            ]
        })
    }

    await client.db.modules.voice.delete(doc, interaction.guild)
    await client.db.rooms.removeGuildRooms(interaction.guildId)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Удаление приватных комнат',
                `Вы **удалили** систему **приватных комнат**`, true
            )
        ]
    }).catch(() => {})
}