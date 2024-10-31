import { IModuleVoice, IModuleVoiceButton, IModuleVoiceButtonType } from '../../../db/module_voice/ModuleVoiceSchema';
import { IModuleBanner, IItemImage, IItemText } from '../../../db/module_banner/ModuleBannerSchema';
import { IModuleGroup, IModuleGroupButton } from '../../../db/module_group/ModuleGroupSchema';
import { IBoost } from '../../../db/boosts/BoostSchema';
import { IQueue } from '../../../db/queue/QueueSchema';
import { NiakoClient } from '../../client/NiakoClient';
import moment from 'moment-timezone';
import {
    ActionRowBuilder,
    ActivityType,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    Guild,
    GuildMember,
    Presence,
    Role,
    RoleSelectMenuBuilder,
    SelectMenuComponentOptionData,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder
} from 'discord.js';

export default class ComponentBuilder {
    constructor(
        private client: NiakoClient
    ) { }

    private buttonSecondary(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(customId)
    }

    private buttonSuccess(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId(customId)
    }

    private buttonPrimary(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(customId)
    }

    private buttonDanger(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(customId)
    }

    private buttonLink(url: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(url)
    }

    support() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonLink(this.client.config.meta.supportUrl)
                .setLabel('Поддержка')
                .setEmoji(this.client.config.emojis.link)
            )
        ]
    }

    rowSelectMenuUser(customId: string, placeholder?: string, disabled?: boolean) {
        return [
            new ActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(
                new UserSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder || 'Выберите пользователя...')
                .setDisabled(Boolean(disabled))
            )
        ]
    }

    rowSelectMenuChannel(customId: string, placeholder?: string, disabled?: boolean) {
        return [
            new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                .setCustomId(customId)
                .setPlaceholder(placeholder || 'Выберите канал...')
                .setDisabled(Boolean(disabled))
            )
        ]
    }

    rowButtonLink(link: string, label: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonLink(link)
                .setLabel(label)
            )
        ]
    }

    leave(customId: string, lang: string, danger: boolean = true) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    danger ? this.buttonDanger(customId)
                    .setLabel(this.client.lang.get('buttons.leave', lang))

                        : this.buttonPrimary(customId)
                        .setLabel(this.client.lang.get('buttons.leave', lang))
                )
        ]
    }

    leaveBack(customId: string, lang: string, styleState: boolean = true, primary: boolean = false) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder({ customId })
                    .setLabel(this.client.lang.get('buttons.leaveBack', lang))
                    .setStyle(primary ? ButtonStyle.Primary : (styleState ? ButtonStyle.Success : ButtonStyle.Danger))
                )
        ]
    }

    choose(endsWith: string = '', crossId: string = '') {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`agree${endsWith?endsWith:''}`)
                .setEmoji(this.client.config.emojis.agree),

                this.buttonSecondary(crossId !== '' ? crossId : `refuse${endsWith?endsWith:''}`)
                .setEmoji(this.client.config.emojis.refuse)
            )
        ]
    }

    premium(lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                [
                    { id: 'shop', emoji: this.client.config.emojis.premium.shop },
                    { id: 'manage', emoji: this.client.config.emojis.premium.manage },
                ].map((res, i) => this.buttonSecondary(res.id)
                .setDisabled(i === 0)
                .setLabel(this.client.lang.get(`buttons.${res.id}`, lang))
                .setEmoji(res.emoji))
            )

            .addComponents(
                this.buttonLink('https://niako.gitbook.io/documentation/premium/faq')
                .setLabel(this.client.lang.get(`buttons.shop`, lang))
                .setEmoji(this.client.config.emojis.premium.info)
            )
        ]
    }

    shop(lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonSecondary('buyStar')
                    .setLabel(this.client.lang.get('buttons.buyStar', lang))
                    .setEmoji(this.client.config.emojis.premium.boost),
                ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.leave('leave', lang)[0].components[0],
                    
                    this.buttonSecondary('topUpBalance')
                    .setLabel(this.client.lang.get('buttons.topUpBalance', lang))
                    .setEmoji(this.client.config.emojis.premium.ruble),

                    this.buttonSecondary('transactions')
                    .setLabel(this.client.lang.get('buttons.transactions', lang))
                    .setEmoji(this.client.config.emojis.premium.transactions)
                )
        ]
    }

    operation(count: number, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('operationSelection')
                        .setPlaceholder(this.client.lang.get('menus.operation.placeholder', lang))
                        .addOptions(
                            {
                                label: 'Qiwi',
                                value: `qiwi.${count}`,
                                description: this.client.lang.get('menus.operation.qiwi', lang),
                                emoji: this.client.config.emojis.premium.operation.qiwi
                            }
                        )
                ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonDanger('shop')
                    .setLabel(this.client.lang.get('buttons.leave', lang)),
                )
        ]
    }

    payQiwi(url: string, userId: string, lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonLink(url)
                    .setLabel(this.client.lang.get('buttons.goToThePayment', lang)),

                    this.buttonSecondary(`checkQiwiPaid.${userId}`)
                    .setLabel(this.client.lang.get('buttons.checkPaid', lang)),

                    this.buttonSecondary(`cancelQiwiPaid.${userId}`)
                    .setLabel(this.client.lang.get('buttons.cancelPaid', lang)),
                )
        ]
    }

    buy(count: number, cost: number, has: boolean, lang: string) {
        if (has) {
            return [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.leave('shop', lang)[0].components[0],
                        this.buttonSecondary(`accessBuyStar.${count}`)
                        .setEmoji(this.client.config.emojis.premium.boost)
                        .setLabel(this.client.lang.get('buttons.accessBuyStar', lang, { count, cost }))
                    )
            ]
        } else {
            return this.leave('shop', lang)
        }
    }

    paginator(array: any[], lang: string, page: number = 0, maxCount: number = 10, leave: boolean = false, trash: boolean = false, premium: boolean = false, customIdLeave?: string, endWith?: string) {
        let leftIndex: number = 0, rightIndex: number = 1
        const row = new ActionRowBuilder<ButtonBuilder>()

        if (leave) {
            leftIndex = 1
            rightIndex = 2
            row.addComponents(
                this.leave(customIdLeave ? customIdLeave : 'leave', lang, premium)[0].components[0]
            )
        }

        row.addComponents(
            this.buttonSecondary(`left${endWith ? `.${endWith}` : ''}`)
            .setEmoji(premium ? this.client.config.emojis.premium.left : this.client.config.emojis.left)
        )

        if (trash) {
            rightIndex = 3
            row.addComponents(
                this.buttonSecondary('trash')
                .setEmoji(premium ? this.client.config.emojis.premium.trash : this.client.config.emojis.trash)
            )
        }

        row.addComponents(
            this.buttonSecondary(`right${endWith ? `.${endWith}` : ''}`)
            .setEmoji(premium ? this.client.config.emojis.premium.right : this.client.config.emojis.right)
        )

        const max = Math.ceil(array.length / maxCount) === 0 ? 1 : Math.ceil(array.length / maxCount)

        if ((page + 1) >= max || max === 1) {
            row.components[rightIndex].setDisabled(true)
        } else {
            row.components[rightIndex].setDisabled(false)
        }

        if (1 > page) {
            row.components[leftIndex].setDisabled(true)
        } else {
            row.components[leftIndex].setDisabled(false)
        }

        return [row]
    }

    async manageBoost(boosts: IBoost[], lang: string) {
        let array: SelectMenuComponentOptionData[] = []
        for (const boost of boosts) {
            if (boost.boosted) {
                const guild = await this.client.util.getGuild(boost.guildId)
                array.push(
                    {
                        label: `${guild ? guild.name : this.client.lang.get(`system.unknownGuild`, lang)}`,
                        value: String(boost._id),
                        description: this.client.lang.get(`menus.chooseInfoBoosts.options.haveServer.description`, lang, { documentBoost: boost })
                    }
                )
            } else if (!boost.guildId || boost.guildId === '0') {
                array.push(
                    {
                        label: `Не используется`,
                        value: String(boost._id),
                        description: `Звёзды не сохраняются`
                    }
                )
            }
        }
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('infoBoost')
                        .setPlaceholder(array.length > 0 ? this.client.lang.get('menus.chooseInfoBoosts.placeholders.have', lang) : this.client.lang.get('menus.chooseInfoBoosts.placeholders.not', lang))
                        .setDisabled(!Boolean(array.length > 0))
                        .addOptions(array.length > 0 ? array.length > 25 ? array.slice(0, 25) : array : [{ label: 'хз', value: 'xui' }])
                ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.leave('leave', lang)[0].components[0],

                    this.buttonSecondary('giveBoost')
                    .setLabel(this.client.lang.get('buttons.giveBoost', lang))
                    .setEmoji(this.client.config.emojis.premium.giveBoost)
                    .setDisabled(!Boolean(array.length > 0)),

                    this.buttonSecondary('removeBoost')
                    .setLabel(this.client.lang.get('buttons.removeBoost', lang))
                    .setEmoji(this.client.config.emojis.premium.removeBoost)
                    .setDisabled(!Boolean(array.length > 0)),
                )
        ]
    }

    extendBoost(value: string, active: boolean, boosted: boolean, lang: string) {
        if (active) {
            return [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.buttonSecondary(`extendBoost.${value}`)
                        .setLabel(this.client.lang.get('buttons.extendBoost', lang))
                        .setEmoji(this.client.config.emojis.premium.calendar)
                    ),

                this.leave('manage', lang)[0]
                    .addComponents(
                        this.buttonSecondary(`removeBoost.${value}`)
                        .setLabel(this.client.lang.get('buttons.removeBoost', lang))
                        .setEmoji(this.client.config.emojis.premium.removeBoost)
                        .setDisabled(!boosted)
                    )
            ]
        } else {
            return this.leave('manage', lang)
        }
    }

    serverBoostedMenu(removed: boolean, lang: string) {
        return [
            this.leave('manage', lang)[0]
                .addComponents(
                    this.buttonSecondary(removed ? 'removeBoostServer' : 'giveBoostServer')
                    .setLabel(removed ? 'С этого сервера' : 'На этот сервер'),

                    this.buttonSecondary(removed ? 'removeBoostServerInput' : 'giveBoostServerInput')
                    .setLabel('Ввести ID сервера')
                )
        ]
    }

    banner(doc: IModuleBanner, lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonSecondary(doc.state ? 'off' : 'on')
                    .setLabel(doc.state ? 'Включено' : 'Выключено')
                    .setEmoji(doc.state ? this.client.config.emojis.on : this.client.config.emojis.off),

                    this.buttonSecondary('manage')
                    .setLabel('Настройка баннера')
                    .setEmoji(this.client.config.emojis.setting),

                    this.buttonLink('https://niako.xyz/')
                    .setLabel('Информация')
                    .setEmoji(this.client.config.emojis.info)
                )
        ]
    }

    manageBanner(member: GuildMember, doc: IModuleBanner, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('manageText')
                    .setPlaceholder('Управление текстами')
                    .addOptions(
                        { label: 'Добавить текст', value: 'addText' },
                        ...(doc.items.filter((i) => i.type === 'Text') as IItemText[]).map((t) => {
                            return {
                                label: t.textType === 'Default' ? t.text : (this.client.constants.get(t.textType, lang) || 'unknown'),
                                value: `${t.textType}.${t.createdTimestamp}`,
                                emoji: t.disabled ? this.client.config.emojis.disabled.true : this.client.config.emojis.disabled.false
                            }
                        })
                    )
            ),

            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('manageImage')
                    .setPlaceholder('Управление изображениями')
                    .addOptions(
                        { label: 'Добавить изображение', value: 'addImage' },
                        ...(doc.items.filter((i) => ['Image', 'ActiveMemberAvatar'].includes(i.type)) as IItemImage[]).map((i) => {
                            return {
                                label: i.name,
                                value: `${i.type}.${i.createdTimestamp}`,
                                emoji: i.disabled ? this.client.config.emojis.disabled.true : this.client.config.emojis.disabled.false
                            }
                        })
                    )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('setDefaultStatus')
                .setLabel('Статус по умолчанию')
                .setEmoji(this.client.config.emojis.write),

                this.buttonSecondary('setBannerTimezone')
                .setLabel('Установить тайм-зону')
                .setEmoji(this.client.config.emojis.alarm)
            ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonSecondary('setBackground')
                    .setLabel('Установить фон')
                    .setEmoji(this.client.config.emojis.image),

                    this.buttonSecondary('backups')
                    .setLabel('Система сохранений')
                    .setEmoji(this.client.config.emojis.backup),
                ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonSecondary('setActiveType')
                    .setLabel('Изменить тип активного участника'),

                    this.buttonLink('https://niako.xyz/dashboard')
                    .setLabel('Дашбоард')
                )
        ]
    }

    chooseAddTextType(lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('addText')
                    .setPlaceholder('Выбрать текст...')
                    .addOptions(
                        this.client.constants.textTypeArray.map((type) => {
                            return {
                                label: this.client.constants.get(type, lang) || 'unknown',
                                value: type,
                                emoji: (this.client.config.emojis.textType as any)[type] || this.client.config.emojis.unknown
                            }
                        })
                    )
                ),

            this.leaveBack('manage', lang, false)[0]
        ]
    }

    chooseAddImageType(lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('addImage')
                    .setPlaceholder('Выбрать изображение...')
                    .addOptions(
                        {
                            label: 'Изображение по ссылке',
                            value: 'Image',
                            emoji: this.client.config.emojis.textType['Image']
                        },
                        {
                            label: 'Аватарка самого активного',
                            value: 'ActiveMemberAvatar',
                            emoji: this.client.config.emojis.textType['ActiveMemberAvatar']
                        }
                    )
                ),

            this.leaveBack('manage', lang, false)[0]
        ]
    }

    manageText(text: IItemText, lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonSecondary(`setTextFont.${text.textType}.${text.createdTimestamp}`)
                    .setLabel('Шрифт'),

                    this.buttonSecondary(`setTextSize.${text.textType}.${text.createdTimestamp}`)
                    .setLabel('Размер'),

                    this.buttonSecondary(`setTextColor.${text.textType}.${text.createdTimestamp}`)
                    .setLabel('Цвет'),

                    this.buttonSecondary(`setTextAngle.${text.textType}.${text.createdTimestamp}`)
                    .setLabel('Угол'),

                    this.buttonSecondary(`setTextCoordinate.${text.textType}.${text.createdTimestamp}`)
                    .setLabel('Координаты')
                ),

            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    text.textType === 'Time' ?
                    [
                        this.buttonSecondary(`editText.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Изменить'),

                        this.buttonSecondary(`setTextAlignAndBaseline.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Выравнивание'),

                        this.buttonSecondary(`setTextWidth.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Ширина'),

                        this.buttonSecondary(`setTextTimezone.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Таймзона')
                    ]
                    :
                    [
                        this.buttonSecondary(`editText.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Изменить'),

                        this.buttonSecondary(`setTextAlignAndBaseline.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Выравнивание'),

                        this.buttonSecondary(`setTextWidth.${text.textType}.${text.createdTimestamp}`)
                        .setLabel('Ширина')
                    ]
                ),

            this.leaveBack('manage', lang, true, true)[0]

                .addComponents(
                    this.buttonSecondary(`setTextDisable.${text.textType}.${text.createdTimestamp}`)
                    .setLabel(text.disabled ? 'Раскрыть' : 'Скрыть'),

                    this.buttonSecondary(`deleteText.${text.textType}.${text.createdTimestamp}`)
                    .setLabel('Удалить')
                )
        ]
    }

    manageImage(image: IItemImage, lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`setImageProportions.${image.type}.${image.createdTimestamp}`)
                .setLabel('Размеры'),

                this.buttonSecondary(`setImageShape.${image.type}.${image.createdTimestamp}`)
                .setLabel(image.shape ? 'Раскруглить' : 'Закруглить'),

                this.buttonSecondary(`setImageIndex.${image.type}.${image.createdTimestamp}`)
                .setLabel('Повысить индекс'),

                this.buttonSecondary(`setImageCoordinate.${image.type}.${image.createdTimestamp}`)
                .setLabel('Координаты')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                image.type === 'Image' ?
                [
                    this.buttonSecondary(`setImageUrl.${image.type}.${image.createdTimestamp}`)
                    .setLabel('Изменить ссылку'),

                    this.buttonSecondary(`setImageName.${image.type}.${image.createdTimestamp}`)
                    .setLabel('Изменить название')
                ] : [
                    this.buttonSecondary(`setImageName.${image.type}.${image.createdTimestamp}`)
                    .setLabel('Изменить название')
                ]
            ),

            this.leaveBack('manage', lang, true, true)[0]

                .addComponents(
                    this.buttonSecondary(`setImageDisable.${image.type}.${image.createdTimestamp}`)
                    .setLabel(image.disabled ? 'Раскрыть' : 'Скрыть'),

                    this.buttonSecondary(`deleteImage.${image.type}.${image.createdTimestamp}`)
                    .setLabel('Удалить')
                )
        ]
    }

    setBannerBackground(lang: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('disableOne')
                .setLabel('Boost Паки:')
                .setDisabled(true),

                this.buttonSecondary('boostpack.LitePack')
                .setLabel('Lite'),

                this.buttonSecondary('boostpack.AvenuePack')
                .setLabel('Avenue')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('disableTwo')
                .setLabel('Free Паки:')
                .setDisabled(true),

                this.buttonSecondary('pack.TechnologiePack')
                .setLabel('Technologie'),

                this.buttonSecondary('pack.SpacePack')
                .setLabel('Space')
            ),

            this.leaveBack('manage', lang, true, true)[0]

            .addComponents(
                this.buttonSecondary('setAnyBackground')
                .setLabel('Установить свой фон')
                .setEmoji(this.client.config.emojis.image),

                this.buttonSecondary('setAlarmBackground')
                .setLabel('Часовой фон')
                .setEmoji(this.client.config.emojis.alarm)
            )
        ]
    }

    choosePackStyle(pack: string, styles: string[], lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`setPackStyle.${pack}`)
                .setPlaceholder('Выберите один из понравившихся стилей...')
                .addOptions(
                    styles.map((style) => ({ label: style, value: style, emoji: (this.client.config.emojis.styles as { [key: string]: string })[style]}))
                )
            ),

            this.leaveBack('leaveToBackgrounds', lang, false)[0]

            .addComponents(
                this.buttonSecondary('setAnyBackground')
                .setLabel('Установить свой фон')
                .setEmoji(this.client.config.emojis.image),
            )
        ]
    }

    chooseAlarmSetBackground(doc: IModuleBanner, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('setAlarmBackgrounds')
                .setPlaceholder('Выберите время...')
                .setMaxValues(24)
                .addOptions(
                    new Array(24).fill(null).map((a, i) => {
                        const time = `${i > 9 ? i : `0${i}`}:00`
                        return {
                            label: time,
                            value: time,
                            description: (doc.backgrounds[time] ? 'Фон уже установлен' : 'Фон не установлен')
                        }
                    })
                )
            ),

            this.leaveBack('leaveToBackgrounds', lang, false)[0]
        ]
    }

    chooseTextFont(text: IItemText, lang: string) {
        const rows = []

        const fonts = this.client.canvas.fonts.array()
        const count = Math.trunc(fonts.length / 25)
        for( let i = 0; count >= i; i++ ) {
            rows.push(
                new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId(`chooseTextFont.${text.textType}.${text.createdTimestamp}.${i}`)
                    .setPlaceholder('Выберите один из шрифтов...')
                    .addOptions(
                        this.client.canvas.fonts.array().filter((v, index) => (i+1)*24 > index && index >= (i)*24).map((font) => ({ label: font, value: font, default: font === text.font}))
                    )
                )
            )
        }

        rows.push(this.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, false)[0])

        return rows
    }

    chooseTimezone(text: IItemText, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseTimezone.${text.textType}.${text.createdTimestamp}`)
                .setPlaceholder('Выберите одну из таймзон...')
                .addOptions(
                    {
                        label: 'GMT+0',
                        value: 'GMT-0',
                        default: 'GMT-0' === text.timezone
                    },
                    {
                        label: 'GMT+1',
                        value: 'GMT-1',
                        default: 'GMT-1' === text.timezone
                    },
                    {
                        label: 'GMT+2',
                        value: 'GMT-2',
                        default: 'GMT-2' === text.timezone
                    },
                    {
                        label: 'GMT+3',
                        value: 'GMT-3',
                        default: 'GMT-3' === text.timezone
                    },
                    {
                        label: 'GMT+4',
                        value: 'GMT-4',
                        default: 'GMT-4' === text.timezone
                    },
                    {
                        label: 'GMT+5',
                        value: 'GMT-5',
                        default: 'GMT-5' === text.timezone
                    },
                    {
                        label: 'GMT+6',
                        value: 'GMT-6',
                        default: 'GMT-6' === text.timezone
                    },
                    {
                        label: 'GMT+7',
                        value: 'GMT-7',
                        default: 'GMT-7' === text.timezone
                    },
                    {
                        label: 'GMT+8',
                        value: 'GMT-8',
                        default: 'GMT-8' === text.timezone
                    },
                    { 
                        label: 'GMT+9',
                        value: 'GMT-9',
                        default: 'GMT-9' === text.timezone
                    }
                )
            ),

            this.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, true, false)[0]
        ]
    }

    chooseTextAlignAndBaseline(text: IItemText, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseTextAlign.${text.textType}.${text.createdTimestamp}`)
                .setPlaceholder('Выберите выравнивание по x...')
                .addOptions(
                    {
                        label: 'По левому краю',
                        value: 'left',
                        default: text.align === 'left'
                    },
                    {
                        label: 'По центру',
                        value: 'center',
                        default: text.align === 'center'
                    },
                    {
                        label: 'По правому краю',
                        value: 'right',
                        default: text.align === 'right'
                    }
                )
            ),

            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseTextBaseline.${text.textType}.${text.createdTimestamp}`)
                .setPlaceholder('Выберите выравнивание по y...')
                .addOptions(
                    {
                        label: 'По верху',
                        value: 'top',
                        default: text.baseline === 'top'
                    },
                    {
                        label: 'По центральной части',
                        value: 'middle',
                        default: text.baseline === 'middle'
                    },
                    {
                        label: 'По низу',
                        value: 'bottom',
                        default: text.baseline === 'bottom'
                    }
                )
            ),

            this.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, false)[0]
        ]
    }

    chooseEditText(text: IItemText, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`editText.${text.textType}.${text.createdTimestamp}`)
                    .setPlaceholder('Выбрать новый текст...')
                    .addOptions(
                        this.client.constants.textTypeArray.map((type) => {
                            return {
                                label: this.client.constants.get(type, lang) || 'unknown',
                                value: type,
                                default: text.textType === type,
                                emoji: (this.client.config.emojis.textType as any)[type] || this.client.config.emojis.unknown
                            }
                        })
                    )
            ),

            this.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, false)[0]
        ]
    }

    chooseSetBannerType(type: string, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`setBannerType`)
                .setPlaceholder('Выберите, какой тип использовать...')
                .addOptions(
                    {
                        label: 'Обычное качество (960x540)',
                        value: 'Normal',
                        default: 'Normal' === type
                    },
                    {
                        label: 'Сжатое качество (540x300)',
                        value: 'Compressed',
                        default: 'Compressed' === type
                    }
                )
            ),

            this.leaveBack('manage', lang, true, true)[0]
        ]
    }

    chooseSetActiveType(type: string, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseSetActiveType`)
                .setPlaceholder('Выберите, какой тип использовать...')
                .addOptions(
                    {
                        label: 'Онлайн',
                        description: 'Голосовая активность в каналах',
                        value: 'Online',
                        default: 'Online' === type
                    },
                    {
                        label: 'Сообщения',
                        description: 'Текстовая активность в каналах',
                        value: 'Message',
                        default: 'Message' === type
                    }
                )
            ),

            this.leaveBack('manage', lang, true, true)[0]
        ]
    }

    chooseBannerTimezone(guildTimezone: string, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseBannerTimezone`)
                .setPlaceholder('Выберите одну из таймзон...')
                .addOptions(
                    {
                        label: 'GMT+0',
                        value: 'GMT-0',
                        default: 'GMT-0' === guildTimezone
                    },
                    {
                        label: 'GMT+1',
                        value: 'GMT-1',
                        default: 'GMT-1' === guildTimezone
                    },
                    {
                        label: 'GMT+2',
                        value: 'GMT-2',
                        default: 'GMT-2' === guildTimezone
                    },
                    {
                        label: 'GMT+3',
                        value: 'GMT-3',
                        default: 'GMT-3' === guildTimezone
                    },
                    {
                        label: 'GMT+4',
                        value: 'GMT-4',
                        default: 'GMT-4' === guildTimezone
                    },
                    {
                        label: 'GMT+5',
                        value: 'GMT-5',
                        default: 'GMT-5' === guildTimezone
                    },
                    {
                        label: 'GMT+6',
                        value: 'GMT-6',
                        default: 'GMT-6' === guildTimezone
                    },
                    {
                        label: 'GMT+7',
                        value: 'GMT-7',
                        default: 'GMT-7' === guildTimezone
                    },
                    {
                        label: 'GMT+8',
                        value: 'GMT-8',
                        default: 'GMT-8' === guildTimezone
                    },
                    {
                        label: 'GMT+9',
                        value: 'GMT-9',
                        default: 'GMT-9' === guildTimezone
                    }
                )
            ),

            this.leaveBack('manage', lang, true, true)[0]
        ]
    }

    chooseBannerAndActiveUpdate(bannerUpdate: string, activeUpdate: string, lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseBannerUpdate`)
                .setPlaceholder('Обновление баннера...')
                .addOptions(
                    {
                        label: 'Обновлять каждую минуту',
                        value: '1m',
                        default: bannerUpdate === '1m'
                    },
                    {
                        label: 'Обновлять каждые 2 минуты',
                        value: '2m',
                        default: bannerUpdate === '2m'
                    },
                    {
                        label: 'Обновлять кажждые 3 минуты',
                        value: '3m',
                        default: bannerUpdate === '3m'
                    },
                    {
                        label: 'Обновлять кажждые 4 минуты',
                        value: '4m',
                        default: bannerUpdate === '4m'
                    },
                    {
                        label: 'Обновлять кажждые 5 минут',
                        value: '5m',
                        default: bannerUpdate === '5m'
                    }
                )
            ),

            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`chooseActiveUpdate`)
                .setPlaceholder('Обновление самого активного...')
                .addOptions(
                    {
                        label: 'Обновлять каждые 10 минут',
                        value: '10m',
                        default: activeUpdate === '10m'
                    },
                    {
                        label: 'Обновлять каждые 15 минут',
                        value: '15m',
                        default: activeUpdate === '15m'
                    },
                    {
                        label: 'Обновлять каждые 30 минут',
                        value: '30m',
                        default: activeUpdate === '30m'
                    },
                    {
                        label: 'Обновлять каждый час',
                        value: '1h',
                        default: activeUpdate === '1h'
                    },
                    {
                        label: 'Обновлять каждые 2 часа',
                        value: '2h',
                        default: activeUpdate === '2h'
                    },
                    {
                        label: 'Обновлять каждые 3 часа',
                        value: '3h',
                        default: activeUpdate === '3h'
                    },
                    {
                        label: 'Обновлять каждые 4 часа',
                        value: '4h',
                        default: activeUpdate === '4h'
                    },
                    {
                        label: 'Обновлять каждые 5 часов',
                        value: '5h',
                        default: activeUpdate === '5h'
                    },
                    {
                        label: 'Обновлять каждые 6 часов',
                        value: '6h',
                        default: activeUpdate === '6h'
                    },
                    {
                        label: 'Обновлять каждые 12 часов',
                        value: '12h',
                        default: activeUpdate === '12h'
                    },
                    {
                        label: 'Обновлять каждый день',
                        value: '1d',
                        default: activeUpdate === '1d'
                    }
                )
            ),

            this.leaveBack('manage', lang, true, true)[0]
        ]
    }

    async chooseBackupAction(member: GuildMember, lang: string) {
        const array = await this.client.db.backups.getMemberBackups(member)

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('editBannerBackup')
                .setPlaceholder('Выберите, какой бэкап хотите редактировать...')
                .setDisabled(array.length === 0)
                .addOptions(
                    array.length === 0 ? [{ label: '?', value: '?' }] :
                    await Promise.all([
                        ...array.sort((a, b) => a.createdTimestamp - b.createdTimestamp).map(async (b) => {
                            const date = moment(b.createdTimestamp).tz('Europe/Moscow').locale('ru-RU').format(' DD.MM.YYYY в HH:mm')
                            let username = ''
                            
                            if(b.createrId !== member.id) {
                                const creater = await this.client.util.getMember(member.guild, b.createrId)
                                if(creater) {
                                    username = creater.user.username
                                } else username = '0'
                            }

                            return {
                                label: `${b.name} (${b.type === 'User' ? 'Пользовательский' : 'Серверный'})`,
                                value: String(b._id),
                                description: `Создан ${date}・Автор: ${username === '' ? member.user.username : username === '0' ? 'unknown' : username}`
                            }
                        })
                    ])
                )
            ),
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.leaveBack('manage', lang, false)[0].components[0],

                this.buttonSecondary('backupUpload')
                .setLabel('Создать новый бэкап')
                .setEmoji(this.client.config.emojis.backupUpload)
                .setDisabled(array.length >= 10)
            )
        ]
    }

    chooseBackupType(lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('chooseBackupType')
                .setPlaceholder('Выберите нужный Вам тип...')
                .addOptions(
                    {
                        label: 'Сервере',
                        value: 'Guild',
                        description: 'Отображаться будет только на этом сервере'
                    },
                    {
                        label: 'Пользователь',
                        value: 'User',
                        description: 'Отображаться будет только для Вас'
                    }
                )
            ),

            this.leaveBack('manage', lang, false)[0]
        ]
    }

    manageBackup(_id: string, lang: string) {
        return [
            this.leave('backups', lang, false)[0]
            .addComponents(
                this.buttonSecondary(`backupLoad.${_id}`)
                .setLabel('Загрузить на сервер')
                .setEmoji(this.client.config.emojis.backupLoad),

                this.buttonSecondary(`deleteBackup.${_id}`)
                .setLabel('Удалить навсегда')
                .setEmoji(this.client.config.emojis.trash)
            )
        ]
    }

    presenceButtons(presence: Presence | null) {
        if (!presence) return []

        const activities = (presence.activities || []).filter((a) => a.type !== ActivityType.Custom)
        if (activities.length === 0) return []

        const length = activities.length > 5 ? 5 : activities.length
        const row = new ActionRowBuilder<ButtonBuilder>()

        for (let i = 0; length > i; i++) {
            const activitie = activities[i]
            const cfg = this.client.config.activities.find((a) => a.name === activitie.name)
            if (cfg) {
                row.addComponents(
                    this.buttonLink(cfg.link)
                    .setLabel(cfg.name)
                    .setEmoji(cfg.emoji)
                )
            } else {
                row.addComponents(
                    this.buttonSecondary(`game.${i}`)
                    .setLabel(activitie.name)
                    .setDisabled(true)
                )
            }
        }

        return [row]
    }

    chooseTypeAvatar(type: 'profile' | 'server' | 'banner') {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('chooseTypeAvatar')
                .setPlaceholder('Выберите, какой аватар посмотреть...')
                .addOptions(
                    {
                        label: 'Профильный аватар',
                        description: 'Аватар, который отображается на всех серверах по умолчанию',
                        value: 'profile',
                        emoji: this.client.config.emojis.image,
                        default: type === 'profile'
                    },
                    {
                        label: 'Серверный аватар',
                        description: 'Аватар, который отображается только на этом сервере',
                        value: 'server',
                        emoji: this.client.config.emojis.image,
                        default: type === 'server'
                    },
                    {
                        label: 'Баннер в профиле',
                        description: 'Баннер, который отображается в профиле',
                        value: 'banner',
                        emoji: this.client.config.emojis.image,
                        default: type === 'banner'
                    }
                )
            )
        ]
    }

    botLinks() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    this.buttonLink(`https://discord.com/api/oauth2/authorize?client_id=${this.client.user!.id}&permissions=8&scope=bot%20applications.commands`)
                    .setLabel('Пригласить')
                    .setEmoji(this.client.config.emojis.link),

                    this.buttonLink(this.client.config.meta.supportUrl)
                    .setLabel('Поддержка')
                    .setEmoji(this.client.config.emojis.link),

                    this.buttonLink('https://niako.xyz/')
                    .setLabel('Вебсайт')
                    .setEmoji(this.client.config.emojis.link)
                )
        ]
    }

    developmentPanel() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('devPanel.AddBalance')
                .setEmoji(this.client.config.emojis.panel.addBalance),

                this.buttonSecondary('devPanel.RemoveBalance')
                .setEmoji(this.client.config.emojis.panel.removeBalance),

                this.buttonSecondary('devPanel.AddStar')
                .setEmoji(this.client.config.emojis.panel.addStar),

                this.buttonSecondary('devPanel.RemoveStar')
                .setEmoji(this.client.config.emojis.panel.removeStar),

                this.buttonSecondary('devPanel.ManageBadges')
                .setEmoji(this.client.config.emojis.panel.badges)
            )
        ]
    }

    chooseBadgeType() {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('devPanelSelectBadgeType.ManageBadges')
                .setPlaceholder('Выберите категорию...')
                .addOptions(
                    {
                        label: 'Серверный значок',
                        value: 'Guild'
                    },
                    {
                        label: 'Пользовательский значок',
                        value: 'User'
                    }
                )
            )
        ]
    }

    async editGuildBadges(guildId: string) {
        const badges = [
            {
                label: 'Партнёр',
                value: 'NiakoPartner'
            }
        ]

        const userBadges = (await this.client.db.badges.filterGuild(guildId, true)).map((b) => b.badge)

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`devPanelSelectBadgeGuild.${guildId}`)
                .setPlaceholder('Выберите значки...')
                .addOptions({ label: 'Очистить значки', value: 'clear' })
                .addOptions(
                    badges.map((option) => {
                        return {
                            ...option,
                            emoji: (this.client.config.emojis.badges as any)[option.value],
                            default: userBadges.includes(option.value as any)
                        }
                    })
                )
                .setMaxValues(badges.length)
            )
        ]
    }

    async editUserBadges(userId: string) {
        const badges = [{ label: 'Ранее поддержавший', value: 'Niako EarlySupport' }]

        const userBadges = (await this.client.db.badges.filterUser(userId, true)).map((b) => b.badge)

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`devPanelSelectBadgeUser.${userId}`)
                .setPlaceholder('Выберите значки...')
                .addOptions({ label: 'Очистить значки', value: 'clear' })
                .addOptions(
                    badges.map((option) => {
                        return {
                            ...option,
                            emoji: (this.client.config.emojis.badges as any)[option.value],
                            default: userBadges.includes(option.value as any)
                        }
                    })
                )
                .setMaxValues(badges.length)
            )
        ]
    }

    choosePrivateRoomType() {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('choosePrivateRoomType')
                .setPlaceholder('Выберите тип приватных комнат...')
                .addOptions(
                    {
                        label: 'Обычный (5x5 кнопок)',
                        value: 'Default'
                    },
                    {
                        label: 'Компактный (4x4 кнопок)',
                        value: 'Compact'
                    },
                    {
                        label: 'Полный (5x5 кнопок)',
                        value: 'Full'
                    }
                )
            )
        ]
    }

    private createRoomButton(doc: IModuleVoice, buttonId: IModuleVoiceButtonType) {
        const configEmoji = this.client.db.modules.voice.getButtonConfig(doc, buttonId)
        return new ButtonBuilder(
            {
                emoji: configEmoji?.emoji,
                label: configEmoji?.label,
            }
        )
        .setStyle(configEmoji?.style ? configEmoji.style : ButtonStyle.Secondary)
        .setCustomId(`manageRoom${buttonId}`)
    }

    manageRoomButton(config: IModuleVoiceButton) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`manageRoomButtonStyle.${config.type}`)
                .setLabel('Стиль'),

                this.buttonSecondary(`manageRoomButtonEmoji.${config.type}`)
                .setLabel('Эмодзи'),

                this.buttonSecondary(`manageRoomButtonLabel.${config.type}`)
                .setLabel('Этикетка')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('setRoomButton')
                .setLabel('Назад'),

                this.buttonSecondary(`manageRoomButtonPosition.${config.type}`)
                .setLabel('Позиция'),

                this.buttonSecondary(`manageRoomButtonView.${config.type}`)
                .setLabel(config.used ? 'Убрать' : 'Добавить')
            )
        ]
    }

    groupManageButton(config: IModuleGroupButton) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`manageGroupButtonStyle.${config.customId}`)
                .setLabel('Стиль'),

                this.buttonSecondary(`manageGroupButtonEmoji.${config.customId}`)
                .setLabel('Эмодзи'),

                this.buttonSecondary(`manageGroupButtonLabel.${config.customId}`)
                .setLabel('Этикетка')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('setGroupButton')
                .setLabel('Назад')
            )
        ]
    }

    settingPrivateRoom(doc: IModuleVoice) {
        const game = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('createRoomGame')
            .setPlaceholder('Выберите, в какую игру хотите сыграть...')
            .addOptions(this.client.config.games)
        )

        const rows = []
        const buttons = Object.values(
            doc.buttons
        ).filter((b) => b.used).sort((a, b) => (
            a.position.button - b.position.button &&
            a.position.row - b.position.row
        ))

        let rowSet: number[] = []
        
        Object.values(
            doc.buttons
        ).filter((b) => b.used).map((b) => {
            if(!rowSet.includes(b.position.row)) {
                rowSet.push(b.position.row)
            }
        })
        
        rowSet = rowSet.sort((a, b) => a - b)

        for ( let i = 0; rowSet.length > i; i++ ) {
            rows.push(new ActionRowBuilder<ButtonBuilder>)
            const btns = buttons.filter((b) => b.position.row === rowSet[i]).sort((a, b) => a.position.button - b.position.button)
            for ( let j = 0; (btns.length > 5 ? 5 : btns.length) > j; j++ ) {
                rows[i].addComponents(
                    this.createRoomButton(doc, btns[j].type)
                )
            }
        }

        if(doc.game) {
            rows.unshift(game)
        }

        return rows

        /*switch(doc.type) {
            case 'Default':
                const defaultButtons = [
                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'Limit'),
                        this.createRoomButton(doc, 'Lock'),
                        this.createRoomButton(doc, 'Unlock'),
                        this.createRoomButton(doc, 'RemoveUser'),
                        this.createRoomButton(doc, 'AddUser')
                    ),

                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'Rename'),
                        this.createRoomButton(doc, 'Crown'),
                        this.createRoomButton(doc, 'Kick'),
                        this.createRoomButton(doc, 'Mute'),
                        this.createRoomButton(doc, 'Unmute')
                    )
                ]

                return doc.game ? [ games, ...defaultButtons ] : defaultButtons
            case 'Compact':
                const compactButtons = [
                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'StateLock'),
                        this.createRoomButton(doc, 'StateHide'),
                        this.createRoomButton(doc, 'StateMute'),
                        this.createRoomButton(doc, 'StateUser')
                    ),

                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'Kick'),
                        this.createRoomButton(doc, 'Crown'),
                        this.createRoomButton(doc, 'Rename'),
                        this.createRoomButton(doc, 'Limit')
                    )
                ]
                
                return doc.game ? [ games, ...compactButtons ] : compactButtons
            case 'Full':
                const fullButtons = [
                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'Rename'),
                        this.createRoomButton(doc, 'Limit'),
                        this.createRoomButton(doc, 'StateLock'),
                        this.createRoomButton(doc, 'StateHide'),
                        this.createRoomButton(doc, 'StateUser')
                    ),

                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'StateMute'),
                        this.createRoomButton(doc, 'Kick'),
                        this.createRoomButton(doc, 'Reset'),
                        this.createRoomButton(doc, 'Crown'),
                        this.createRoomButton(doc, 'Info')
                    )
                ]
                
                return doc.game ? [ games, ...fullButtons ] : fullButtons
            case 'DefaultFull':
                const defaultFullButtons = [
                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'PlusLimit'),
                        this.createRoomButton(doc, 'Rename'),
                        this.createRoomButton(doc, 'StateLock'),
                        this.createRoomButton(doc, 'StateHide'),
                        this.createRoomButton(doc, 'StateUser')
                    ),

                    new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        this.createRoomButton(doc, 'MinusLimit'),
                        this.createRoomButton(doc, 'Limit'),
                        this.createRoomButton(doc, 'StateMute'),
                        this.createRoomButton(doc, 'Kick'),
                        this.createRoomButton(doc, 'Crown')
                    )
                ]
                
                return doc.game ? [ games, ...defaultFullButtons ] : defaultFullButtons
            default:
                return []
        }*/
    }

    roomInfo() {
        return [
            ...this.rowSelectMenuChannel('manageRoomCollectorInfoMenu', 'Выберите приватную комнату...'),
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('manageRoomCollectorInfoButton')
                .setLabel('Выбрать текущий голосовой канал')
            )
        ]
    }

    roomInfoPerms(id: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`checkMembersPermission.${id}`)
                .setLabel('Посмотреть права пользователей')
            )
        ]
    }

    selectRoomButtonStyle(config: IModuleVoiceButton) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`selectButtonStyle.${config.type}`)
                .setPlaceholder('Выберите стиль кнопки..')
                .addOptions(
                    [
                        {
                            label: 'Серая',
                            value: `secondary.${ButtonStyle.Secondary}`
                        },
                        {
                            label: 'Синия',
                            value: `primary.${ButtonStyle.Primary}`
                        },
                        {
                            label: 'Зелёная',
                            value: `success.${ButtonStyle.Success}`
                        },
                        {
                            label: 'Красная',
                            value: `danger.${ButtonStyle.Danger}`
                        }
                    ].map((b) => ({ ...b, default: Number(b.value.split('.')[1]) === config.style}))
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary(`openManageButton.${config.type}`)
                .setLabel('Вернуться назад')
            )
        ]
    }

    selectGroupButtonStyle(config: IModuleGroupButton) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`selectButtonStyle.${config.customId}`)
                .setPlaceholder('Выберите стиль кнопки..')
                .addOptions(
                    [
                        {
                            label: 'Серая',
                            value: `secondary.${ButtonStyle.Secondary}`
                        },
                        {
                            label: 'Синия',
                            value: `primary.${ButtonStyle.Primary}`
                        },
                        {
                            label: 'Зелёная',
                            value: `success.${ButtonStyle.Success}`
                        },
                        {
                            label: 'Красная',
                            value: `danger.${ButtonStyle.Danger}`
                        }
                    ].map((b) => ({ ...b, default: Number(b.value.split('.')[1]) === config.style}))
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary(`openManageButton.${config.customId}`)
                .setLabel('Вернуться назад')
            )
        ]
    }

    selectCustomRoomButton(doc: IModuleVoice, guild: Guild) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('selectManageRoomButton')
                .setPlaceholder('Выберите кнопку для изменения...')
                .addOptions(
                    Object.keys(doc.buttons).map((k) => {
                        const configButton = doc.buttons[k]
                        let emoji = configButton?.emoji ? configButton.emoji.startsWith('<:NK_') ? configButton.emoji : guild.emojis.cache.find(e => `<:${e.name}:${e.id}>` === configButton.emoji) : undefined

                        if(emoji) {
                            emoji = typeof emoji === 'string' ? emoji : emoji.toString()
                        }

                        return { label: (this.client.constants.get(`manageRoom${k}`) ?? 'Неизвсетная кнопка'), value: k, emoji }
                    })
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('leave')
                .setLabel('Вернуться назад')
            )
        ]
    }

    selectCustomGroupButton(doc: IModuleGroup, guild: Guild) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('selectManageGroupButton')
                .setPlaceholder('Выберите кнопку для изменения...')
                .addOptions(
                    doc.buttons.map((b) => {
                        let emoji = b.emoji ? b.emoji.startsWith('<:NK_') ? b.emoji : guild.emojis.cache.find(e => `<:${e.name}:${e.id}>` === b.emoji) : undefined

                        if(emoji) {
                            emoji = typeof emoji === 'string' ? emoji : emoji.toString()
                        }

                        return { label: (b.label || 'Без этикетки'), value: b.customId, emoji }
                    })
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('leave')
                .setLabel('Вернуться назад')
            )
        ]
    }

    selectCustomRoomEmoji(doc: IModuleVoice, guild: Guild) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('setRoomEmoji')
                .setPlaceholder('Выберите эмодзи для его изменения...')
                .addOptions(
                    Object.keys(doc.buttons).map((k) => {
                        const configButton = doc.buttons[k]
                        let emoji = configButton?.emoji ? configButton.emoji.startsWith('<:NK_') ? configButton.emoji : guild.emojis.cache.find(e => `<:${e.name}:${e.id}>` === configButton.emoji) : configButton.label

                        if(!emoji) {
                            emoji = (configButton?.label || 'Неизвестное')
                        } else {
                            emoji = typeof emoji === 'string' ? emoji : emoji.toString()
                        }

                        return { label: emoji, value: k, emoji: emoji.startsWith('<:') ? emoji : undefined }
                    })
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('leave')
                .setLabel('Вернуться назад')
            )
        ]
    }

    manageGroupConfig() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('setGroupButton')
                .setLabel('Кнопки'),

                this.buttonSecondary('setGroupMessage')
                .setLabel('Сообщение'),

                this.buttonSecondary('setGroupColor')
                .setLabel('Цвет'),

                this.buttonSecondary('setGroupWebhook')
                .setLabel('Вебхук')
            )
        ]
    }

    manageRoomConfig(config: IModuleVoice) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('setRoomStyle')
                .setPlaceholder('Выберите стиль комнат...')
                .addOptions(
                    [ 'Default', 'Pink', 'Blue', 'Red', 'Purple', 'Green', 'Yellow' ]
                    .map((style) => {
                        return {
                            label: style, value: style, default: style === config.style,
                            emoji: (this.client.config.emojis.styles as { [key: string]: string })[style]
                        }
                    })
                )
            ),

            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('setRoomType')
                .setPlaceholder('Выберите тип приватных комнат...')
                .addOptions(
                    {
                        label: 'Обычный (5x5 кнопок)',
                        value: 'Default',
                        default: config.type === 'Default'
                    },
                    {
                        label: 'Компактный (4x4 кнопок)',
                        value: 'Compact',
                        default: config.type === 'Compact'
                    },
                    {
                        label: 'Полный (5x5 кнопок)',
                        value: 'Full',
                        default: config.type === 'Full'
                    },
                    {
                        label: 'Обычный полный (5x5 кнопок)',
                        value: 'DefaultFull',
                        default: config.type === 'DefaultFull'
                    }
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('setRoomButton')
                .setLabel('Кнопки'),

                //this.buttonSecondary('setRoomEmoji')
                //.setLabel('Эмодзи'),

                this.buttonSecondary('setRoomMessage')
                .setLabel('Сообщение'),

                this.buttonSecondary('setRoomColor')
                .setLabel('Цвет'),

                this.buttonSecondary('setRoomWebhook')
                .setLabel('Вебхук')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('setRoomDefault')
                .setLabel('Настройки по умолчанию'),

                this.buttonSecondary('setRoomGame')
                .setLabel(config.game ? 'Убрать меню игр' : 'Добавить меню игр')
            )
        ]
    }

    chooseTextWriteStyle(lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('chooseTextWriteStyle')
                .setPlaceholder('Выберите стиль написания текста...')
                .addOptions(
                    {
                        label: 'Верхний регистр',
                        value: 'upper'
                    },
                    {
                        label: 'Нижний регистр',
                        value: 'lower'
                    },
                    {
                        label: 'Обычный текст',
                        value: 'none'
                    }
                )
            ),

            this.leave('leave', lang)[0]
        ]
    }

    chooseTextStyle(lang: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('chooseTextStyle')
                .setPlaceholder('Выберите стиль написания текста...')
                .addOptions(
                    {
                        label: 'Жирный курсив',
                        value: '***'
                    },
                    {
                        label: 'Жирный',
                        value: '**'
                    },
                    {
                        label: 'Курсив',
                        value: '*'
                    },
                    {
                        label: 'Обратные кавычки',
                        value: '`'
                    },
                    {
                        label: 'Без стиля',
                        value: 'none'
                    }
                )
            ),

            this.leave('leave', lang)[0]
        ]
    }

    linkActiviteGame(url: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonLink(url)
                .setLabel('Начать активность')
            )
        ]
    }

    manageChannelLogger(state: boolean, values: string[]) {
        const types = [
            {
                value: 'guildMemberAdd',
                label: 'Присоединение участника'
            },
            {
                value: 'guildMemberRemove',
                label: 'Выход участника'
            },
            {
                value: 'guildBotAdd',
                label: 'Добавление бота'
            },
            {
                value: 'guildBotRemove',
                label: 'Удаление бота'
            },
            {
                value: 'guildUpdate',
                label: 'Серверные изменения'
            },
            {
                value: 'voiceStateJoin',
                label: 'Вход в голосовой канал'
            },
            {
                value: 'voiceStateLeave',
                label: 'Выход из голосового канала'
            },
            {
                value: 'voiceStateUpdate',
                label: 'Переход в другой голосовой канал'
            },
            {
                value: 'channelCreate',
                label: 'Создание канала'
            },
            {
                value: 'channelUpdate',
                label: 'Изменение канала'
            },
            {
                value: 'channelDelete',
                label: 'Удаление канала'
            },
            {
                value: 'emojiCreate',
                label: 'Создание эмодзи'
            },
            {
                value: 'emojiUpdate',
                label: 'Изменение эмодзи'
            },
            {
                value: 'emojiDelete',
                label: 'Удаление эмодзи'
            },
            /*{
                value: 'stickerCreate',
                label: ''
            },
            {
                value: 'stickerDelete',
                label: ''
            },
            {
                value: 'stickerUpdate',
                label: ''
            },*/
            {
                value: 'roleCreate',
                label: 'Создание роли'
            },
            {
                value: 'roleUpdate',
                label: 'Изменение роли'
            },
            {
                value: 'roleDelete',
                label: 'Удаление роли'
            },
            {
                value: 'inviteCreate',
                label: 'Создание приглашения'
            },
            {
                value: 'inviteDelete',
                label: 'Удаление приглашения'
            },
            /*{
                value: 'guildBanAdd',
                label: 'Бан пользователя или бота'
            },
            {
                value: 'guildBanRemove',
                label: 'Разбан пользователя или бота'
            },*/
            {
                value: 'messageUpdate',
                label: 'Изменние сообщения'
            },
            {
                value: 'messageDelete',
                label: 'Удаление сообщения'
            },
            /*{
                value: 'guildScheduledEventCreate',
                label: ''
            },
            {
                value: 'guildScheduledEventDelete',
                label: ''
            },
            {
                value: 'guildScheduledEventUpdate',
                label: ''
            },*/
            {
                value: 'guildMemberNicknameUpdate',
                label: 'Изменение никнейма пользователя'
            },
            {
                value: 'guildMemberRoleAdd',
                label: 'Добавление роли пользователю'
            },
            {
                value: 'guildMemberRoleRemove',
                label: 'Снятие роли пользователю'
            }
        ]

        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('setChannelAction')
                .setMaxValues(types.length)
                .setPlaceholder('Выберите действия, которые хотите активизировать...')
                .addOptions(
                    types.map((t) => ({ ...t, default: values.includes(t.value), emoji: (this.client.config.emojis.logger.Default as any)[t.value] }))
                )
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('setChannelState')
                .setEmoji(state ? this.client.config.emojis.off : this.client.config.emojis.on)
                .setLabel(state ? 'Выключить' : 'Включить'),

                this.buttonDanger('clearTypes')
                .setLabel('Сбросить все типы логов')
                .setDisabled(values.length === 0)
            )
        ]
    }

    roleinfo(select: string) {
        return [
            new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('roleinfo')
                .setPlaceholder('Узнать подробнее...')
                .setOptions(
                    {
                        label: 'Основная информация',
                        value: 'info',
                        default: select === 'info'
                    },
                    {
                        label: 'Участники с ролью',
                        value: 'members',
                        default: select === 'members'
                    }
                )
            )
        ]
    }

    roleinfoMembers(role: Role, page: number, lang: string) {
        return [
            ...this.paginator(role.members.map((m)=>m), lang, page, 10, false, false),
            ...this.roleinfo('members')
        ]
    }

    private lasts(queue: IQueue, id: string) {
        return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(`lasts.${id}`)
            .setDisabled(!Boolean(Object.keys(queue.lasts).length > 0))
            .setPlaceholder(!Boolean(Object.keys(queue.lasts).length > 0) ? 'Предыдущие треки не найдены...' : 'Возврат к предыдущим трекам...')
            .setOptions(
                Object.keys(queue.lasts).length > 0 ? 
                Object.values(queue.lasts).map((t) => {
                    return {
                        label: t.info.title,
                        description: t.info.author,
                        value: t.info.uri
                    }
                })
                : [{ label: 'я еблан', value: 'eblan'}]
            )
        )
    }

    private bass(queue: IQueue, id: string) {
        return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(`bass.${id}`)
            .setPlaceholder('Уровень басса не задан...')
            .setOptions(
                [
                    {
                        label: 'Сбросить',
                        value: 'none'
                    },
                    {
                        label: 'Низкий',
                        value: 'low'
                    },
                    {
                        label: 'Средний',
                        value: 'medium'
                    },
                    {
                        label: 'Высокий',
                        value: 'high'
                    }
                ].map(v => {
                    return {
                        ...v, description: 'Нажмите, чтобы преминить этот эффект', default: v.value === queue.filter
                    }
                })
            )
        )
    }

    private playerOne(queue: IQueue, id: string) {
        return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`shuffleTracks.${id}`)
            .setEmoji(this.client.config.emojis.music.player.shuffle),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`backTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.back)
            .setDisabled(!Boolean(Object.keys(queue.lasts).length > 0)),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId((queue.paused ? 'resumeTrack' : 'pauseTrack') + `.${id}`)
            .setEmoji(queue.paused ? this.client.config.emojis.music.player.resume : this.client.config.emojis.music.player.pause),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`forwardTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.forward),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId((queue.repeat === 'Track' ? 'repeatDisabled' : queue.repeat === 'Queue' ? 'repeatTrack' : 'repeatQueue') + `.${id}`)
            .setEmoji(queue.repeat === 'Track' ? this.client.config.emojis.music.player.repeatTrack : queue.repeat === 'Queue' ? this.client.config.emojis.music.player.repeatQueue : this.client.config.emojis.music.player.repeatDisabled)
        )
    }

    private playerTwo(queue: IQueue, id: string) {
        return new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`seekTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.seek),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`volumeTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.volume),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`disconnectTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.disconnect),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`lyricTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.lyric)
            .setDisabled(true),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`heartTrack.${id}`)
            .setEmoji(this.client.config.emojis.music.player.heart)
            .setDisabled(true)
        )
    }

    player(queue: IQueue, id: string) {
        return [
            this.lasts(queue, id),
            this.bass(queue, id),
            this.playerOne(queue, id),
            this.playerTwo(queue, id)
        ]
    }

    manageVolume() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('volumeRemoveTrack')
                .setEmoji(this.client.config.emojis.music.manageVolume.min)
                .setLabel('Уменьшить на 10%'),

                this.buttonSecondary('volumeAddTrack')
                .setEmoji(this.client.config.emojis.music.manageVolume.max)
                .setLabel('Увеличить на 10%')
            ),

            /*new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('volumeSetTrack')
                .setEmoji(this.client.config.emojis.music.manageVolume.set)
                .setLabel('Установить громкость'),
            )*/
        ]
    }

    manageSeek() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('seekBackTrack')
                .setEmoji(this.client.config.emojis.music.manageSeek.back)
                .setLabel('Назад на 10с'),

                /*this.buttonPrimary('seekBackTrack')
                .setCustomId('setseek')
                .setEmoji(emojis.manageSeek.set)
                .setLabel('Установить тайминг'),*/

                this.buttonSecondary('seekForwardTrack')
                .setEmoji(this.client.config.emojis.music.manageSeek.forward)
                .setLabel('Вперед на 10с')
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonDanger('seekStartTrack')
                .setEmoji(this.client.config.emojis.music.manageSeek.start)
                .setLabel('Вернуться в начало трека')
            )
        ]
    }

    groupMessage(doc: IModuleGroup) {
        const row = new ActionRowBuilder<ButtonBuilder>()

        for ( let i = 0; ((doc.buttons) || []).length > i; i++ ) {
            if(doc.buttons[i]?.emoji || doc.buttons[i]?.label) {
                row.addComponents(
                    new ButtonBuilder({ ...doc.buttons[i] })
                )
            }
        }

        if(row.components[0]) {
            return [ row ]
        } else {
            return []
        }
    }

    groupManage() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('updateGroupCode')
                .setLabel('Пересоздать код')
                .setEmoji(this.client.config.emojis.goToGroup),

                this.buttonSecondary('setLimitCodeUse')
                .setLabel('Установить лимит использования')
                .setEmoji(this.client.config.emojis.rooms['Default']['Limit'])
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('renameGroup')
                .setLabel('Переименовать')
                .setEmoji(this.client.config.emojis.rooms['Default']['Rename']),

                this.buttonDanger('removeGroupMember')
                .setLabel('Выгнать участника')
                .setEmoji(this.client.config.emojis.rooms['Default']['RemoveUser'])
            ),

            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary('infoGroup')
                .setLabel('Информация')
                .setEmoji(this.client.config.emojis.info),

                this.buttonDanger('deleteGroup')
                .setLabel('Удалить группу')
                .setEmoji(this.client.config.emojis.trash)
            )
        ]
    }

    groupDelete() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary('accessDeleteGroup')
                .setLabel('Да, я хочу удалить!')
            )
        ]
    }
}