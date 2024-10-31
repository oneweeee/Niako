import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'userinfo',
    {
        module: 'info',
        name: 'userinfo',
        description: 'Посмотреть информацию о пользователе',
        detailedDescription: 'Показывает информацию о пользователе: имя, статус, даты присоединения и регистрации, аватарка и многое другое',
        usage: '/userinfo [@Участник | Id]',

        examples: [
            {
                action: '@oneits',
                description: 'покажет информацию об упомянутом пользователе'
            },
            {
                action: '947586139911491635',
                description: 'покажет информацию о пользователе с указанным Id'
            }
        ],

        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: 'user',
                nameLocalizations: {
                    'ru': 'пользователь'
                },

                detailedDescription: '123',
                description: 'user',
                descriptionLocalizations: {
                    'ru': 'Укажите пользователя, про которого Вы хотите узнать информацию'
                }
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        const member = interaction.options.getMember('user') ?? interaction.member

        return interaction.editReply({
            embeds: [ await client.storage.embeds.userinfo(member, lang) ],
            components: client.storage.components.presenceButtons(member.presence)
        })
    }
)