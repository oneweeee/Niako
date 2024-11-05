import { CommandInteraction, ModalSubmitInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.raids.get(interaction.guildId)

    const count = modal.fields.getTextInputValue('memberCount')

    if(!client.util.isNumber(count, { min: 1 })) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.member", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.raid.set_number", locale)}`
                )
            ],
            components:[ client.storage.components.leaveCustom(locale, 'leaveRaidSystem', false) ]
        }) 
    }

    const old = get.memberCount

    get.memberCount = Math.round(parseInt(count))
    await client.db.raids.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiRaidMemberCountEdit',
            system: 'Raid',
            locale: locale,
            member: interaction.member,
            old: old,
            new: get.memberCount
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.member", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.raid.set_join", locale)} "**${count}**" ${client.services.lang.get("commands.antinuke.collectors.raid.at", locale)}`
            )
        ],
        components:[ client.storage.components.leaveCustom(locale, 'leaveRaidSystem') ]
    })
}