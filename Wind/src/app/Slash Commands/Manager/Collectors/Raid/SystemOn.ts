import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.raids.get(interaction.guildId)

    get.status = true
    await client.db.raids.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiRaidOn',
            system: 'Raid',
            locale: locale,
            member: interaction.member,
            reason: client.services.lang.get("commands.antinuke.collectors.raid.on", locale)
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.system", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.raid.enabled", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveRaidSystem') ]
    })
}