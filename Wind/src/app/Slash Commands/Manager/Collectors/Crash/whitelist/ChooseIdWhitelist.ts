import { ActionRowBuilder, TextInputBuilder, ButtonInteraction, CommandInteraction, ModalBuilder, TextInputStyle, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, locale: Locale) => {
    if(
        interaction.user.id !== interaction.guild.ownerId
        && !client.config.developers.includes(interaction.user.id) &&
        interaction.member.roles.highest.position !== interaction.guild.roles.cache.size-1
    ) {
        return int.reply({ content: `${client.services.lang.get("commands.antinuke.anticrash.error_whitelist", locale)}`, ephemeral: true })
    }

    return int.showModal(
        new ModalBuilder()
        .setCustomId(int.customId)
        .setTitle((int.customId.startsWith('add') ? 'Добавление' : 'Удаление') + 'с белого листа')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('id')
                .setLabel('ID')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(19)
                .setMinLength(18)
                .setRequired(true)
                .setPlaceholder(int.user.id)
            )
        )
    )
}