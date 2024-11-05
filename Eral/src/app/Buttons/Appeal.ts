import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import Client from "../../struct/client/Client";

export default new BaseInteraction(
    'appeal',
    async (client: Client, button: ButtonInteraction<'cached'>) => {
        if(client.db.appeal.has(button.user.id)) {
            return button.reply({
                content: 'Вы уже **заполняли** аппеляцию',
                ephemeral: true
            })
        }

        return button.showModal(
            new ModalBuilder()
            .setCustomId('showModalWindowAppeal')
            .setTitle('Аппеляция')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Причина')
                    .setMaxLength(512)
                    .setPlaceholder('Причина, по которой мы должны Вас разблокировать')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                )
            )
        )
    }
)