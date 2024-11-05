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
    const res = await client.db.crashs.get(interaction.guildId)
    
    switch(menu.values[0]) {
        case 'actionGroup':
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.groupAction(interaction, client.db.guilds.getColor(interaction.guildId), res, 'Role', locale)
                ],
                components: client.storage.components.roleGroupEdit(interaction.guild, res, locale)
            })
        case 'channel':
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.notification", locale)}`,
                        locale, `${client.services.lang.get("commands.antinuke.collectors.crash.select_channel", locale)}`
                    )
                ],
                components: client.storage.components.settingCrashChannel(res, locale)
            })
        case 'ban':
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.ban_role", locale)}`,
                        locale, `${client.services.lang.get("commands.antinuke.collectors.crash.select_role", locale)}`
                    )
                ],
                components: client.storage.components.settingCrashBanRole(res, locale)
            })
        case 'whiteList':
            return interaction.editReply({
                embeds: [ client.storage.embeds.whitelist(interaction, client.db.guilds.getColor(interaction.guildId), res.whiteList, locale) ],
                components: client.storage.components.chooseWhitelistAction(res.whiteList, locale)
            })
        case 'warns':
            return menu.showModal(
                new ModalBuilder()
                .setCustomId('modalWindowSetWarns')
                .setTitle('Предупреждения')
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                        .setCustomId('warns')
                        .setStyle(TextInputStyle.Short)
                        .setLabel('Кол-во')
                        .setMaxLength(2)
                        .setPlaceholder(String(client.util.random(1, 10)))
                        .setRequired(true)
                    )
                )
            )
    }
}