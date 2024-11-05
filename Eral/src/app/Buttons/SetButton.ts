import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";

export default new BaseInteraction(
    'set',
    async (client: RuslanClient, button: ButtonInteraction<'cached'>) => {
        const id = button.customId.split('.')[1]

        if((client.db.set.get(`${button.user.id}.${id}`) || 0) > Date.now()) {
            return button.reply({ content: 'Вы **уже** заполняли заявку!', ephemeral: true })
        }

        if(button.member.roles.cache.has(id)) {
            return button.reply({ content: 'Вы **уже** находитесь на этой роли!', ephemeral: true })
        }

        switch(id) {
            case client.config.meta.moderatorId:
                return button.showModal(
                    new ModalBuilder()
                    .setCustomId(button.customId)
                    .setTitle('Набор на Модератора')
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('name')
                            .setLabel('Как мы к Вам можем обращаться?')
                            .setPlaceholder(`Хеков Хека Хекович`)
                            .setMaxLength(128)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                        ),
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('age')
                            .setLabel('Сколько Вам лет?')
                            .setPlaceholder(`40`)
                            .setMaxLength(2)
                            .setMinLength(2)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                        ),
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('conf')
                            .setLabel('Знаете ли наши условия и конфиденциальность?')
                            .setPlaceholder(`Да`)
                            .setMinLength(2)
                            .setMaxLength(3)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                        ),
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('niako')
                            .setLabel('На сколько Вы знаете ниако?')
                            .setPlaceholder(`10/10, я взаиомдействовал с ботом с начала лета и очень знаю весь его функционал.`)
                            .setMaxLength(512)
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                        )
                    )
                )
            case client.config.meta.managerId:
                return button.showModal(
                    new ModalBuilder()
                    .setCustomId(button.customId)
                    .setTitle('Набор на Менедржера')
                    .addComponents(
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('name')
                            .setLabel('Как мы к Вам можем обращаться?')
                            .setPlaceholder(`Хеков Хека Хекович`)
                            .setMaxLength(128)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                        ),
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('age')
                            .setLabel('Сколько Вам лет?')
                            .setPlaceholder(`40`)
                            .setMaxLength(2)
                            .setMinLength(2)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                        ),
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('graf')
                            .setLabel('На сколько Вы грамотный?')
                            .setPlaceholder(`...`)
                            .setMaxLength(512)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                        ),
                        new ActionRowBuilder<TextInputBuilder>()
                        .addComponents(
                            new TextInputBuilder()
                            .setCustomId('niako')
                            .setLabel('На сколько Вы знаете ниако?')
                            .setPlaceholder(`10/10, я взаиомдействовал с ботом с начала лета и очень знаю весь его функционал.`)
                            .setMaxLength(512)
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                        )
                    )
                )
        }
    }
)