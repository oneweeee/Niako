import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)
    return interaction.editReply({
        embeds: [ client.storage.embeds.whitelist(interaction, client.db.guilds.getColor(interaction.guildId), res.whiteList, locale) ],
        components: client.storage.components.chooseWhitelistAction(res.whiteList, locale)
    })
}