import { CommandInteraction, Locale, StringSelectMenuInteraction } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const find = res.groups.find((g) => g.roleId === menu.customId.split('.')[1])

    if(!find) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_name", locale)} **${menu.customId.split('.')[1]}** ${client.services.lang.get("commands.antinuke.collectors.crash.no_found", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveEditRolesGroup') ]
        })
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.new_punishment", locale)}`
            )
        ],
        components: client.storage.components.chooseActionPushRoleEdit(find.roleId, menu.values[0], locale)
    })
}