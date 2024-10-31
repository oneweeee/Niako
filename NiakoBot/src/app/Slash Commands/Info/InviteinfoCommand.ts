import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'inviteinfo',
    {
        module: 'info',
        name: 'inviteinfo',
        description: 'Посмотреть информацию о ссылке',
        detailedDescription: 'Показывает информацию о ссылке: сервер, кто создал, канал и др',
        usage: '/inviteinfo [https:// || discord.gg/ | code]',

        examples: [
            {
                action: 'niako',
                description: 'покажет информацию о сервере с кодом приглашения niako'
            }
        ],

        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'code',
                nameLocalizations: {
                    'ru': 'код'
                },

                detailedDescription: '123',
                description: 'user',
                descriptionLocalizations: {
                    'ru': 'Укажите код приглашения, о котором хотите узнать информацию'
                },
                required: true
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        const code = interaction.options.get('code', true)?.value as string

        const resolveInvite = code.startsWith('discord.gg') ? `https://${code}` : !code.startsWith('https://') ? `https://discord.gg/${code}` : code
        const invite = await client.fetchInvite(resolveInvite).catch(async () => {
            await interaction.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Информация о ссылке',
                        'Некоректно указана **ссылка** или **код** приглашения'
                    )
                ]
            })
            return null
        })

        if(invite) {
            return interaction.editReply({
                embeds: [ await client.storage.embeds.inviteinfo(invite) ]
            })
        }
    }
)