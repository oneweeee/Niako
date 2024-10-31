import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import {
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    StringSelectMenuInteraction
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    return menu.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowCreateBackupName.${menu.values[0]}`)
        .setTitle('Название бэкапа')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('name')
                .setLabel('Название')
                .setMaxLength(32)
                .setPlaceholder('Основной')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
        )
    )
}