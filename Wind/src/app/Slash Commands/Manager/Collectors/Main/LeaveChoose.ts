import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    return interaction.editReply({
        embeds: [
            client.storage.embeds.antinukeMainMenu(interaction, client.db.guilds.getColor(interaction.guildId), locale)
        ],
        components: client.storage.components.chooseAntinukeSystem(locale)
    })
}