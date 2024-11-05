import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, locale: Locale) => {
    const roleId = button.customId.split('.')[1]
    return interaction.editReply({
        embeds: [
            client.storage.embeds.choose(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.delete_group", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.you_sure", locale)} <@&${roleId}>?`
            )
        ],
        components: client.storage.components.choose(`DeleteGroup.${roleId}`, `leaveEditRoleGroup.${roleId}`)
    })
}