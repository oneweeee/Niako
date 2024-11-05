import { StringSelectMenuInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";

export default new BaseInteraction(
    'createTicket',
    async (client: RuslanClient, menu: StringSelectMenuInteraction<'cached'>) => {
        const tag = menu.values[0]

        const check = await client.db.tickets.getTicket(menu.guildId, menu.member.id, tag)
        if(check) {
            return menu.reply({ content: 'У Вас **уже** есть **открытый** тикет на **данную** тему', ephemeral: true })
        }

        return menu.showModal(
            new ModalBuilder()
            .setCustomId(`submitWindowCreateTicket.${tag}`)
            .setTitle('Создание запроса')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setLabel('Тема')
                    .setMaxLength(256)
                    .setRequired(true)
                    .setCustomId('topic')
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder(
                        tag === 'help' ? 'Не могу разобраться...'
                        : tag === 'bug' ? 'Нашёл баг в...' :
                        'Сервер 100к+ уч хочу с вами сотрудничать...'
                    )
                )
            )
        )
    }
)