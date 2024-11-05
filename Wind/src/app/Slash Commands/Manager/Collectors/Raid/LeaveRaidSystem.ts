import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const raid = await client.db.raids.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.antiraidMainMenu(interaction, client.db.guilds.getColor(interaction.guildId), raid, locale)
        ],
        components: client.storage.components.antiraidSetting(raid, locale)
    })
}