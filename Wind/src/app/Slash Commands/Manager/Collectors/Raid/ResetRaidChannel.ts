import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.raids.get(interaction.guildId)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiRaidChannelLogReset',
            system: 'Raid',
            locale: locale,
            member: interaction.member,
            reason: client.services.lang.get("commands.antinuke.collectors.raid.channel", locale)
        }
    )

    get.channelId = '0'
    await client.db.raids.save(get)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.notification", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.raid.reset", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveRaidSystem') ]
    })
}