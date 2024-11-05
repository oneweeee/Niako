import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const roleId = int.customId.split('.')[1]
    const find = res.groups.findIndex((g) => g.roleId === roleId)

    if(typeof find === 'undefined' || find === -1) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_name", locale)} **${roleId}** ${client.services.lang.get("commands.antinuke.collectors.crash.no_found", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveEditRolesGroup') ]
        })
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`, locale,
                `Выбрите **тип** автонастройки **для** роли <@&${roleId}>`
            )
        ],
        components: client.storage.components.chooseActionAutoSettings(roleId, locale)
    })
}