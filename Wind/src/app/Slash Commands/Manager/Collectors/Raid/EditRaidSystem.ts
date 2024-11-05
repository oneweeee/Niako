import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle,
    Locale
} from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
    const choose = menu.values[0]

    const get = await client.db.raids.get(interaction.guildId)

    switch(choose) {
        case 'memberCount':
            return menu.showModal(
                new ModalBuilder()
                .setCustomId('modalMemberCount')
                .setTitle(`${client.services.lang.get("commands.antinuke.collectors.raid.change_number", locale)}`)
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('memberCount')
                        .setLabel(`${client.services.lang.get("commands.antinuke.collectors.raid.join", locale)}`)
                        .setPlaceholder(`${client.services.lang.get("commands.antinuke.collectors.raid.example_join", locale)}`)
                        .setStyle(TextInputStyle.Short)
                        .setValue(String(get.memberCount))
                        .setRequired(true)
                        .setMaxLength(3)
                    )
                )
            )
        case 'timeJoin':
            return menu.showModal(
                new ModalBuilder()
                .setCustomId('modalTimeJoin')
                .setTitle(`${client.services.lang.get("commands.antinuke.collectors.raid.change_time", locale)}`)
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('timeJoin')
                        .setLabel(`${client.services.lang.get("commands.antinuke.collectors.raid.time_join", locale)}`)
                        .setPlaceholder(`${client.services.lang.get("commands.antinuke.collectors.raid.example_time", locale)}`)
                        .setStyle(TextInputStyle.Short)
                        .setValue(String(Math.round(get.timeJoin/1000)))
                        .setRequired(true)
                        .setMaxLength(3)
                    )
                )
            )
        case 'push':
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.punishment", locale)}`,
                        locale, `${client.services.lang.get("commands.antinuke.collectors.raid.select_punishment", locale)}`
                    )
                ],
                components: client.storage.components.settingRaidPush(get, locale)
            })
        case 'channel':
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.notification", locale)}`,
                        locale, `${client.services.lang.get("commands.antinuke.collectors.raid.select_channel", locale)}`
                    )
                ],
                components: client.storage.components.settingRaidChannel(get, locale)
            })
    }
}