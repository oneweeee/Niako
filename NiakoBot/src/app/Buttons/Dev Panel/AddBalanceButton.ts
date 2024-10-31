import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'devPanel.AddBalance',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        return button.showModal(
            new ModalBuilder()
            .setCustomId('devPanelModalWindow.AddBalance')
            .setTitle('Выдача денег')
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
                    .setLabel('Количество рублей')
                    .setPlaceholder(String(client.util.random(1, 999999)))
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