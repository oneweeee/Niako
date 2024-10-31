import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { ChannelType, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const channel = interaction.options.get('канал', true)?.channel ?? interaction.channel!
    if(!channel || (channel && channel.type !== ChannelType.GuildText)) {
        return interaction.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Панель управления действами', 'Указаный канал не является текстовым') ],
        })
    }

    const doc = await client.db.modules.audit.get(interaction.guildId)
    const getConfig = await client.db.modules.audit.getLoggerChannel(channel.id, doc)
    
    const message = await interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Панель управления действами',
                'В данной панели, Вы **можете** настроить действия на канал или выключить их'
            )
        ],
        components: client.storage.components.manageChannelLogger(getConfig.state, getConfig.types)
    })

    return client.storage.collectors.interaction(
        interaction, message,
        async (int) => {
            if(int.isButton()) {
                switch(int.customId) {
                    case 'setChannelState':
                        if(!interaction.guild.channels.cache.has(channel.id)) {
                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.error(
                                        interaction.member, 'Панель управления действами',
                                        'Канал удалён'
                                    )
                                ],
                                components: []
                            })
                        }

                        await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })

                        await int.deferReply({ ephemeral: true })

                        const newStateDoc = await client.db.modules.audit.get(interaction.guildId)
                        const newStateGetConfig = await client.db.modules.audit.getLoggerChannel(channel.id, doc)

                        newStateGetConfig.state = !newStateGetConfig.state
                        newStateDoc.markModified('channels')
                        await client.db.modules.audit.save(newStateDoc)
        
                        await interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, 'Панель управления действами',
                                    'В данной панели, Вы **можете** настроить действия на канал или выключить их'
                                )
                            ],
                            components: client.storage.components.manageChannelLogger(newStateGetConfig.state, newStateGetConfig.types)
                        })
                        
                        return int.editReply({
                            embeds: [
                                client.storage.embeds.success(
                                    interaction.member, 'Состояние логов',
                                    `Вы **${newStateGetConfig.state ? 'включили' : 'выключили'}** логи с канале ${channel.toString()}`
                                )
                            ]
                        })
                    case 'clearTypes':
                        if(!interaction.guild.channels.cache.has(channel.id)) {
                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.error(
                                        interaction.member, 'Панель управления действами',
                                        'Канал удалён'
                                    )
                                ],
                                components: []
                            })
                        }

                        await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })

                        await int.deferReply({ ephemeral: true })

                        const newTypeDoc = await client.db.modules.audit.get(interaction.guildId)
                        const newTypeGetConfig = await client.db.modules.audit.getLoggerChannel(channel.id, doc)

                        newTypeGetConfig.types = []
                        newTypeDoc.markModified('channels')
                        await client.db.modules.audit.save(newTypeDoc)
        
                        await interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, 'Панель управления действами',
                                    'В данной панели, Вы **можете** настроить действия на канал или выключить их'
                                )
                            ],
                            components: client.storage.components.manageChannelLogger(newTypeGetConfig.state, newTypeGetConfig.types)
                        })
                        
                        return int.editReply({
                            embeds: [
                                client.storage.embeds.success(
                                    interaction.member, 'Сброс типов логов',
                                    `Вы **сбросили** все **типы** логи с канале ${channel.toString()}`
                                )
                            ]
                        })
                }
            } else if(int.isStringSelectMenu()) {
                if(!interaction.guild.channels.cache.has(channel.id)) {
                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.error(
                                interaction.member, 'Панель управления действами',
                                'Канал удалён'
                            )
                        ],
                        components: []
                    })
                }
                
                await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })

                await int.deferReply({ ephemeral: true })

                const doc = await client.db.modules.audit.get(interaction.guildId)
                const getConfig = await client.db.modules.audit.getLoggerChannel(channel.id, doc)

                const values = int.values
                const findValue = values.find((v: any) => doc.channels.find((l) => l.types.includes(v) && l.channelId !== getConfig.channelId))
                if(findValue) {
                    await interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, 'Панель управления действами',
                                'В данной панели, Вы **можете** настроить действия на канал или выключить их'
                            )
                        ],
                        components: client.storage.components.manageChannelLogger(getConfig.state, getConfig.types)
                    })
                    
                    return int.editReply({
                        embeds: [
                            client.storage.embeds.error(
                                interaction.member, 'Установка логов в канал',
                                `В **указанных** Вами **типами** логов уже **есть** установленый тип **${findValue}**, установленный на **другой** канал`
                            )
                        ]
                    })
                }

                getConfig.types = values as any
                doc.markModified('channels')
                await client.db.modules.audit.save(doc)

                await interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, 'Панель управления действами',
                            'В данной панели, Вы **можете** настроить действия на канал или выключить их'
                        )
                    ],
                    components: client.storage.components.manageChannelLogger(getConfig.state, getConfig.types)
                })
                
                return int.editReply({
                    embeds: [
                        client.storage.embeds.success(
                            interaction.member, 'Установка логов в канал',
                            `Вы **установили** типы логов ${values.map((v) => `\`${v}\``).join(', ')}`
                        )
                    ]
                })
            }
        }
    )
}