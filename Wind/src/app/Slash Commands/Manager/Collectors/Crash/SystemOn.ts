import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.crashs.get(interaction.guildId)

    get.status = true
    client.db.crashs.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiCrashOn',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            reason: client.services.lang.get("commands.antinuke.collectors.crash.on", locale)
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.system", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.enabled", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem') ]
    })
}