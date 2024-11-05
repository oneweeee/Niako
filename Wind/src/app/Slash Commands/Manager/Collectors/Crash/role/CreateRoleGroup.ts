import { CommandInteraction, RoleSelectMenuInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: RoleSelectMenuInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const role = menu.roles.first()!
    if(res.groups.find((g) => g.roleId === role.id)) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.create_group", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.exist_group", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveRoleGroup') ]
        })
    }

    res.groups.push(
        {
            roleId: role.id,
            members: [],
            type: 'Role',
            actions: []
        }
    )

    await client.db.crashs.save(res)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.create_group", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_role_create", locale)} ${role.toString()}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveRoleGroup') ] 
    })
}