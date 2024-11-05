import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { meta } from "../../../config";

export default new BaseSlashCommand(
    'set',
    {
        name: 'set',
        description: 'Начать набор',
        onlyMod: true,
        options: [
            {
                name: 'тип',
                description: 'Выберите набор, который нужно отправить',
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'Модератор', value: meta.moderatorId },
                    { name: 'Менеджер', value: meta.managerId }
                ]
            }
        ]
    },
    async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const type = interaction.options.get('тип', true)!.value as string

        switch(type) {
            case meta.moderatorId:
                await interaction.channel!.send({
                    embeds: [
                        client.storage.embeds.color()
                        .setAuthor({
                            name: 'Набор на Moderator',
                            iconURL: 'https://cdn.discordapp.com/attachments/1014818343640899604/1166928175528431656/NK_ServerRoleModerator.png'
                        }).setImage('https://media.discordapp.net/attachments/1014818343640899604/1166926935104950342/8c928af8c20d193b.png')
                        .setDescription(
                            '**Moderator** — несет ответственность за дружелюбную атмосферу на сервере и помогает разобраться с ботом в тикетах.'
                        ).addFields(
                            {
                                name: '> **Требования:**',
                                value: (
                                    `${client.config.emojis.dot}Адекватность и стрессоустойчивость` + '\n'
                                    + `${client.config.emojis.dot}Знание [условий использования](https://discord.com/channels/976118601348153414/1119118243207057468/1122812791414329386)` + '\n'
                                    + `${client.config.emojis.dot}Знание [конфиденциальности](https://discord.com/channels/976118601348153414/1119118243207057468/1122812791414329386)` + '\n'
                                    + `${client.config.emojis.dot}Возраст от 16-ти лет`
                                )
                            },
                            {
                                name: '> **От нас вы можете ожидать:**',
                                value: (
                                    `${client.config.emojis.dot}Дружный коллектив` + '\n'
                                    + `${client.config.emojis.dot}Возможность набраться опыта`
                                )
                            }
                        )
                    ],
                    components: client.storage.components.set(type)
                })
                break
            case meta.managerId:
                await interaction.channel!.send({
                    embeds: [
                        client.storage.embeds.color()
                        .setAuthor({
                            name: 'Набор на Manager',
                            iconURL: 'https://cdn.discordapp.com/attachments/1014818343640899604/1172447014496251904/Share_Circle.png'
                        }).setImage('https://media.discordapp.net/attachments/1014818343640899604/1166926935104950342/8c928af8c20d193b.png')
                        .setDescription(
                            '**Manager** — отвечает за продвижение популярности бота на просторах Discord платформы',
                        ).addFields(
                            {
                                name: '> **Требования:**',
                                value: (
                                    `${client.config.emojis.dot}Адекватность и стрессоустойчивость` + '\n'
                                    + `${client.config.emojis.dot}Грамотность` + '\n'
                                    + `${client.config.emojis.dot}Возраст от 16-ти лет`
                                )
                            },
                            {
                                name: '> **От нас вы можете ожидать:**',
                                value: (
                                    `${client.config.emojis.dot}Дружный коллектив` + '\n'
                                    + `${client.config.emojis.dot}Возможность набраться опыта`
                                )
                            }
                        )
                    ],
                    components: client.storage.components.set(type)
                })
                break

        }

        return interaction.editReply({ content: 'Сообщение отправлено' })
    }
)