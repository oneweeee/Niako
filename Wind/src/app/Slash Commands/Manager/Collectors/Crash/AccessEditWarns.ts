import { CommandInteraction, ModalSubmitInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.crashs.get(interaction.guildId)
    const warns = modal.fields.getTextInputValue('warns')

    if(!client.util.isNumber(warns, { min: 1 })) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Анти-краш система — Количество предупреждений`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.set_number", locale)}`
                )
            ],
            components:[ client.storage.components.leaveCustom(locale, 'leaveCrashSystem', false) ]
        }) 
    }

    const old = get.warnResolve

    get.warnResolve = Math.round(parseInt(warns))
    await client.db.crashs.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiCrashWarnCountEdit',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            old: `${Math.round(old)}`,
            new: `${Math.round(get.warnResolve)}`,
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `Анти-краш система — Количество предупреждений`,
                locale, `Вы **установили** количество предупреждений на "**${warns}**"`
            )
        ],
        components:[ client.storage.components.leaveCustom(locale, 'leaveCrashSystem') ]
    })
}