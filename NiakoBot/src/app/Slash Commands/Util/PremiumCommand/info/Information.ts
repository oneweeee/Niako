import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    return interaction.editReply({
        embeds: client.storage.embeds.boostInfo(interaction.member, lang),
        components: client.storage.components.leave('leave', lang),
    })
}