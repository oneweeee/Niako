import BaseSlashCommand from "#base/BaseSlashCommand"
import { Role } from "discord.js"

export default new BaseSlashCommand(
    {
        name: 'settings',
        description: 'Настройка',
        descriptionLocalizations: {
            'ru': 'Настройка',
            'en-US': 'Settings'
        },
        category: 'settings'
    },

    async (client, interaction, { locale }) => {
        const res = await client.db.guilds.get(interaction.guildId, locale)

        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.autorole.no_rights", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const message = await interaction.editReply({
            embeds: [
                client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка сервера', locale, null)
                .setDescription('> В **этом** меню, Вы можете **настроить** бота')
            ],
            components: client.storage.components.settings(locale)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(int.isButton()) {
                    if(int.customId === 'leave') {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка сервера', locale, null)
                                .setDescription('> В **этом** меню, Вы можете **настроить** бота')
                            ],
                            components: client.storage.components.settings(locale)
                        })
                    } else {
                        const action = int.customId.split('.')[1]
                        switch(action) {
                            case 'state':
                                const doc = await client.db.guilds.get(interaction.guildId, locale)
                                const type = int.customId.split('.')[0]
                                let role: string | Role | undefined = 'отсутсвует'
                                switch(type) {
                                    case 'general':
                                        doc.mutes.general.enabled = true
                                        if(doc.mutes.general?.roleId) {
                                            role = interaction.guild.roles.cache.get(doc.mutes.general.roleId)
                                        }
                                        break
                                    case 'text':
                                        doc.mutes.text.enabled = true
                                        if(doc.mutes.text?.roleId) {
                                            role = interaction.guild.roles.cache.get(doc.mutes.text.roleId)
                                        }
                                        break
                                    case 'voice':
                                        doc.mutes.voice.enabled = true
                                        if(doc.mutes.voice?.roleId) {
                                            role = interaction.guild.roles.cache.get(doc.mutes.voice.roleId)
                                        }
                                        break
                                    case 'timeout':
                                        doc.mutes.timeout.enabled = true
                                        role = 'таймаут'
                                        break
                                }

                                doc.markModified('mutes')
                                await client.db.guilds.save(doc)

                                return interaction.editReply({
                                    embeds: [
                                        client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка мутов', locale, `Что вы **хотите** сделать?${role === 'таймаут' ? '' : `\n\nРоль: ${role ? role.toString() : 'неизвестная'}`}`)
                                    ],
                                    components: client.storage.components.settingsMute(doc, type, locale)
                                })

                            case 'removeRole':
                                const docRemoveRole = await client.db.guilds.get(interaction.guildId, locale)
                                const typeRemoveRole = int.customId.split('.')[0]
                                switch(typeRemoveRole) {
                                    case 'general':
                                        delete docRemoveRole.mutes.general?.roleId
                                        break
                                    case 'text':
                                        delete docRemoveRole.mutes.text?.roleId
                                        break
                                    case 'voice':
                                        delete docRemoveRole.mutes.voice?.roleId
                                        break
                                }

                                docRemoveRole.markModified('mutes')
                                await client.db.guilds.save(docRemoveRole)

                                return interaction.editReply({
                                    embeds: [
                                        client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка мутов', locale, `Что вы **хотите** сделать?\n\nРоль: отсутсвует`)
                                    ],
                                    components: client.storage.components.settingsMute(docRemoveRole, typeRemoveRole, locale)
                                })

                            case 'clear':
                                const res = await client.db.guilds.get(interaction.guildId, locale)
                                const command = int.customId.split('.')[0]
                                switch(command) {
                                    case 'action':
                                        res.accessActionRoles = []
                                        break
                                }

                                await client.db.guilds.save(res)

                                return interaction.editReply({
                                    embeds: [
                                        client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка ролей доступа', locale, `Что вы **хотите** сделать?`)
                                    ],
                                    components: client.storage.components.settingsRoles(command, locale)
                                })
                        }

                        return
                    }
                } else if(int.isStringSelectMenu()) {
                    const action = int.values[0].split('.')[1]
                    switch(action) {
                        case 'mute':
                            const doc = await client.db.guilds.get(interaction.guildId, locale)
                            const type = int.values[0].split('.')[0]
                            let role: string | Role | undefined = 'отсутсвует'
                            switch(type) {
                                case 'general':
                                    if(doc.mutes.general?.roleId) {
                                        role = interaction.guild.roles.cache.get(doc.mutes.general.roleId)
                                    }
                                    break
                                case 'text':
                                    if(doc.mutes.text?.roleId) {
                                        role = interaction.guild.roles.cache.get(doc.mutes.text.roleId)
                                    }
                                    break
                                case 'voice':
                                    if(doc.mutes.voice?.roleId) {
                                        role = interaction.guild.roles.cache.get(doc.mutes.voice.roleId)
                                    }
                                    break
                                case 'timeout':
                                    role = 'таймаут'
                                    break
                            }

                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка мутов', locale, `Что вы **хотите** сделать?${role === 'таймаут' ? '' : `\n\nРоль: ${role ? role.toString() : 'неизвестная'}`}`)
                                ],
                                components: client.storage.components.settingsMute(doc, type, locale)
                            })

                        case 'roles':
                            const command = int.values[0].split('.')[0]
                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка ролей доступа', locale, `Что вы **хотите** сделать?`)
                                ],
                                components: client.storage.components.settingsRoles(command, locale)
                            })
                    }
                } else if(int.isRoleSelectMenu()) {
                    const action = int.customId.split('.')[1]
                    switch(action) {
                        case 'setRole':
                            const doc = await client.db.guilds.get(interaction.guildId, locale)
                            const type = int.customId.split('.')[0]
                            let role: string | Role = 'отсутсвует'
                            switch(type) {
                                case 'general':
                                    doc.mutes.general.roleId = int.roles.first()!.id
                                    role = int.roles.first()!
                                    break
                                case 'text':
                                    doc.mutes.text.roleId = int.roles.first()!.id
                                    role = int.roles.first()!
                                    break
                                case 'voice':
                                    doc.mutes.voice.roleId = int.roles.first()!.id
                                    role = int.roles.first()!
                                    break
                            }

                            doc.markModified('mutes')
                            await client.db.guilds.save(doc)

                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка мутов', locale, `Что вы **хотите** сделать?\n\nРоль: ${role.toString()}`)
                                ],
                                components: client.storage.components.settingsMute(doc, type, locale)
                            })

                        case 'setRoles':
                            const res = await client.db.guilds.get(interaction.guildId, locale)
                            const command = int.customId.split('.')[0]
                            switch(command) {
                                case 'action':
                                    res.accessActionRoles = int.roles.map((r) => r.id)
                                    break
                            }

                            await client.db.guilds.save(res)

                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка ролей доступа', locale, `Что вы **хотите** сделать?`)
                                ],
                                components: client.storage.components.settingsRoles(command, locale)
                            })
                    }
                }
            },
            60_000,
            async (_, reason: string) => {
                if(reason !== 'time') return
                
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка сервера', locale)
                    ], components: []
                }).catch(() => {})
            }
        )
    }
)