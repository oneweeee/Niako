import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'devPanel.RemoveStar',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        return button.showModal(
            new ModalBuilder()
            .setCustomId('devPanelModalWindow.RemoveStar')
            .setTitle('Удаление звёзд')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('userId')
                    .setLabel('Id пользователя')
                    .setMaxLength(19)
                    .setMinLength(18)
                    .setPlaceholder(client.util.arrayRandom(client.config.owners.map((o) => o.id)))
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('count')
                    .setLabel('Количество звёзд')
                    .setPlaceholder(String(client.util.random(1, 30)))
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    },
    {
        onlyOwner: true
    }
)