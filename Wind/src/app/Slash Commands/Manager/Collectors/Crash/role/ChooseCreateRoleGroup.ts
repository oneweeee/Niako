import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.create_group", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.new_role_group", locale)}`
            )
        ],
        components: client.storage.components.chooseGroupRole(locale)
    })
}