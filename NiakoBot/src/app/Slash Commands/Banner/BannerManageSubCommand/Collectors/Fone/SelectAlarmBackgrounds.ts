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
    return menu.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetBackgrounds.${menu.values.map((s) => s.split(':')[0]).join('-')}`)
        .setTitle('Установка фонов')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('url')
                .setLabel('Ссылка')
                .setPlaceholder('https://media.discordapp.net/.../banner.png')
                .setRequired(false)
                .setStyle(TextInputStyle.Paragraph)
            )
        )
    )
}