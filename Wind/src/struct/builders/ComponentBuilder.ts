import { IAuditType, IAuditTypes } from "#db/audit/AuditSchema"
import { TPlaylist } from "#db/playlists/PlaylistSchema"
import { IGuild } from "#db/guild/GuildSchema"
import { ICrash } from "#db/crash/CrashSchema"
import { IRaid } from "#db/raid/RaidSchema"
import { Queue } from "../wind/WindPlayer"
import WindClient from "../WindClient"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    Guild,
    GuildMember,
    Locale,
    RoleSelectMenuBuilder,
    Snowflake,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder
} from "discord.js"

export default class ComponentBuilder {
    constructor(
        private client: WindClient
    ) {}

    private buttonSecondary(customId: string) {
        return new ButtonBuilder().setCustomId(customId).setStyle(ButtonStyle.Secondary)
    }

    private buttonPrimary(customId: string) {
        return new ButtonBuilder().setCustomId(customId).setStyle(ButtonStyle.Primary)
    }

    private buttonSuccess(customId: string) {
        return new ButtonBuilder().setCustomId(customId).setStyle(ButtonStyle.Success)
    }

    private buttonDanger(customId: string) {
        return new ButtonBuilder().setCustomId(customId).setStyle(ButtonStyle.Danger)
    }
    
    private buttonLink(url: string) {
        return new ButtonBuilder().setURL(url).setStyle(ButtonStyle.Link)
    }

