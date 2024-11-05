import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'antinuke',
        description: 'Configure server protection from crashes and raids',
        descriptionLocalizations: {
            'ru': 'Настроить защиту сервера от краша и рейда'
        },
        category: 'settings'
    },
    async (client, interaction, { locale }) => {
        const res = await client.db.crashs.get(interaction.guildId)

        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !res.whiteList.includes(interaction.user.id) &&
            interaction.member.roles.highest.position !== interaction.guild.roles.cache.size-1 &&
            !client.config.developers.includes(interaction.user.id)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.antinuke.no_rights", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const message = await interaction.editReply({
            embeds: [
                client.storage.embeds.antinukeMainMenu(interaction, client.db.guilds.getColor(interaction.guildId), locale)
            ],
            components: client.storage.components.chooseAntinukeSystem(locale)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'leaveChoose':
                            return (await import('./Collectors/Main/LeaveChoose')).default(client, interaction, locale)
                        case 'leaveRaidSystem':
                            return (await import('./Collectors/Raid/LeaveRaidSystem')).default(client, interaction, locale)
                        case 'resetRaidChannel':
                            return (await import('./Collectors/Raid/ResetRaidChannel')).default(client, interaction, locale)
                        case 'raidOn':
                            return (await import('./Collectors/Raid/SystemOn')).default(client, interaction, locale)
                        case 'raidOff':
                            return (await import('./Collectors/Raid/SystemOff')).default(client, interaction, locale)
                        case 'leaveCrashSystem':
                            return (await import('./Collectors/Crash/LeaveCrashSystem')).default(client, interaction, locale)
                        case 'resetCrashChannel':
                            return (await import('./Collectors/Crash/ChannelReset')).default(client, interaction, locale)
                        case 'resetBanRole':
                            return (await import('./Collectors/Crash/RoleReset')).default(client, interaction, locale)
                        case 'crashOn':
                            return (await import('./Collectors/Crash/SystemOn')).default(client, interaction, locale)
                        case 'crashOff':
                            return (await import('./Collectors/Crash/SystemOff')).default(client, interaction, locale)
                        case 'leaveWhitelist':
                            return (await import('./Collectors/Crash/whitelist/LeaveWhitelist')).default(client, interaction, locale)
                        case 'addWhitelist':
                            return (await import('./Collectors/Crash/whitelist/ChooseAddWhitelist')).default(client, interaction, int, locale)
                        case 'removeWhitelist':
                            return (await import('./Collectors/Crash/whitelist/ChooseRemoveWhitelist')).default(client, interaction, int, locale)
                        case 'createChooseRoleGroup':
                            return (await import('./Collectors/Crash/role/ChooseCreateRoleGroup')).default(client, interaction, locale)
                        case 'leaveRoleGroup':
                            return (await import('./Collectors/Crash/role/LeaveChooseGroupEdit')).default(client, interaction, locale)
                        case 'backwardWhitelist':
                            return (await import('./Collectors/Crash/whitelist/BackwardWhitelist')).default(client, interaction, int, locale)
                        case 'leftWhitelist':
                            return (await import('./Collectors/Crash/whitelist/LeftWhitelist')).default(client, interaction, int, locale)
                        case 'rightWhitelist':
                            return (await import('./Collectors/Crash/whitelist/RightWhitelist')).default(client, interaction, int, locale)
                        case 'forwardWhitelist':
                            return (await import('./Collectors/Crash/whitelist/ForwardWhitelist')).default(client, interaction, int, locale)
                        case 'addWhitelistIdUser':
                        case 'removeWhitelistIdUser':
                            return (await import('./Collectors/Crash/whitelist/ChooseIdWhitelist')).default(client, interaction, int, locale)        
                        default:
                            switch(int.customId.split('.')[0]) {
                                case 'leaveEditRoleGroup':
                                    return (await import('./Collectors/Crash/role/EditRoleGroup')).default(client, interaction, int.customId.split('.')[1], locale)
                                case 'deleteGroup':
                                    return (await import('./Collectors/Crash/role/ChooseDeleteRole')).default(client, interaction, int, locale)
                                case 'agreeDeleteGroup':
                                    return (await import('./Collectors/Crash/role/AgreeDeleteGroup')).default(client, interaction, int, locale)
                                case 'autoSetting':
                                    return (await import('./Collectors/Crash/role/ChooseAutoSettingGroup')).default(client, interaction, int, locale)
                                case 'editStateGroup':
                                    return (await import('./Collectors/Crash/role/EditStateGroup')).default(client, interaction, int, locale)
                            }
                    }
                } else if(int.isStringSelectMenu()) {
                    switch(int.customId) {
                        case 'systemChoose':
                            return (await import('./Collectors/Main/SystemChoose')).default(client, interaction, int, locale)
                        case 'editRaidSystem':
                            return (await import('./Collectors/Raid/EditRaidSystem')).default(client, interaction, int, locale)
                         case 'editRaidPush':
                            return (await import('./Collectors/Raid/AccessEditPush')).default(client, interaction, int, locale)
                        case 'editCrashSystem':
                            return (await import('./Collectors/Crash/EditCrashSystem')).default(client, interaction, int, locale)
                        case 'chooseByEditRoleGroupMenu':
                            return (await import('./Collectors/Crash/role/EditRoleGroup')).default(client, interaction, int.values[0], locale)
                        default:
                            switch(int.customId.split('.')[0]) {
                                case 'editActionsGroup':
                                    return (await import('./Collectors/Crash/role/ChooseTypeMenu')).default(client, interaction, int, locale)
                                case 'chooseActionPushRoleEdit':
                                    return (await import('./Collectors/Crash/role/EditActionRoleGroup')).default(client, interaction, int, locale)
                                case 'chooseActionAutoSettings':
                                    return (await import('./Collectors/Crash/role/AutoSettingRoleGroup')).default(client, interaction, int, locale)
                            }
                    }
                } else if(int.isModalSubmit()) {
                    switch(int.customId) {
                        case 'modalMemberCount':
                            return (await import('./Collectors/Raid/EditMemberCount')).default(client, interaction, int, locale)
                        case 'modalTimeJoin':
                            return (await import('./Collectors/Raid/EditTimeJoin')).default(client, interaction, int, locale)
                        case 'modalWindowSetWarns':
                            return (await import('./Collectors/Crash/AccessEditWarns')).default(client, interaction, int, locale)
                        case 'addWhitelistIdUser':
                            return (await import('./Collectors/Crash/whitelist/AddIdWhitelist')).default(client, interaction, int, locale)                
                        case 'removeWhitelistIdUser':
                            return (await import('./Collectors/Crash/whitelist/RemoveIdWhitelist')).default(client, interaction, int, locale)                
                    }
                } else if(int.isChannelSelectMenu()) {
                    switch(int.customId) {
                        case 'editRaidChannelLog':
                            return (await import('./Collectors/Raid/AccessEditChannel')).default(client, interaction, int, locale)
                        case 'editCrashChannelLog':
                            return (await import('./Collectors/Crash/ChannelEdit')).default(client, interaction, int, locale)
                    }
                } else if(int.isUserSelectMenu()) {
                    switch(int.customId) {
                        case 'addWhielistUser':
                            return (await import('./Collectors/Crash/whitelist/AddWhitelist')).default(client, interaction, int, locale)
                        case 'removeWhielistUser':
                            return (await import('./Collectors/Crash/whitelist/RemoveWhitlist')).default(client, interaction, int, locale)
                    }
                } else if(int.isRoleSelectMenu()) {
                    switch(int.customId) {
                        case 'editCrashBanRole':
                            return (await import('./Collectors/Crash/RoleEdit')).default(client, interaction, int, locale)
                        case 'createRoleGroup':
                            return (await import('./Collectors/Crash/role/CreateRoleGroup')).default(client, interaction, int, locale)
                    }
                }
            },
            60_000,
            async (_, reason: string) => {
                if(reason !== 'time') return
                
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.db.guilds.getColor(interaction.guildId), client.services.lang.get("commands.antinuke.endTitle", locale), locale
                        )
                    ], components: []
                }).catch(() => {})
            }
        )
    }
)