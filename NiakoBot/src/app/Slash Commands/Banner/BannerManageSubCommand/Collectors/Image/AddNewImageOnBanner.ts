import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    if(menu.values[0] === 'Image') {
        return menu.showModal(
            new ModalBuilder()
            .setCustomId('modalWindowAddImage')
            .setTitle('Добавить изображение')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('name')
                    .setLabel('Название')
                    .setMaxLength(32)
                    .setPlaceholder('Звёздочка')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                ),

                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('url')
                    .setLabel('Ссылка')
                    .setPlaceholder('https://media.discordapp.net/.../star.png')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    } else {
        return menu.showModal(
            new ModalBuilder()
            .setCustomId('modalWindowAddActiveMemberAvatar')
            .setTitle('Добавить изображение')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('name')
                    .setLabel('Название')
                    .setMaxLength(32)
                    .setPlaceholder('Аватарка самого активного')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }
}