    rowButtonLink(link: string, label: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonLink(link)
            .setLabel(label))
        ]
    }

    rowStringMenu(customId: string) {
        return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(customId)
        )
    }

    choose(endsWith: string = '', crossId: string = '') {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`agree${endsWith?endsWith:''}`)
                .setEmoji(this.client.emoji.main.agree),

                this.buttonSecondary(crossId !== '' ? crossId : `refuse${endsWith?endsWith:''}`)
                .setEmoji(this.client.emoji.main.refuse)
            )
        ]
    }

    chooseAntinukeSystem(locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('systemChoose')
                .setPlaceholder(this.client.services.lang.get("commands.antinuke.mainMenu.menu", locale))
                .addOptions(
                    {
                        label: this.client.services.lang.get("commands.antinuke.antiraid.antiraid", locale),
                        description: this.client.services.lang.get("commands.antinuke.mainMenu.fields.raid", locale),
                        value: 'anti-raid',
                        emoji: this.client.emoji.antinuke.zap
                    },
                    {
                        label: this.client.services.lang.get("commands.antinuke.anticrash.anticrash", locale),
                        description: this.client.services.lang.get("commands.antinuke.mainMenu.fields.crash", locale),
                        value: 'anti-crash',
                        emoji: this.client.emoji.antinuke.shield
                    }
                )
            )
        ]
    }

    paginator(array: any[], options: { page: number, count: number, trash?: boolean, extra?: boolean, endsWith?: string } = { page: 0, count: 10 }) {
        const row = new ActionRowBuilder<ButtonBuilder>()
        let rightIndex = 1

        if(options.extra) {
            rightIndex += 1
            row.addComponents(
                this.buttonSecondary('backward' + (options?.endsWith || ''))
                .setEmoji(this.client.emoji.main.backward)
            )
        }

        row.addComponents(
            this.buttonSecondary('left' + (options?.endsWith || ''))
            .setEmoji(this.client.emoji.main.left)
        )

        if(options.trash) {
            rightIndex += 1
            row.addComponents(
                this.buttonSecondary('trash' + (options?.endsWith || ''))
                .setEmoji(this.client.emoji.main.trash)
            )
        }

        row.addComponents(
            this.buttonSecondary('right' + (options?.endsWith || ''))
            .setEmoji(this.client.emoji.main.right)
        )

        if(options.extra) {
            row.addComponents(
                this.buttonSecondary('forward' + (options?.endsWith || ''))
                .setEmoji(this.client.emoji.main.forward)
            )
        }

        const max = this.client.util.getMaxPage(array, options.count)

        row.components[0].setDisabled(1 > options.page)
        if(options.extra) {
            row.components[1].setDisabled(1 > options.page)
        }

        row.components[rightIndex].setDisabled((options.page + 1) >= max || max === 1)
        if(options.extra) {
            row.components[rightIndex+1].setDisabled((options.page + 1) >= max || max === 1)
        }

        return [row]
    }

    info(locale: Locale) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonLink(this.client.config.links.invite)
                .setLabel(`${this.client.services.lang.get("buttons.invite", locale)}`)
                .setEmoji(this.client.emoji.info.url)
            )

            .addComponents(
                this.buttonLink(this.client.config.links.support)
                .setLabel(`${this.client.services.lang.get("buttons.help", locale)}`)
                .setEmoji(this.client.emoji.info.url)
            )
        ]
    }

    antiraidSetting(res: IRaid, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('editRaidSystem')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.change", locale)}`)
                .addOptions(
                    {
                        label: `${this.client.services.lang.get("selects.labels.visits", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.join_punishment", locale)}`,
                        value: 'memberCount'
                    },
                    {
                        label: `${this.client.services.lang.get("selects.labels.time", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.time_punishment", locale)}`,
                        value: 'timeJoin'
                    },
                    {
                        label: `${this.client.services.lang.get("selects.labels.punishment", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.punishment", locale)}`,
                        value: 'push'
                    },
                    {
                        label: `${this.client.services.lang.get("selects.labels.raid_audit", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.notification", locale)}`,
                        value: 'channel'
                    }
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('leaveChoose')
                .setLabel(`${this.client.services.lang.get("buttons.back_protection", locale)}`),

                (res.status?this.buttonSuccess:this.buttonDanger)(res.status?'raidOff':'raidOn')
                .setLabel(res.status?`${this.client.services.lang.get("main.module.off", locale)}`:`${this.client.services.lang.get("main.module.on", locale)}`)
            )
        ]
    }

    leaveCustom(locale: Locale, customId: string = 'leave', state: boolean = true, path: string = 'buttons.leave') {
        return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(state?ButtonStyle.Primary:ButtonStyle.Danger)
            .setCustomId(customId)
            .setLabel(this.client.services.lang.get(path, locale))
        )
    }

    settingRaidPush(res: IRaid, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('editRaidPush')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.apply", locale)}`)
                .addOptions(
                    {
                        label: `${this.client.services.lang.get("selects.labels.ban_punishment", locale)}`,
                        value: 'Ban',
                        default: res.push === 'Ban'
                    },
                    {
                        label: `${this.client.services.lang.get("selects.labels.kick_punishment", locale)}`,
                        value: 'Kick',
                        default: res.push === 'Kick'
                    }
                )
            ),
            this.leaveCustom(locale, 'leaveRaidSystem')
        ]
    }

    settingRaidChannel(res: IRaid, locale: Locale) {
        return [
            new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                .setCustomId('editRaidChannelLog')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.choose_channel", locale)}`)
                .setChannelTypes(ChannelType.GuildText)
            ),
            this.leaveCustom(locale, 'leaveRaidSystem')

            .addComponents(
                this.buttonDanger('resetRaidChannel')
                .setLabel(`${this.client.services.lang.get("buttons.reset_channel", locale)}`)
                .setDisabled(res.channelId === '0')
            )
        ]
    }

    anticrashSetting(res: ICrash, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('editCrashSystem')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.do", locale)}`)
                .addOptions(
                    {
                        label: `${this.client.services.lang.get("commands.antinuke.anticrash.groups", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.change", locale)}`,
                        value: 'actionGroup'
                    },
                    {
                        label: `${this.client.services.lang.get("commands.antinuke.anticrash.whitelist", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.add_remove", locale)}`,
                        value: 'whiteList'
                    },
                    {
                        label: `${this.client.services.lang.get("selects.labels.anticrash_audit", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.notification", locale)}`,
                        value: 'channel'
                    },
                    {
                        label: `${this.client.services.lang.get("selects.labels.ban_role", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.quarantine", locale)}`,
                        value: 'ban'
                    },
                    {
                        label: `Кол-во предупреждений`,
                        description: `После установленого количества будет выдаваться карантин!`,
                        value: 'warns'
                    }
                )
            ),
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('leaveChoose')
                .setLabel(`${this.client.services.lang.get("buttons.back_protection", locale)}`),

                (res.status?this.buttonSuccess:this.buttonDanger)(res.status?'crashOff':'crashOn')
                .setLabel(res.status?`${this.client.services.lang.get("main.module.off", locale)}`:`${this.client.services.lang.get("main.module.on", locale)}`)
            ),
        ]
    }

    settingCrashChannel(res: ICrash, locale: Locale) {
        return [
            new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                .setCustomId('editCrashChannelLog')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.choose_channel", locale)}`)
                .setChannelTypes(ChannelType.GuildText)
            ),
            this.leaveCustom(locale, 'leaveCrashSystem')

            .addComponents(
                this.buttonDanger('resetCrashChannel')
                .setLabel(`${this.client.services.lang.get("buttons.reset_channel", locale)}`)
                .setDisabled(res.channelId === '0')
            )
        ]
    }

    settingCrashBanRole(res: ICrash, locale: Locale) {
        return [
            new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(
                new RoleSelectMenuBuilder()
                .setCustomId('editCrashBanRole')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.choose_role", locale)}`)
            ),

            this.leaveCustom(locale, 'leaveCrashSystem')
            .addComponents(
                this.buttonDanger('resetBanRole')
                .setLabel(`${this.client.services.lang.get("buttons.reset_role", locale)}`)
                .setDisabled(res.banId === '0')
            )
        ]
    }

    chooseWhitelist(add: boolean = true, locale: Locale) {
        return [
            new ActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(
                new UserSelectMenuBuilder()
                .setCustomId(`${add?'add':'remove'}WhielistUser`)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_user", locale)}`)
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`${add?'add':'remove'}WhitelistIdUser`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(add ? 'Добавить по ID' : 'Убрать по ID'),
                this.leaveCustom(locale, 'leaveWhitelist').components[0]
            )
        ]
    }

    chooseWhitelistAction(array: Snowflake[], locale: Locale, page: number = 0) {
        return [
            ...this.paginator(array, { page, count: 15, extra: true, endsWith: 'Whitelist' }),
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('addWhitelist')
                .setStyle(ButtonStyle.Success)
                .setLabel(`${this.client.services.lang.get("buttons.add_whitelist", locale)}`),

                new ButtonBuilder()
                .setCustomId('removeWhitelist')
                .setStyle(ButtonStyle.Danger)
                .setLabel(`${this.client.services.lang.get("buttons.remove_whitelist", locale)}`)
            ),
            this.leaveCustom(locale, 'leaveCrashSystem')
        ]
    }

    chooseEditGroup(locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('editChooseGroup')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.change", locale)}`)
                .addOptions(
                    {
                        label: `${this.client.services.lang.get("selects.labels.role", locale)}`,
                        description: `${this.client.services.lang.get("selects.descriptions.affects_role", locale)}`,
                        value: 'role',
                        emoji: { name: `${this.client.emoji.antinuke.role}` }
                    }
                )
            ),
            this.leaveCustom(locale, 'leaveCrashSystem')
        ]
    }

    roleGroupEdit(guild: Guild, res: ICrash, locale: Locale) {
        const arrayRows: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = []


        const row1 = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('chooseByEditRoleGroupMenu')
            .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.change_group", locale)}`)
            .addOptions(
                res.groups.map((g) => {
                    const role = guild.roles.cache.get(g.roleId)
                    return { label: role ? role.name : g.roleId, value: g.roleId }
                })
            )
        )

        const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.buttonSuccess('createChooseRoleGroup')
            .setLabel(`${this.client.services.lang.get("selects.labels.create_group", locale)}`),

            this.leaveCustom(locale, 'leaveCrashSystem').components[0]
        )

        if(row1.components[0]?.options[0]) {
            arrayRows.push(row1)
        }

        arrayRows.push(row2)

        return arrayRows
    }

    userGroupEdit(res: ICrash, locale: Locale) {
        const arrayRows: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = []


        const row1 = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('chooseByEditUserGroupMenu')
            .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.change_group", locale)}`)
            .addOptions(
                res.groups.map((g) => {
                    return { label: g.name!, value: g.name!.split(' ').join('+++') }
                })
            )
        )

        const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.buttonSuccess('createChooseUserGroup')
            .setLabel(`${this.client.services.lang.get("selects.labels.create_group", locale)}`),

            this.leaveCustom(locale, 'leaveCrashSystem').components[0]
        )

        if(row1.components[0]?.options[0]) {
            arrayRows.push(row1)
        }

        arrayRows.push(row2)

        return arrayRows
    }

    chooseGroupRole(locale: Locale) {
        return [
            new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(
                new RoleSelectMenuBuilder()
                .setCustomId('createRoleGroup')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.change_role_group", locale)}`)
            ),
            this.leaveCustom(locale, 'leaveRoleGroup', false)
        ]
    }

    editGroupMenu(roleId: string, disabled: boolean, isEveryone: boolean, locale: Locale) {
        let array = []

        const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.leaveCustom(locale, `leaveRoleGroup`).components[0],

            this.buttonSecondary(`editStateGroup.${roleId}`)
            .setLabel(disabled ? `${this.client.services.lang.get("main.module.on", locale)}` : `${this.client.services.lang.get("main.module.off", locale)}`)
        )

        array.push(row1)

        if(!isEveryone) {
            array[0].addComponents(
                this.buttonDanger(`deleteGroup.${roleId}`)
                .setLabel(`${this.client.services.lang.get("selects.labels.delete_group", locale)}`)
            )
        } else {
            array[0].addComponents(
                this.buttonSuccess(`autoSetting.${roleId}`)
                .setLabel(`${this.client.services.lang.get("selects.labels.auto_settings", locale)}`)
                .setDisabled(disabled)
            )
        }

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`editActionsGroup.${roleId}`)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.change_action", locale)}`)
                .setDisabled(disabled)
                .addOptions(
                    this.client.services.constants.actionCrashTypes.map((t) => {
                        return { label: this.client.db.crashs.resolveCrashType(t as any, locale), value: t, emoji: this.client.emoji.antinuke[t as 'AddBot'] }
                    })
                )
            ),
            ...array
        ]
    }

    chooseActionPushRoleEdit(roleId: string, action: string, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseActionPushRoleEdit.${roleId}.${action}`)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_action", locale)}`)
                .addOptions(
                    [
                        'Kick', 'Ban', 'Warn', 'Lockdown', 'None'
                    ].map((str) => ({label: this.client.util.resolvePushType(str as any, locale), value: str}))
                )
            ),
            this.leaveCustom(locale, `leaveEditRoleGroup.${roleId}`, false)
        ]
    }

    chooseActionPushUserEdit(roleId: string, action: string, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseActionPushUserEdit.${roleId}.${action}`)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_action", locale)}`)
                .addOptions(
                    [
                        'Kick', 'Ban', 'Warn', 'Lockdown', 'None'
                    ].map((str) => ({label: this.client.util.resolvePushType(str as any, locale), value: str}))
                )
            ),
            this.leaveCustom(locale, `leaveEditUserGroup.${roleId}`, false)
        ]
    }

    chooseActionAutoSettings(roleId: string, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseActionAutoSettings.${roleId}`)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_action", locale)}`)
                .addOptions(
                    [
                        'Kick', 'Ban', 'Warn', 'Lockdown', 'None'
                    ].map((str) => ({label: this.client.util.resolvePushType(str as any, locale), value: str}))
                )
            ),
            this.leaveCustom(locale, `leaveEditRoleGroup.${roleId}`, false)
        ]
    }

    chooseUserGroup(name: string, locale: Locale, add: boolean = true) {
        return [
            new ActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(
                new UserSelectMenuBuilder()
                .setCustomId(`choose${add?'Add':'Del'}UserGroup.${name}`)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_user", locale)}`)
            ),
            this.leaveCustom(locale, `leaveEditUserGroup.${name}`, false)
        ]
    }

    removeLockdown(id: string, locale: Locale, disabled: boolean = false) {
        return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.buttonSuccess(`removeLockdown.${id}`)
            .setDisabled(disabled)
            .setLabel(disabled ? `${this.client.services.lang.get("buttons.return_role", locale)}` : `${this.client.services.lang.get("buttons.remove_quarantine", locale)}`)
        )
    }

    autoRoles(roles: any[], locale: Locale) {
        return [
            new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(
                new RoleSelectMenuBuilder()
                .setCustomId('setAutoRoles')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_role", locale)}`)
                .setMaxValues(10)
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonDanger('clear')
                .setLabel(`${this.client.services.lang.get("selects.labels.reset_roles", locale)}`)
                .setDisabled(roles.length === 0)
            )
        ]
    }

    gameRoles(doc: IGuild, locale: Locale) {
        return [
            new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(
                new RoleSelectMenuBuilder()
                .setCustomId('setGameRoles')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                (doc.gameEnabled ? this.buttonSuccess : this.buttonDanger)('state')
                .setLabel(doc.gameEnabled ? 'Выключить?' : 'Включить?'),

                this.buttonDanger('clear')
                .setLabel(`Сбросить роль`)
                .setDisabled(!doc.gameRolePosition)
            )
        ]
    }

    manageAudit(enabled: boolean, locale: Locale, page: number = 0) {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('chooseEditTypes')
            .setPlaceholder('Выберите тип аудита...')
        )
        for ( let i = page*10; (i < this.client.services.constants.auditTypes.length && i < 10*(page+1)) ; i++ ) {
            const type = this.client.services.constants.auditTypes[i] as IAuditType
            row.components[0].addOptions(
                { label: this.client.db.audits.resolveAuditType(type, locale), value: type }
            )
        }

        return [
            row, this.paginator(this.client.services.constants.auditTypes, { page, count: 10, trash: true, extra: false })[0]
            .addComponents(
                (enabled  ? this.buttonSuccess : this.buttonDanger)('state')
                .setLabel(enabled ? `${this.client.services.lang.get("main.module.off", locale)}` : `${this.client.services.lang.get("main.module.on", locale)}`)
            )
        ]
    }

    manageAuditType(config: IAuditTypes, locale: Locale) {
        return [
            new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                .setCustomId(`chooseEditChannel.${config.type}`)
                .setChannelTypes(ChannelType.GuildText)
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_channel", locale)}`)
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.leaveCustom(locale).components[0],
                (config.enabled ? this.buttonSuccess : this.buttonDanger)(`typeState.${config.type}`)
                .setLabel(config.enabled ? `${this.client.services.lang.get("main.module.off", locale)}` : `${this.client.services.lang.get("main.module.on", locale)}`)
            )
        ]
    }

    avatar(value: string, locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('avatar')
                .setPlaceholder(`${this.client.services.lang.get("selects.placeholders.select_avatar", locale)}`)
                .setOptions(
                    [
                        {
                            label: `${this.client.services.lang.get("commands.avatar.profile", locale)}`,
                            value: 'profile',
                            default: value === 'profile'
                        },
                        {
                            label: `${this.client.services.lang.get("commands.avatar.server", locale)}`,
                            value: 'guild',
                            default: value === 'guild'
                        },
                        {
                            label: `${this.client.services.lang.get("commands.avatar.banner", locale)}`,
                            value: 'banner',
                            default: value === 'banner'
                        }
                    ]
                )
            )
        ]
    }


    getMemoSelect() {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('supportMemo')
                .addOptions(
                    {
                        label: 'Условия использования',
                        value: 'terms'
                    },
                    {
                        label: 'Конфиденциальность',
                        value: 'privacy'
                    }
                )
            )
        ]
    }

    action(target: GuildMember, banId: string, res: IGuild, locale: Locale) {
        const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.buttonSecondary('ban')
            .setLabel('Забанить')
        )

        if(banId && target.guild.roles.cache.has(banId)) {
            row1.addComponents(
                this.buttonSecondary(target.roles.cache.has(banId) ? 'unlockdown' : 'lockown')
                .setLabel(target.roles.cache.has(banId) ? 'Снять каратин' : 'Выдать карантин')
            )
        }

        let muteState = false
        if(res.mutes.timeout.enabled) {
            if((target?.communicationDisabledUntilTimestamp ?? 0) > Date.now()) {
                muteState = true
            }
        }

        if(res.mutes.text.enabled && res.mutes.text?.roleId) {
            if(target.roles.cache.has(res.mutes.text?.roleId)) {
                muteState = true
            }
        }

        if(res.mutes.voice.enabled && res.mutes.voice?.roleId) {
            if(target.roles.cache.has(res.mutes.voice?.roleId)) {
                muteState = true
            }
        }

        if(res.mutes.general.enabled && res.mutes.general?.roleId) {
            if(target.roles.cache.has(res.mutes.general?.roleId)) {
                muteState = true
            }
        }

        return [
            row1.addComponents(
                this.buttonSecondary(muteState ? 'unmute' : 'mute')
                .setLabel(muteState ? 'Разглушить' : 'Заглушить')
            )
        ]
    }

    chooseMute(res: IGuild, locale: Locale) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSuccess('general.mute')
                .setLabel('Общий мут')
                .setDisabled(!res.mutes.timeout.enabled),

                this.buttonSuccess('text.mute')
                .setLabel('Текстовый мут')
                .setDisabled(!res.mutes.text.enabled),

                this.buttonSuccess('voice.mute')
                .setLabel('Голосовой мут')
                .setDisabled(!res.mutes.voice.enabled),

                this.buttonSuccess('timeout.mute')
                .setLabel('Таймаут')
                .setDisabled(!res.mutes.timeout.enabled)
            ),
            this.leaveCustom(locale)
        ]
    }

    settings(locale: Locale) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('settings')
                .addOptions(
                    {
                        label: 'Общий мут',
                        value: 'general.mute'
                    },

                    {
                        label: 'Текстовый мут',
                        value: 'text.mute'
                    },

                    {
                        label: 'Голосовой мут',
                        value: 'voice.mute'
                    },

                    {
                        label: 'Таймаут',
                        value: 'timeout.mute'
                    }
                )
            )
        ]
    }

    settingsMute(doc: IGuild, type: string, locale: Locale) {
        let settings: {
            enabled: boolean,
            roleId?: string
        } = {
            enabled: false,
            roleId: undefined
        }
        
        switch(type) {
            case 'general':
                settings = doc.mutes.general
                break
            case 'text':
                settings = doc.mutes.text
                break
            case 'voice':
                settings = doc.mutes.voice
                break
            case 'timeout':
                settings = doc.mutes.timeout
                break
        }

        let rows = []
        if(type !== 'timeout') {
            rows.push(
                new ActionRowBuilder<RoleSelectMenuBuilder>()
                .addComponents(
                    new RoleSelectMenuBuilder()
                    .setCustomId(`${type}.setRole`)
                )
            )
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.leaveCustom(locale, 'leave', true).components[0]

            /*(settings.enabled ? this.buttonSuccess : this.buttonDanger)(`${type}.state`)
            .setLabel(settings.enabled ? 'Выключить?' : 'Включить?')*/
        )

        if(type !== 'timeout') {
            row.addComponents(
                this.buttonSecondary(`${type}.removeRole`)
                .setLabel('Удалить роль')
                .setDisabled(!settings?.roleId)
            )
        }

        return [
            ...rows,
            row
        ]
    }

    settingsRoles(command: string, locale: Locale) {
        return [
            new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(
                new RoleSelectMenuBuilder()
                .setCustomId(`${command}.setRoles`)
                .setMaxValues(15)
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.leaveCustom(locale, 'leave', true).components[0],
                this.buttonDanger(`${command}.clear`)
                .setLabel('Сбросить')
            )
        ] 
    }

    player(queue: Queue) {
        const tracks = Object.values(queue.lastTracks)
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('backLastTrack')
                .setPlaceholder('К какому треку хотите вернуться?')
                .setOptions(
                    tracks.length === 0 ? [ { label: 'В очереди ещё не было треков...', value: 'none', default: true } ]
                    : tracks.reverse().filter(t => t?.info?.uri?.length && 100 > t.info.uri.length).map((t) => ({
                        label: t.info.title,
                        description: `Автор: ${t.info.author} | Заказывал: ${t.user.username}`,
                        value: t.info.uri! })
                    )
                )
                .setDisabled(tracks.length === 0)
            ),
            
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('shuffle')
                .setEmoji(this.client.emoji.music.shuffle),

                this.buttonSecondary('backTrack')
                .setEmoji(this.client.emoji.music.skip.backward),

                this.buttonSecondary('paused')
                .setEmoji(this.client.emoji.music[queue.player.paused ? 'pause' : 'play']),

                this.buttonSecondary('forwardTrack')
                .setEmoji(this.client.emoji.music.skip.forward),

                this.buttonSecondary('repeat')
                .setEmoji(this.client.emoji.music.repeat[queue.repeat === '' ? 'Empty' : queue.repeat])
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('manageSeek')
                .setEmoji(this.client.emoji.music.seek),

                this.buttonSecondary('manageVolume')
                .setEmoji(this.client.emoji.music.volume),

                this.buttonSecondary('disconnect')
                .setEmoji(this.client.emoji.music.disconnect),

                this.buttonSecondary('getTrackLyric')
                .setEmoji(this.client.emoji.music.lyric),

                this.buttonSecondary('likeTrack')
                .setEmoji(this.client.emoji.music.like)
            )
        ]
    }

    manageVolume() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('volumeMinus')
                .setEmoji(this.client.emoji.music.volumes.minus)
                .setLabel('Уменьшить на 10%'),

                this.buttonSecondary('volumePlus')
                .setEmoji(this.client.emoji.music.volumes.plus)
                .setLabel('Увеличить на 10%')
            )
        ]
    }

    manageSeek() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('seekBackward')
                .setEmoji(this.client.emoji.music.skip.backward)
                .setLabel('Назад на 10с'),

                this.buttonSecondary('seekForward')
                .setEmoji(this.client.emoji.music.skip.forward)
                .setLabel('Вперед на 10с')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonDanger('seekStart')
                .setEmoji(this.client.emoji.music.startSeek)
                .setLabel('Вернуться в начало трека')
            )
        ]
    }

    playlists(playlists: TPlaylist[], guild: Guild, create: boolean = false, heart: string | undefined = undefined) {
        const row1 = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(heart ? `addPlaylists[]${heart}` : 'playlists')
            .setPlaceholder('Выберите плейлист')
            .setOptions(
                playlists.map(p => {
                    const member = guild.members.cache.get(p.userId)
                    return {
                        label: `${p.name}`,
                        description: p.isLove ? (create ? 'Это Ваш личный плейлист!' : `Это любимые треки ${member?.user ? member.user.tag : p.userId}`) : `Автор: ${member?.user ? member.user.tag : p.userId}`,
                        value: `${p.code}`,
                        emoji: p.type === 'Private' ? this.client.emoji.music.playlists.lock : this.client.emoji.music.playlists.unlock
                    }
                })
            )
        )

        const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('createNewPlaylist')
            .setLabel('Создать новый плейлист')
            .setStyle(ButtonStyle.Primary)
        )

        return create ? [row1, row2] : [row1]
    }

    managePlaylist(playlist: TPlaylist, locale: Locale, love: string | undefined = undefined) {
        if(love && playlist.userId !== love) {
            return [
                new ActionRowBuilder<ButtonBuilder>()
                .addComponents(this.buttonSecondary(`infotracks.${playlist.code}`)
                .setLabel('Информация о треках'))

                .addComponents(this.buttonSecondary(`play.${playlist.code}`)
                .setLabel('Воспроизвести')),

                new ActionRowBuilder<ButtonBuilder>()
                .addComponents(this.buttonPrimary('leavetochoose')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Вернуться назад'))

                .addComponents(this.buttonSecondary(`loveplaylist.${playlist.code}`)
                .setLabel(playlist.likes.includes(love) ? 'Убрать из своего спика плейлистов' : 'Добавить в свой список плейлистов'))
            ]
        }

        const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.buttonSecondary(`setName.${playlist.code}`)
            .setLabel('Установить название')
        )

        .addComponents(
            this.buttonSecondary(`setImage.${playlist.code}`)
            .setLabel('Установить обложку')
        )
        
        const row2 = new ActionRowBuilder<ButtonBuilder>()

        if(!playlist.isLove) {
            row2.addComponents((playlist.type==='Private'?this.buttonDanger:this.buttonSuccess)(`edittype.${playlist.code}`)
            .setLabel(playlist.type==='Private'?'Сделать публичным?':'Сделать приватным?'))
        }

        row2.addComponents(
            this.buttonSecondary(`infotracks.${playlist.code}`)
            .setLabel('Информация о треках')
        )

        .addComponents(
            this.buttonSecondary(`play.${playlist.code}`)
            .setLabel('Воспроизвести')
        )

        const row3 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            this.buttonPrimary('leavetochoose')
            .setLabel('Вернуться назад')
        )

        if(!playlist.isLove) {
            row3.addComponents(
                this.buttonDanger(`delete.${playlist.code}`)
                .setStyle(ButtonStyle.Danger)
                .setLabel('Удалить плейлист')
            )
        }

        return playlist.isLove ? [row2, row3] : [row1, row2, row3]
    }

    selectRemoveTrack(playlist: TPlaylist, locale: Locale, page: number = 0) {
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(`selectTrackDelete.${playlist.code}`)
            .setPlaceholder('Выберите трек, чтобы его удалить...')
        )

        for ( let i = page*8; (i < playlist.tracks.length && i < 8*(page+1)); i++ ) {
            const track = playlist.tracks.filter(t => t?.uri?.length && 100 > t.uri.length)[i]
            row.components[0].addOptions(
                { label: `${track.title}`, value: track.uri }
            )
        }

        return row.components[0].options.length === 0 ? [] : [ row ]
    }

    leaveManagePlaylist(playlist: TPlaylist, locale: Locale) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary(`info.${playlist.code}`)
                .setLabel('Вернуть назад')
            )
        ]
    }
}