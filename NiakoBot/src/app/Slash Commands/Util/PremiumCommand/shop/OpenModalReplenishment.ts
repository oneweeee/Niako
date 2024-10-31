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
        .setCustomId('modalWindowReplenishment')
        .setTitle(client.lang.get('modals.replenishment.title', lang))
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('count')
                .setLabel(client.lang.get('modals.replenishment.count', lang))
                .setRequired(true)
                .setMaxLength(4)
                .setPlaceholder(client.lang.get('modals.replenishment.placeholder', lang))
                .setStyle(TextInputStyle.Short)
            )
        )
    )
}