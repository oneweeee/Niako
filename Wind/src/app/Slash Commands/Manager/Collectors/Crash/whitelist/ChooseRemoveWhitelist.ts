import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, locale: Locale) => {
    if(
        interaction.user.id !== interaction.guild.ownerId
        && !client.config.developers.includes(interaction.user.id) &&
        interaction.member.roles.highest.position !== interaction.guild.roles.cache.size-1
    ) {
        return int.reply({ content: `${client.services.lang.get("commands.antinuke.anticrash.error_whitelist", locale)}`, ephemeral: true })
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.remove_whitelist", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.remove_user", locale)}`
            )
        ],
        components: client.storage.components.chooseWhitelist(false, locale)
    })
}