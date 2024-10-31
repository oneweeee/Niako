import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, removed: boolean, lang: string) => {
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member,
                client.lang.get('commands.premium.removeOrGiveBoost.title', lang),
                (
                    removed ?
                    client.lang.get('commands.premium.removeOrGiveBoost.give', lang)
                    : client.lang.get('commands.premium.removeOrGiveBoost.remove', lang)
                ),
                { color: true }
            )
        ],
        components: client.storage.components.serverBoostedMenu(removed, lang)
    })
}