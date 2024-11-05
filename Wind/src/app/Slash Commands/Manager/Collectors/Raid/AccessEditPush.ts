import { CommandInteraction, StringSelectMenuInteraction, Locale } from "discord.js"
import { IRaidPush } from "#db/raid/RaidSchema"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.raids.get(interaction.guildId)

    const choose = menu.values[0] as IRaidPush

    const old = get.push

    get.push = choose
    await client.db.raids.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiRaidPushEdit',
            system: 'Raid',
            locale: locale,
            member: interaction.member,
            old: client.util.resolvePushType(old, locale),
            new: client.util.resolvePushType(get.push, locale)
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.punishment", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.raid.applied", locale)} "**${client.util.resolvePushType(choose, locale)}**" ${client.services.lang.get("commands.antinuke.collectors.raid.at", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveRaidSystem') ]
    })
}