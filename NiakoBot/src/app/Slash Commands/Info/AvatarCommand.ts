import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'avatar',
    {
        module: 'info',
        name: 'avatar',
        description: 'Посмотреть аватар или баннер пользователя',
        detailedDescription: 'Показывает аватар и баннер, а также дает ссылу на её скачивание',
        usage: '/avatar [@Участник | Id]',

        examples: [
            {
                action: '@oneits',
                description: 'покажет аватар и баннер об упомянутом пользователе'
            },
            {
                action: '947586139911491635',
                description: 'покажет аватар и баннер о пользователе с указанным Id'
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
                    'ru': 'Укажите пользователя, у которого хотите посмотреть аватар или баннер'
                }
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        const member = interaction.options.getMember('user') ?? interaction.member

        const message = await interaction.editReply({
            embeds: [ await client.storage.embeds.avatar(member, false, false, interaction.member.id === member.id) ],
            components: client.storage.components.chooseTypeAvatar('profile')
        })

        client.storage.collectors.interaction(
            interaction,
            message,
            async (int) => {
                if(int.isStringSelectMenu()) {
                    const value = int.values[0]
                    return await interaction.editReply({
                        embeds: [ await client.storage.embeds.avatar(member, value === 'server', value === 'banner', interaction.member.id === member.id) ],
                        components: client.storage.components.chooseTypeAvatar(value as any)
                    })
                }
            }
        )
    }
)