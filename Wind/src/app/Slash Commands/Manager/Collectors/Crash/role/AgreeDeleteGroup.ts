import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const find = res.groups.find((g) => g.roleId === int.customId.split('.')[1])

    if(!find) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.delete_group", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_name", locale)} **${int.customId.split('.')[1]}** ${client.services.lang.get("commands.antinuke.collectors.crash.no_found", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveRoleGroup') ]
        })
    }

    const role = interaction.guild.roles.cache.get(find.roleId)?.name || int.customId.split('.')[1]

    res.groups.splice(res.groups.map((g)=> g.roleId).indexOf(int.customId.split('.')[1]), 1)
    await client.db.crashs.save(res)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.delete_group", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.deleted_group", locale)} **${role}**`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveRoleGroup') ]
    })
}