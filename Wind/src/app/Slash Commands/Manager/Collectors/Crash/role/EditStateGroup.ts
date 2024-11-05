import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const find = res.groups.find((g) => g.roleId === int.customId.split('.')[1])

    if(!find) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_name", locale)} **${int.customId.split('.')[1]}** ${client.services.lang.get("commands.antinuke.collectors.crash.no_found", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveRoleGroup') ]
        })
    }

    const role = interaction.guild.roles.cache.get(find.roleId)?.name || int.customId.split('.')[1]

    let state = !Boolean(find?.disabled)

    find.disabled = state
    res.markModified('groups')
    await client.db.crashs.save(res)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.you", locale)} **${state ? `${client.services.lang.get("commands.antinuke.collectors.crash.group_off", locale)}` : `${client.services.lang.get("commands.antinuke.collectors.crash.group_on", locale)}`}** ${client.services.lang.get("commands.antinuke.collectors.crash.group", locale)} **${role}**`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, `leaveEditRoleGroup.${int.customId.split('.')[1]}`) ]
    })
}