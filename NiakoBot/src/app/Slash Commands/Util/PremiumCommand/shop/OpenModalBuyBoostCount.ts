import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
    return button.showModal(
        new ModalBuilder()
        .setCustomId('modalWindowBoostCount')
        .setTitle(client.lang.get('modals.boostCount.title', lang))
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('count')
                .setLabel(client.lang.get('modals.boostCount.count', lang))
                .setRequired(true)
                .setMaxLength(4)
                .setPlaceholder(client.lang.get('modals.boostCount.placeholder', lang))
                .setStyle(TextInputStyle.Short)
            )
        )
    )
}