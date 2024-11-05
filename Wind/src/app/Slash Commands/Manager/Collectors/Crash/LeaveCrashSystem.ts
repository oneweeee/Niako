import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const crash = await client.db.crashs.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            await client.storage.embeds.anticrashMainMenu(interaction, client.db.guilds.getColor(interaction.guildId), crash, locale)
        ],
        components: client.storage.components.anticrashSetting(crash, locale)
    })
}