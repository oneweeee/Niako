import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder,
    ButtonInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    
    if(button.customId !== 'leaveToBackgrounds') {
        await button.showModal(
            new ModalBuilder()
            .setCustomId('modalWindowSetBackground')
            .setTitle('Установка фона')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('url')
                    .setLabel('Ссылка')
                    .setPlaceholder('https://media.discordapp.net/.../banner.png')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue((doc.background === 'Default' || doc.background.startsWith('canvasCache')) ? '' : doc.background)
                )
            )
        )
    }

    if(button.customId === 'setAnyBackground') return

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Управление фонами',
                'Вы **можете** установить как и **свой** фон, так и **выбрать** один из паков!'
            )
            .setImage(client.config.meta.pack)
        ],
        components: client.storage.components.setBannerBackground(lang),
        files: []
    })
}