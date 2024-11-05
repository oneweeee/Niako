import { CommandInteraction, ModalSubmitInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.raids.get(interaction.guildId)

    const count = modal.fields.getTextInputValue('timeJoin')

    if(!client.util.isNumber(count, { min: 1 })) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.time", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.raid.set_number", locale)}`
                )
            ],
            components:[ client.storage.components.leaveCustom(locale, 'leaveRaidSystem', false) ]
        }) 
    }

    const old = get.timeJoin

    get.timeJoin = Math.round(parseInt(count)*1000)
    await client.db.raids.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiRaidTimeJoinEdit',
            system: 'Raid',
            locale: locale,
            member: interaction.member,
            old: `${Math.round(old/1000)}${client.services.lang.get("main.time.s", locale)}`,
            new: `${Math.round(get.timeJoin/1000)}${client.services.lang.get("main.time.s", locale)}`,
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.time", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.raid.set_time", locale)} "**${count}**" ${client.services.lang.get("commands.antinuke.collectors.raid.at", locale)}`
            )
        ],
        components:[ client.storage.components.leaveCustom(locale, 'leaveRaidSystem') ]
    })
}