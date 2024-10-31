import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default new BaseInteraction(
    'devPanelSelectBadgeType.ManageBadges',
    async (client: NiakoClient, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
        switch(menu.values[0]) {
            case 'Guild':
                return menu.showModal(
                    new ModalBuilder()
                    .setCustomId('devPanelModalWindow.SelectGuildBadgeManage')
                    .setTitle('Сервер')
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('id')
                            .setLabel('Id сервера')
                            .setMaxLength(19)
                            .setMinLength(18)
                            .setPlaceholder(menu.guildId)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                        )
                    )
                )
            case 'User':
                return menu.showModal(
                    new ModalBuilder()
                    .setCustomId('devPanelModalWindow.SelectUserBadgeManage')
                    .setTitle('Пользователь')
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('id')
                            .setLabel('Id пользователя')
                            .setMaxLength(19)
                            .setMinLength(18)
                            .setPlaceholder(menu.user.id)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                        )
                    )
                )
            default:
                return menu.deferUpdate()
        }
    }
)