import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'roleinfo',
    {
        module: 'info',
        name: 'roleinfo',
        description: 'Посмотреть информацию о роли',
        detailedDescription: 'Показывает информацию о роли: название, цвет, кол-во уч и др',
        usage: '/roleinfo [@Роль | Id]',

        examples: [
            {
                action: '@Team',
                description: 'покажет информацию о роли с названием Team'
            },
            {
                action: '1073972775871586325',
                description: 'покажет информацию о роли с Id 1073972775871586325'
            }
        ],

        options: [
            {
                type: ApplicationCommandOptionType.Role,
                name: 'role',
                nameLocalizations: {
                    'ru': 'роль'
                },

                detailedDescription: '123',
                description: 'role',
                descriptionLocalizations: {
                    'ru': 'Укажите роль, о которой хотите узнать информацию'
                },
                required: true
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ fetchReply: true })

        const role = interaction.options.get('role', true)?.role!

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.roleinfo(role) ],
            components: client.storage.components.roleinfo('info')
        })
        
        client.storage.collectors.interaction(
            interaction,
            message,
            async (int) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'left':
                            const pageLeft = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.roleMembers(role, pageLeft, lang) ],
                                components: client.storage.components.roleinfoMembers(role, pageLeft, lang)
                            })
                        case 'right':
                            const pageRight = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.roleMembers(role, pageRight, lang) ],
                                components: client.storage.components.roleinfoMembers(role, pageRight, lang)
                            })
                    }
                } else if(int.isStringSelectMenu()) {
                    const value = int.values[0]

                    if(value === 'info') {
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.roleinfo(role) ],
                            components: client.storage.components.roleinfo('info')
                        })
                    } else {
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.roleMembers(role, 0, lang) ],
                            components: client.storage.components.roleinfoMembers(role, 0, lang)
                        })
                    }
                }
            }
        )
    }
)