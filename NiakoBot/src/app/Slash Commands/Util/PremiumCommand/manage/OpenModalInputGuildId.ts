import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default (client: NiakoClient, button: ButtonInteraction<'cached'>, removed: boolean, lang: string) => {
    return button.showModal(
        new ModalBuilder()
        .setCustomId(removed ? 'modalWindowBoostRemove' : 'modalWindowBoostAdd')
        .setTitle(removed ? client.lang.get('modals.removeBoost', lang) : client.lang.get('modals.giveBoost', lang))
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('id')
                .setLabel(client.lang.get('system.serverId', lang))
                .setRequired(true)
                .setMaxLength(19)
                .setPlaceholder('976118601348153414')
                .setStyle(TextInputStyle.Short)
            )
        )
    )
}