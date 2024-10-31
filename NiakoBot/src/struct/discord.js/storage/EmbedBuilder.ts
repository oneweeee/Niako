import { IItemImage, IItemText, TModuleBanner } from '../../../db/module_banner/ModuleBannerSchema';
import { IModuleVoice, IModuleVoiceButton } from '../../../db/module_voice/ModuleVoiceSchema';
import { IModuleGroupButton } from '../../../db/module_group/ModuleGroupSchema';
import { IModuleAudit } from '../../../db/module_audit/ModuleAuditSchema';
import { INiakoTrack, TQueue } from '../../../db/queue/QueueSchema';
import { ITransaction } from '../../../db/accounts/AccountSchema';
import { TBackup } from '../../../db/backups/BackupSchema';
import { IBoost } from '../../../db/boosts/BoostSchema';
import { IGroup } from '../../../db/groups/GroupSchema';
import { NiakoClient } from '../../client/NiakoClient';
import { IRoom } from '../../../db/rooms/RoomSchema';
import {
    APIEmbed,
    AttachmentBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    EmbedData,
    Guild,
    GuildMember,
    GuildPremiumTier,
    Invite,
    Role,
    ThreadChannel,
    VoiceChannel
} from 'discord.js'

export default class extends EmbedBuilder {
    constructor(
        private client: NiakoClient
    ) { super({ color: client.config.colors.main }) }

    copy(data: EmbedData | APIEmbed) {
        return new EmbedBuilder(data)
    }

    loading(lang: string, premium: boolean = false) {
        return this.color(premium)
        .setDescription('Загрузка...')
    }

    loadingAuthor(name: string, premium: boolean = false) {
        return this.color(premium)
        .setAuthor({ name })
    }

    color(premium: boolean = false) {
        return new EmbedBuilder()
        .setColor(premium ? this.client.config.colors.premium : this.client.config.colors.main)
    }

    music(name: string) {
        return this.color()
        .setAuthor({ iconURL: this.client.config.meta.musicIcon, name })
    }

    loggerGreen() {
        return new EmbedBuilder()
        .setColor(this.client.config.logger.colors.green)
    }

    loggerRed() {
        return new EmbedBuilder()
        .setColor(this.client.config.logger.colors.red)
    }

    loggerYellow() {
        return new EmbedBuilder()
        .setColor(this.client.config.logger.colors.yellow)
    }

    success(member: GuildMember, title: string, description: string, thumbnail: boolean = false) {
        return this.default(member, title, description)
        .setColor(this.client.config.colors.green)
        .setThumbnail(thumbnail ? this.client.util.getAvatar(member) : null)
    }

    error(member: GuildMember, title: string | null, description: string, thumbnail: boolean = false) {
        return this.default(member, title, description)
        .setColor(this.client.config.colors.red)
        .setThumbnail(thumbnail ? this.client.util.getAvatar(member) : null)
        .setImage(this.client.config.meta.error)
        .setDescription(`>>> ${member.toString()}, ${description}`)
        .setTitle(`Ошибка — ${title}`)
    }

    warn(member: GuildMember, title: string, description: string) {
        return this.default(member, title, description)
        .setColor(this.client.config.colors.yellow)
        .setThumbnail(null)
    }

    default(member: GuildMember, title: string | null, description: string, options?: { target?: GuildMember, color?: boolean, indicateTitle?: boolean }) {
        return this.color(options?.color)
        .setDescription(`${member.toString()}, ${description}`)
        .setThumbnail(this.client.util.getAvatar(member))
        .setTitle(options?.indicateTitle ? `${title} — ${options.target ? options.target.user.username : member.user.username}` : title)
    }

    needLevel(level: string | number) {
        return this.color(true)
        .setAuthor({ name: 'Niako Premium', iconURL: 'https://cdn.discordapp.com/emojis/1081542183791906886.gif?size=4096' })
        .setDescription(
            `Это **бонусная** функция и **может** быть активированой ${[1,3].includes(Number(level))?'с':'со'} **${level}-${level===3?'им':'ым'}** уровнем` +'\n'
            + `> Для **покупки** и **информации** о **премиуме** пропишите \`/premium\``
        )
    }

    premium(member: GuildMember, lang: string) {
        return this.color(true)
        .setAuthor({ name: 'Niako Premium', iconURL: 'https://cdn.discordapp.com/emojis/1081542183791906886.gif?size=4096' })
        .setDescription(this.client.lang.get('commands.premium.menu.description', lang, { author: member }))
    }

    async shop(member: GuildMember, lang: string) {
        const documentAccount = await this.client.db.accounts.findOneOrCreate(member.id)

        return this.default(
            member, this.client.lang.get('commands.premium.shop.title', lang),
            this.client.lang.get('commands.premium.shop.description', lang, { documentAccount, author: member }), { color: true }
        )
        .setFooter({ text: this.client.lang.get('commands.premium.shop.footer', lang) })
    }

    boostInfo(member: GuildMember, lang: string) {
        return [
            this.color(true)
            .setAuthor({ name: 'Новый уровень — новые возможности', iconURL: 'https://cdn.discordapp.com/emojis/1081542183791906886.gif?size=4096' })
            .setDescription(`${this.client.config.emojis.space}Повысьте **уровень** сервера, чтобы **открыть** для себя расширенный **функционал** бота.`)
            .setImage(this.client.config.meta.line),


            this.color(true)
            .setTitle('Система уровней')
            .setImage('https://cdn.discordapp.com/attachments/1094082789164462160/1121795489923350649/BoostInfo.png'),


            this.color(true)
            .setTitle('Информация о покупке')
            .setDescription(
                `${this.client.config.emojis.space}Чтобы приобрести ${this.client.config.emojis.premium.boost} для начала вам следует **пополнить** баланс в боте, после чего **приобрести** ${this.client.config.emojis.premium.boost} можно будет **воспользовавшись** кнопкой "Купить" в магазине.` + '\n\n'
                + `${this.client.config.emojis.space}Для того, чтобы **активировать** ${this.client.config.emojis.premium.boost} вам нужно будет **использовать** всю туже команду </premium:${this.client.application.commands.cache.find((c) => c.name === 'premium')?.id || 0}> на **нужном** вам сервере.`
            )
            .setImage(this.client.config.meta.line),


            this.color(true)
            .setTitle('Стоимость')
            .setImage('https://cdn.discordapp.com/attachments/1094082789164462160/1121797024564641832/BoostCostInfo.png'),


            this.color(true)
            .setTitle('Общая информация о звёздах')
            .setDescription(
                `1. Для **повышения** уровня вам **потребуется** приобрести ${this.client.config.emojis.premium.boost} в магазине.` + '\n'
                + `2. Вы сможете **активиировать** их на **любом** угодном вам сервере. Уровень будет **повышаться** в зависимости от **количества** активированных **звёзд** на нем.` + '\n'
                + `3. После **приобретения** ${this.client.config.emojis.premium.boost} хранится у вас **до** активации.` + '\n'
                + `4. После **активации** ${this.client.config.emojis.premium.boost} будет **действовать** следующий месяц.` + '\n'
                + `5. Вы **всегда** можете **убрать** и **перенаправить** ваш ${this.client.config.emojis.premium.boost} на **другой** сервер.`
            )
            .setImage(this.client.config.meta.line)
        ]
    }

    private resolveTransactionType(res: ITransaction, lang: string) {
        switch(res.type) {
            case 'BuyingBoosts':
                return this.client.lang.get('commands.premium.transaction.state.buy', lang, { count: res?.options?.boosts })
            case 'ReplenishmentBalance':
                return this.client.lang.get('commands.premium.transaction.state.replenishment', lang, { count: res.count })
            case 'ProlongBoost':
                return this.client.lang.get('commands.premium.transaction.state.prolong', lang)
            case 'DevPanelAddBalance':
                return this.client.lang.get('commands.premium.transaction.state.devAddBalance', lang, { userId: res?.options?.userId })
            case 'DevPanelRemoveBalance':
                return this.client.lang.get('commands.premium.transaction.state.devRemoveBalance', lang, { userId: res?.options?.userId })
        }
    }

    transaction(member: GuildMember, array: ITransaction[], lang: string, page: number = 0, maxCount: number = 10) {
        const max = Math.ceil(array.length/maxCount) === 0 ? 1 : Math.ceil(array.length/maxCount)

        const embed = this.default(
            member, this.client.lang.get('commands.premium.transaction.title', lang),
            this.client.lang.get('commands.premium.transaction.none', lang), { color: true, indicateTitle: true }
        )
        .setFooter({ text: `${this.client.lang.get('system.page', lang)}: ${page+1}/${max}` })

        let text: string = ''
        for ( let i = page*maxCount; (i < array.length && i < maxCount*(page+1)) ; i++ ) {
            const transaction = array[i]

            text += (
                `${transaction.state ? this.client.config.emojis.premium.plus : this.client.config.emojis.premium.minus} **${transaction.count}** ${this.client.config.emojis.premium.ruble} **[<t:${Math.round(transaction.date / 1000)}:f>]**` + '\n'
                + `${this.resolveTransactionType(transaction, lang)}` + '\n'
            )
        }

        if(text !== '') {
            embed.setDescription(text)
        }

        return embed
    }

    buy(member: GuildMember, count: number, cost: number, has: boolean, lang: string) {
        const embed = this.default(
            member, this.client.lang.get('commands.premium.bought.title', lang),
            this.client.lang.get(`commands.premium.bought.state.${has}`, lang, { count, cost }), { color: true }
        )

        if(!has) embed.setFooter({ text: this.client.lang.get('commands.premium.bought.footer', lang) })

        return embed
    }

    async manage(member: GuildMember, boosts: IBoost[], lang: string) {
        const activeBoosts = boosts.filter((b) => b.boosted)

        const array: string[] = []

        for ( const doc of activeBoosts ) {
            if(!array.includes(doc.guildId)) {
                array.push(doc.guildId)
            }
        }

        const embed = this.color(true)
        .setTitle(this.client.lang.get('commands.premium.manage.title', lang))
        .setThumbnail(this.client.util.getAvatar(member))
        .setDescription(this.client.lang.get('commands.premium.manage.description', lang, { author: member }))
        .setFooter({text: (`Не использовано ${boosts.filter((s) => !s.guildId || s.guildId === '0').length} звёзд`)})

        for ( const guildId of array ) {
            const guild = await this.client.util.getGuild(guildId)
            const guildBoosts = activeBoosts.filter((b) => b.guildId === guildId).map((b) => `・<t:${Math.round(b.boostedTimestamp / 1000)}:D>`).join('\n')

            embed.addFields(
                {
                    name: `${guild ? guild.name : this.client.lang.get('system.unknownGuild', lang)}`, inline: true,
                    value: `${guildBoosts}`
                }
            )
        }

        return embed
    }

    async manageBoostInfo(member: GuildMember, boost: IBoost, lang: string) {
        const account = await this.client.db.accounts.findOneOrCreate(member.id)
        return this.color(true)
        .setTitle(this.client.lang.get('commands.premium.boostInfo.title', lang))
        .setThumbnail(this.client.util.getAvatar(member))
        .setDescription(
            `> **・${this.client.lang.get('commands.premium.boostInfo.parameters.inServer', lang)}:** ${boost.boosted ? (
                `\n${this.client.config.emojis.space}` +
                ((await this.client.util.getGuild(boost.guildId))?.name || this.client.lang.get('system.unknownGuild', lang)) + '\n'
                + `${this.client.config.emojis.space}${this.client.lang.get('commands.premium.boostInfo.parameters.boosted', lang)}: <t:${Math.round(boost.boostedTimestamp / 1000)}:D>`
            ) : this.client.lang.get('system.no', lang)}` + '\n'
            + `> **・${this.client.lang.get('commands.premium.boostInfo.parameters.actived', lang)}:** ${boost.actived ? this.client.lang.get('system.yes', lang) : this.client.lang.get('system.no', lang)}` + '\n'
            + `> **・${this.client.lang.get('commands.premium.boostInfo.parameters.bought', lang)}:** <t:${Math.round(boost.bought / 1000)}:D>` + '\n'
            + (boost.end !== 0 ? `> **・${this.client.lang.get('commands.premium.boostInfo.parameters.end', lang)}:** <t:${Math.round(boost.end / 1000)}:D>` : '')
        )
        .setFooter({ text: this.client.lang.get('commands.premium.boostInfo.footer', lang, { documentAccount: account }) })
    }

    async botinfo(lang: string) {
        const developers = this.client.config.owners.map(async (o) => {
            const user: any[] = await this.client.cluster.broadcastEval((client, c) => client.users.cache.get(c.ownerId), { context: { ownerId: o.id } })
            return `${o.emoji||''} ${user.find((u) => Boolean(u))?.username || 'unknown'}`
        })

        const fieldDev = (await Promise.all(developers))

        const packages = require('../../../../package.json') as any

        return this.color()
        .setAuthor({ name: 'Niako' })
        .setDescription('Привет! Я Ниако и я буду твоей лучшей подругой, которая разбавит твое времяпровождение на сервере.')
        .setThumbnail(this.client.util.getAvatar(this.client.user!))
        .addFields(
            {
                name: 'Построена:',
                value: `${this.client.config.emojis.djs} Discord.js${packages['dependencies']['discord.js'].replace('^', ' ')}\n${this.client.config.emojis.ts} TypeScript${packages['dependencies']['typescript'].replace('^', ' ')}`,
                inline: true
            }
        )
        .addFields(
            {
                name: 'Разработчики:',
                value: `${fieldDev[0]}`,
                inline: true
            }
        )
        .addFields(
            {
                name: '** **',
                value: `${fieldDev[1]}`,
                inline: true
            }
        )
        .addFields(
            {
                name: 'Версия:',
                value: `1.6.1 (<t:${Math.round(this.client.config.lastUpdate)}:d>)`,
                inline: true
            }
        )
        .addFields(
            {
                name: 'Полезные ссылки:',
                value: `[Пригласить](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot%20applications.commands)\n[Сервер поддержки](https://discord.gg/wA3Mmsvmcm)`,
                inline: true
            }
        )
        .addFields(
            {
                name: '** **',
                value: `[Вебсайт](https://niako.xyz/)\n[Поддержать](https://boosty.to/oneits)`,
                inline: true
            }
        )
    }

    async serverinfo(guild: Guild, lang: string) {
        const memberCount = guild.memberCount
        const memberBots = guild.members.cache.filter((m) => m.user.bot).size

        let badges = []
        const images: string[] = []

        const channelCount = guild.channels.cache.size
        const channelTextCount = guild.channels.cache.filter((c) => {
            return [
                ChannelType.GuildText, ChannelType.GuildCategory,
                ChannelType.GuildForum, ChannelType.GuildAnnouncement,
                ChannelType.GuildDirectory
            ].includes(c.type)
        }).size

        const channelVoiceCount = guild.channels.cache.filter((c) => {
            return [
                ChannelType.GuildStageVoice, ChannelType.GuildVoice,
            ].includes(c.type)
        }).size

        const owner = await guild.fetchOwner({ cache: true })

        const emojis = this.client.config.emojis.serverinfo

        if(guild?.icon) images.push(`[Иконка](${this.client.util.getIcon(guild)})`)
        if(guild?.banner) images.push(`[Баннер](${this.client.util.getBanner(guild)})`)
        if(guild?.splash) images.push(`[Экран](${this.client.util.getSplash(guild)})`)

        if(guild.verified) badges.push('ServerVerification')
        if(guild.partnered) badges.push('ServerPartner')
        
        switch(guild.premiumTier) {
            case GuildPremiumTier.Tier1:
                badges.push('ServerBoostOne')
                break
            case GuildPremiumTier.Tier2:
                badges.push('ServerBoostTwo')
                break
            case GuildPremiumTier.Tier3:
                badges.push('ServerBoostThree')
                break
        }

        badges = [...badges, ...(await this.client.db.badges.filterGuild(guild.id, true)).map((b) => b.badge)]
        
        const guildNiakoLevel = this.client.db.boosts.getGuildLevelById(guild.id)

        switch(guildNiakoLevel) {
            case 1:
                badges.push('NiakoBoostOne')
                break
            case 2:
                badges.push('NiakoBoostTwo')
                break
            case 3:
                badges.push('NiakoBoostThree')
                break
        }
        
        return this.color()
        .setThumbnail(this.client.util.getIcon(guild))
        .setTitle(`Информация о сервере ${guild.name}`)
        .setDescription(
            `${emojis.owner}**Владелец:** ${owner ? `${owner.toString()} | \`${owner.user.username}\`` : 'unknown'}` + '\n'
            + `${emojis.images}**Изображения:** ${images.length > 0 ? images.join(', ') : 'пусто'}` + '\n'
            + `${emojis.verify}**Уровень проверки:** ${this.client.constants.get(`verificationGuildLevel.${guild.verificationLevel}`, lang)}` + '\n'
            + `${emojis.description}**Описание:** ${guild.description ?? 'Отсутствует'}`
        )
        .addFields(
            {
                name: `Участников: ${memberCount}`,
                value: `${emojis.memberCount}Участников: **${memberCount-memberBots}**\n${emojis.botCount}Ботов: **${memberBots}**`,
                inline: true
            },
            {
                name: `Каналов: ${channelCount}`,
                value: `${emojis.textCount}Текстовых: **${channelTextCount}**\n${emojis.voiceCount}Голосовых: **${channelVoiceCount}**`,
                inline: true
            },
            {
                name: `Значков: ${badges.length}`,
                value: `${(badges.length > 0 ? badges.map((b) => (this.client.config.emojis.badges as any)[b] || '').join(' ') : '** **')}`,
                inline: true
            },
            {
                name: `Бустов:`,
                value: `${emojis.boostTier}Уровень: **${guild.premiumTier}**\n${emojis.boostCount}Бустов: **${guild.premiumSubscriptionCount}**`,
                inline: true
            },
            {
                name: `Афк:`,
                value: `${emojis.afkChannel}Канал: ${guild.afkChannelId ? `<#${guild.afkChannelId}>` : '**нет**'}\n${emojis.afkTimeout}Таймаут: **${this.client.util.resolveGuildAfkTimeout(guild.afkTimeout)}м**`,
                inline: true
            },
            {
                name: `Прочее:`,
                value: `${emojis.roleCount}Ролей: **${guild.roles.cache.size}**\n${emojis.emojiCount}Эмодзи: **${guild.emojis.cache.size}**`,
                inline: true
            },
        )
        .setFooter({ text: `Id: ${guild.id}` })
        .setTimestamp(guild.createdTimestamp)
    }

    async userinfo(member: GuildMember, lang: string) {
        const user = await member.user.fetch()

        const badges: any[] = (user.flags ?? { toArray: () => { return [] } }).toArray()

        if(member.premiumSince) {
            badges.push('Nitro' as any)
        }
        
        const roles = member.roles.cache.filter((r) => r.id !== member.guild.id).map((r) => r.toString())
        const status = this.client.config.emojis.status[member?.presence?.status || 'offline']

        const images: string[] = []

        images.push(`[Аватар](${this.client.util.getAvatar(user)})`)

        if(this.client.util.getAvatar(user) !== this.client.util.getAvatar(member)) {
            images.push(`[Серверный аватар](${this.client.util.getAvatar(member)})`)
        }

        if(user?.banner) {
            images.push(`[Баннер](${this.client.util.getBanner(user)})`)
        }

        badges.push(...(await this.client.db.badges.filterUser(member.id, true)).map((b) => b.badge))

        const boostBadge = await this.client.db.boosts.getMemberBadge(member.id)
        
        if(boostBadge !== '') {
            badges.push(boostBadge as any)
        }

        return this.color()
        .setThumbnail(this.client.util.getAvatar(user))
        .setDescription(
            `### ${status} ${user.username} ${badges.length > 0 ? badges.map((str) => ((this.client.config.emojis.badges as any)[str] || '')).join('') : ''}` + '\n'
            + `**Дата входа:** <t:${Math.round((member.joinedTimestamp || 0) / 1000)}:D>` + '\n'
            + `**Изображения:** ${images.join(', ')}` + '\n'
            + `**Роли (${roles.length}):** ${roles.length === 0 ? 'Нет' : (roles.length > 10 ? roles : roles.slice(0, 10)).join(', ') + (roles.length > 10 ? '...' : '')}`
        )
        .setFooter({ text: `Id: ${member.id}` })
        .setTimestamp(user.createdTimestamp)
    }

    async avatar(member: GuildMember, server: boolean, banner: boolean, author: boolean) {
        const user = await (member.user.fetch())
        if(banner && !user?.banner) {
            return this.default(member, author ? `Ваш профильный баннер` : `Профильный баннер — ${member.user.username}`, '')
            .setDescription(author ? 'У Вас **нет** баннера' : `У ${member.toString()} **нет** баннера`)
        }

        return this.color()
        .setImage(banner ? this.client.util.getBanner(user) : this.client.util.getAvatar(server ? member : member.user))
        .setTitle(author ? `Ваш ${server?'серверный аватар':banner?'профильный баннер':'профильный аватар'}` : `${server?'Серверный аватар':banner?'Профильный баннер':'Профильный аватар'} — ${member.user.username}`)
    }

    async bannerManageText(member: GuildMember, doc: TModuleBanner, text: IItemText, lang: string) {
        const buffer = await this.client.canvas.drawStaticBannerForText(member, doc, text)
        //const att = new AttachmentBuilder(buffer, { name: 'text.png' })

        return {
            embeds: [
                //this.color()
                //.setImage(`attachment://${att.name}`),
                this.color()
                .setImage(this.client.config.meta.line)
                .setTitle(`Управление текстом — ${this.client.constants.get(text.textType, lang) || 'Че по типу?'}`)
                .setDescription(
                    `**Шрифт:** ${text.size}px ${text.font}` + '\n'
                    + `**Цвет:** ${text.color}` + '\n'
                    + `**Координаты:** ${text.x} по x, ${text.y} по y` + '\n'
                    + `**Текст расположен по x:** ${text.align === 'center' ? 'по центру' : text.align === 'left' ? 'с левого края' : 'с правого края'}` + '\n'
                    + `**Текст расположен по y:** ${text.baseline === 'middle' ? 'по центру' : text.baseline === 'bottom' ? 'по низу' : 'по верху'}` + '\n'
                    + `**Максимальная длинна:** ${text.length === 'None' ? 'взависимоти от текста' : `${text.length}`}` + '\n'
                    + `**Ширина:** ${text.width === 'None' ? 'взависимоти от текста' : `${text.width}px`}` + '\n'
                    + `**Угол:** ∠${text.angle === 'None' ? 0 : text.angle}°` + '\n'
                )
            ],
            //files: [ att ]
        }
    }

    async bannerManageImage(member: GuildMember, doc: TModuleBanner, image: IItemImage, lang: string) {
        const buffer = await this.client.canvas.drawStaticBannerForImage(member, doc, image)
        //const att = new AttachmentBuilder(buffer, { name: 'image.png' })

        return {
            embeds: [
                //this.color()
                //.setImage(`attachment://${att.name}`),
                this.color()
                .setImage(this.client.config.meta.line)
                .setTitle(`Управление изображением — ${image.name}`)
                .setDescription(
                    (image.type === 'Image' ? `**Ссылка:** ${image.url.startsWith('canvasCache') ? 'загружена из кэша' : `[открыть](${image.url})`}` : '') + '\n'
                    + `**Ширина:** ${image.width}` + '\n'
                    + `**Высота:** ${image.height}` + '\n'
                    + `**Координаты:** ${image.x} по x, ${image.y} по y` + '\n'
                    + `**Тип изображения:** ${this.client.constants.get(image.type, lang) || 'Че по типу?'}` + '\n'
                    + `**Загруглять:** ${image.shape ? 'да' : 'нет'}`
                )
            ],
            //files: [ att ]
        }
    }

    async bannerTextEditFont(member: GuildMember, text: IItemText, lang: string) {
        const buffer = await this.client.canvas.drawChooseFont(text.font)
        const att = new AttachmentBuilder(buffer, { name: 'font.png' })

        return {
            embeds: [
                this.success(member, 'Установка шрифта', `Вы установили шрифт **${text.font}**`)
                .setImage(`attachment://${att.name}`),
            ],
            files: [ att ]
        }
    }

    async bannerManageBackup(member: GuildMember, doc: TBackup, lang: string) {
        const guild = await this.client.db.modules.banner.get(member.guild.id)
        const buffer = await this.client.canvas.drawStaticBannerForBackup(member, guild, doc)
        //const att = new AttachmentBuilder(buffer, { name: 'backup.png' })
        
        return {
            embeds: [
                this.color()
                //.setImage(`attachment://${att.name}`)
            ],
            //files: [ att ]
        }
    }

    async developmentPanel(stats: { totalGuilds: string, totalUsers: string, shards: any[], clusters: any[] }) {
        return this.client.storage.embeds.color()
        .setTitle('Панель управления Niako')
        .setThumbnail(this.client.util.getAvatar(this.client.user!))
        .setDescription(
            `Серверов: ${stats.totalGuilds}` + '\n'
            + `Участников: ${stats.totalUsers}` + '\n'
            + `Шардов: ${stats.shards.length}` + '\n'
            + `Кластеров: ${stats.clusters.length}` + '\n'
            + `Прем пользователей: ${await this.client.db.boosts.getUserSize()}`
        )
        .addFields(
            {
                name: `** **`,
                value: (
                    `${this.client.config.emojis.panel.addBalance} — \`Добавить денег на баланс\`` + '\n'
                    + `${this.client.config.emojis.panel.removeBalance} — \`Убрать денеги с баланса\`` + '\n'
                    + `${this.client.config.emojis.panel.addStar} — \`Выдать звёзды пользователю\`` + '\n'
                    + `${this.client.config.emojis.panel.removeStar} — \`Забрать звёзды у пользователя\`` + '\n'
                    + `${this.client.config.emojis.panel.badges} — \`Управление значками\``
                )
            }
        )
        .setTimestamp()
        .setFooter({ text: '・Последнее обновление' })
    }

    manageRoomPanel(doc: IModuleVoice) {
        switch(doc.type) {
            case 'Default':
                return this.color()
                .setColor(doc.color)
                .setTitle('Управление приватной комнатой')
                .setDescription('> Жми следующие кнопки, чтобы настроить свою комнату')
                .setFooter({ text: 'Использовать их можно только когда у тебя есть приватный канал' })
                .setImage(doc.line === 'None' ? null : doc.line)
                .addFields(
                    {
                        name: '** **',
                        inline: true,
                        value: (
                            `$emojiRoomLimit — Установить лимит` + '\n'
                            + `$emojiRoomLock — Закрыть комнату` + '\n'
                            + `$emojiRoomUnlock — Открыть комнату` + '\n'
                            + `$emojiRoomRemoveUser — Забрать доступ` + '\n'
                            + `$emojiRoomAddUser — Выдать доступ`
                        )
                    },
                    {
                        name: '** **',
                        inline: true,
                        value: (
                            `$emojiRoomRename — Сменить название` + '\n'
                            + `$emojiRoomOwner — Передать владельца` + '\n'
                            + `$emojiRoomKick — Выгнать из комнаты` + '\n'
                            + `$emojiRoomMute — Забрать право говорить` + '\n'
                            + `$emojiRoomUnmute — Вернуть право говорить`
                        )
                    }
                )

            case 'Compact':
                return this.color()
                .setColor(doc.color)
                .setImage(doc.line === 'None' ? null : doc.line)
                .setTitle('Управление приватным каналом')
                .setDescription(
                    `$emojiRoomStateLock — Закрыть/открыть канал` + '\n'
                    + `$emojiRoomStateHide — Скрыть/показать канал` + '\n'
                    + `$emojiRoomStateMute — Забрать/выдать право говорить` + '\n'
                    + `$emojiRoomStateUser — Забрать/выдать доступ` + '\n'
                    + `$emojiRoomKick — Выгнать пользователя` + '\n'
                    + `$emojiRoomOwner — Назначить нового владельца канала` + '\n'
                    + `$emojiRoomRename — Изменить название` + '\n'
                    + `$emojiRoomLimit — Установить лимит пользователей`
                )

            case 'Full':
                return this.color()
                .setColor(doc.color)
                .setImage(doc.line === 'None' ? null : doc.line)
                .setTitle('Управление приватным каналом')
                .setDescription(
                    '> Жми следующие кнопки, чтобы настроить свою комнату' + '\n'
                    + '> Использовать их можно только когда у тебя есть приватный канал' + '\n\n'
                    + `$emojiRoomRename — Изменить название комнаты` + '\n'
                    + `$emojiRoomLimit — Установить лимит пользователей` + '\n'
                    + `$emojiRoomStateLock — Закрыть/открыть доступ в комнату` + '\n'
                    + `$emojiRoomStateHide — Скрыть/раскрыть комнату для всех` + '\n'
                    + `$emojiRoomStateUser — Забрать/выдать доступ к комнате пользователю` + '\n'
                    + `$emojiRoomStateMute — Забрать/выдать право говорить пользователю` + '\n'
                    + `$emojiRoomKick — Выгнать пользователя из комнаты` + '\n'
                    + `$emojiRoomReset — Сбросить права пользователю` + '\n'
                    + `$emojiRoomOwner — Сделать пользователя новым владельцем` + '\n'
                    + `$emojiRoomInfo — Информация о комнате`
                )

            case 'DefaultFull':
                return this.color()
                .setColor(doc.color)
                .setImage(doc.line === 'None' ? null : doc.line)
                .setTitle('Управление приватным каналом')
                .setDescription(
                    '> Жми следующие кнопки, чтобы настроить свою комнату' + '\n'
                    + '> Использовать их можно только когда у тебя есть приватный канал' + '\n\n'
                    + `$emojiRoomPlusLimit — Добавить слот для пользователя` + '\n'
                    + `$emojiRoomMinusLimit — Убрать слот для пользователя` + '\n'
                    + `$emojiRoomRename — Изменить название комнаты` + '\n'
                    + `$emojiRoomStateLock — Закрыть/открыть доступ в комнату` + '\n'
                    + `$emojiRoomStateHide — Скрыть/раскрыть комнату для всех` + '\n'
                    + `$emojiRoomStateUser — Забрать/выдать доступ к комнате пользователю` + '\n'
                    + `$emojiRoomLimit — Установить лимит пользователей` + '\n'
                    + `$emojiRoomStateMute — Забрать/выдать право говорить пользователю` + '\n'
                    + `$emojiRoomKick — Выгнать пользователя из комнаты` + '\n'
                    + `$emojiRoomOwner — Сделать пользователя новым владельцем`
                )
            default:
                return this.color()
        }
    }

    manageRoomInfo(member: GuildMember, channel: VoiceChannel, doc: IModuleVoice, room: IRoom) {
        const everyone = channel.permissionOverwrites.cache.get(member.guild.id)

        return this.color()
        .setColor(doc.color)
        .setThumbnail(this.client.util.getAvatar(member))
        .setTitle('Информация о комнате')
        .setDescription(
            '**Приватная комната:**' + ` ${channel.toString()}` + '\n'
            + '**Пользователи:**' + ` ${channel.members.size}/${channel.userLimit === 0 ? 'ꝏ' : channel.userLimit}` + '\n'
            + '**Владелец:**' + ` <@!${room.userId}>` + '\n'
            + '**Время создания:**' + ` <t:${Math.round(room.created/1000)}>` + '\n'
            + '**Видна ли комната всем:**' + ` ${everyone && everyone.deny.has('ViewChannel') ? this.client.config.emojis.refuse : this.client.config.emojis.agree}` + '\n'
            + '**Доступна ли комната всем:**' + ` ${everyone && everyone.deny.has('Connect') ? this.client.config.emojis.refuse : this.client.config.emojis.agree}` + '\n'
        )
    }

    manageRoomPermissions(member: GuildMember, channel: VoiceChannel, lang: string, page: number = 0) {
        const array = channel.permissionOverwrites.cache
        .filter(p => channel.guild.members.cache.has(p.id))
        .map(p => p)

        const max = Math.ceil(array.length/5) === 0 ? 1 : Math.ceil(array.length/5)
    
        const embed = this.color()
        .setThumbnail(this.client.util.getAvatar(member))
        .setTitle('Права пользователей приватной комнаты')
        .setFooter({ text: `${this.client.lang.get('system.page', lang)}: ${page+1}/${max}` })

        for ( let i = page*5; (i < array.length && i < 5*(page+1)) ; i++ ) {
            const perms = array[i]
            const target = member.guild.members.cache.get(perms.id)

            if(target) {
                embed.addFields(
                    {
                        name: `${i+1}. ${target.displayName}`,
                        value: (
                            `> Подключиться: ${perms.deny.has('Connect') ? this.client.config.emojis.refuse : this.client.config.emojis.agree}` + '\n'
                            + `> Говорить: ${perms.deny.has('Speak') ? this.client.config.emojis.refuse : this.client.config.emojis.agree}`
                        )
                    }
                )
            }
        }

        return embed.setDescription((embed.data.fields || []).length === 0 ? 'Пусто' : null)
    }

    manageRoomConfig(member: GuildMember) {
        return this.default(member, 'Настройка приватных каналов', `Вы можете **настроить** приватные каналы, используя **панель** ниже`)
    }

    manageGroupConfig(member: GuildMember) {
        return this.default(member, 'Настройка приватных групп', `Вы можете **настроить** приватные группы, используя **панель** ниже`)
    }

    private getButtonStyle(style: ButtonStyle) {
        switch(style) {
            case ButtonStyle.Danger:
                return 'Красный'
            case ButtonStyle.Link:
                return 'Ссылка'
            case ButtonStyle.Primary:
                return 'Синий'
            case ButtonStyle.Secondary:
                return 'Серая'
            case ButtonStyle.Success:
                return 'Зелёная'
        }
    }

    roomManageButton(member: GuildMember, config: IModuleVoiceButton) {
        const emoji = config.emoji && !config.emoji.startsWith('<:NK_') ? this.client.util.getEmoji(member.guild, config.emoji) : (config.emoji || null)
        return this.color()
        .setTitle(`Управление кнопкой — ${this.client.constants.get(`manageRoom${config.type}`)}`)
        .addFields(
            {
                name: '> Стиль:',
                value: `${this.getButtonStyle(config.style)}`,
                inline: true
            },
            {
                name: '> Эмодзи:',
                value: `${emoji ? typeof emoji === 'string' ? emoji : emoji.toString() : 'Нет'}`,
                inline: true
            },
            {
                name: '> Этикетка:',
                value: `${config.label || 'Нет'}`,
                inline: true
            },
            {
                name: '> Используется:',
                value: `${!config.used ? this.client.config.emojis.refuse : this.client.config.emojis.agree}`,
                inline: true
            },
            {
                name: '> Позиция:',
                value: `${config.position.button === 0 ? 'Нет' : `Ряд: ${config.position.row} | Место: ${config.position.button}`}`,
                inline: true
            }
        )
        .setImage(this.client.config.meta.line)
    }

    groupManageButton(member: GuildMember, config: IModuleGroupButton) {
        const emoji = config.emoji && !config.emoji.startsWith('<:NK_') ? this.client.util.getEmoji(member.guild, config.emoji) : (config.emoji || null)
        return this.color()
        .setTitle(`Управление кнопкой — ${config?.label || config.customId}`)
        .addFields(
            {
                name: '> Стиль:',
                value: `${this.getButtonStyle(config.style)}`,
                inline: true
            },
            {
                name: '> Эмодзи:',
                value: `${emoji ? typeof emoji === 'string' ? emoji : emoji.toString() : 'Нет'}`,
                inline: true
            },
            {
                name: '> Этикетка:',
                value: `${config.label || 'Нет'}`,
                inline: true
            }
        )
        .setImage(this.client.config.meta.line)
    }

    /*commandsDisableList(member: GuildMember, doc: IGuild) {
        const resolveDisable = this.client.storage.slashCommands.cache.filter((c) => doc.disableCommands.includes(c.name))
        const resolveEnable = this.client.storage.slashCommands.cache.filter((c) => !doc.disableCommands.includes(c.name))

        const embed = this.color()
        .setTitle(`Список команд — ${member.guild.name}`)
        .setThumbnail(this.client.util.getAvatar(member))

        if(resolveEnable.size > 0) {
            embed.addFields(
                {
                    name: `> ${this.client.config.emojis.on} Включены:`,
                    inline: true,
                    value: `${resolveEnable.map((c) => `/${c.name}`).join('\n')}`
                }
            )
        }

        if(resolveDisable.size > 0) {
            embed.addFields(
                {
                    name: `> ${this.client.config.emojis.off} Выключены:`,
                    inline: true,
                    value: `${resolveDisable.map((c) => `/${c.name}`).join('\n')}`
                }
            )
        }

        return embed
    }*/

    async inviteinfo(invite: Invite) {
        const embed = this.color()
        .setTitle(`Информация о сервере ${invite.guild?.name}`)
        .setURL(invite.toString())
        .setThumbnail(invite.guild ? this.client.util.getIcon(invite.guild) : null)
        .setFooter({text: `Id: ${invite.guild?.id}`})
        .setTimestamp(invite.guild?.createdTimestamp || Date.now())
        .addFields(
            {
                name: 'Основная информация:',
                inline: false,
                value: (
                    invite.inviter && invite.channel ?
                    (
                        `Создал: <@!${invite.inviter.id}> **|** \`${invite.inviter.username}\`` + '\n'
                        + `Канал: <#${invite.channel.id}> **|** \`${invite.channel.name}\``
                    ) : (
                        'Ссылка является персональной'
                    )
                )
            }
        )

        if(invite.guild?.id) {
            const server = await this.client.util.getGuild(invite.guild?.id) as any

            if(server) {
                embed.addFields(
                    {
                        name: `Дополнительно:`,
                        inline: true,
                        value: `Пользователей: **${server.memberCount}**\nКаналов: **${server.channels.length}**`
                    },
                    {
                        name: '** **',
                        inline: true,
                        value: `Эмодзи: **${server.emojis.length}**\nРолей: **${server.roles.length}**`
                    }
                )
            }
        }

        return embed
    }

    roleinfo(role: Role) {
        return this.color()
        .setThumbnail(role?.icon ? this.client.util.getIcon(role) : null)
        .setTitle(`Информация о роли ${role.name}`)
        .setDescription(`**Упоминание:** ${role.toString()}`)
        .addFields(
            {
                name: 'Цвет:',
                value: `${role.hexColor === '#000000' ? 'Без цвета' : role.hexColor}`,
                inline: true
            },
            {
                name: 'Упоминается:',
                value: `${role.mentionable ? 'Да' : 'Нет'}`,
                inline: true
            },
            {
                name: 'Отображается:',
                value: `${role.hoist ? 'Да' : 'Нет'}`,
                inline: true
            },
            {
                name: 'Позиция:',
                value: `${role.position}`,
                inline: true
            },
            {
                name: 'Участников:',
                value: `${role.members.size}`,
                inline: true
            }
        )
        .setFooter({text: `Id: ${role.id}`})
        .setTimestamp(role.createdTimestamp)
    }

    roleMembers(role: Role, page: number, lang: string) {
        const maxCount = 10
        const array = role.members.map((r) => r)
        const max = Math.ceil(array.length/maxCount) === 0 ? 1 : Math.ceil(array.length/maxCount)

        const embed = this.color()
        .setThumbnail(role?.icon ? this.client.util.getIcon(role) : null)
        .setTitle(`Участники с ролью ${role.name}`)
        .setFooter({ text: `${this.client.lang.get('system.page', lang)}: ${page+1}/${max}` })

        let text: string = ''
        for ( let i = page*maxCount; (i < array.length && i < maxCount*(page+1)) ; i++ ) {
            const member = array[i]

            text += `**${i+1})** ${member.toString()} (\`${member.user.username}\`)\n`
        }

        if(text !== '') {
            embed.setDescription(text)
        }

        return embed
    }

    player(queue: TQueue, track: INiakoTrack) {
        return this.color(false)
        .setAuthor({name: track.info.author})
        .setTitle(track.info.title)
        .setURL(track.info.uri)
        .addFields(
            {
                name: `> Запрос от ${track.requster.username}`,
                inline: true,
                value: `${queue.paused ? this.client.config.emojis.music.player.resume : this.client.config.emojis.music.player.pause} ${this.client.player.progressVideoBar(Date.now()-track.start-(queue.paused ? Date.now()-queue.pausedTimestamp : 0), track.info.length)} \`${this.client.player.convertVideoLength(Date.now()-track.start-(queue.paused ? Date.now()-queue.pausedTimestamp : 0))} / ${this.client.player.convertVideoLength(track.info.length)}\``
            }
        )
    }

    manageVolume(volume: number) {
        return this.music('Управление громкостью')
        .addFields({ name: 'Громкость:', value: String(Math.round(volume * 2 * 100)) })
    }

    manageSeek(queue: TQueue) {
        return this.music('Управление позицией')
        .addFields(
            {
                name: '> Текущая позиция:',
                inline: true,
                value: `${this.client.player.convertVideoLength(Date.now()-(queue.tracks[0]!.start || 0))}`
            },
            {
                name: '> Длительность трека:',
                inline: true,
                value: `${this.client.player.convertVideoLength(queue.tracks[0]!.info.length)}`
            }
        )
    }

    queue(member: GuildMember, queue: TQueue, page: number, lang: string) {
        const array = queue.tracks

        const max = Math.ceil(array.length/10) === 0 ? 1 : Math.ceil(array.length/10)
    
        const embed = this.color()
        .setThumbnail(this.client.util.getIcon(member.guild))
        .setTitle('Очередь треков')
        .setFooter({ text: `${this.client.lang.get('system.page', lang)}: ${page+1}/${max}` })

        let text = ''
        for ( let i = page*10; (i < array.length && i < 10*(page+1)) ; i++ ) {
            const track = array[i]

            if(i === 0) {
                text += `**Сейчас играет:** [${track.info.author} - ${track.info.title}](${track.info.uri}) | \`${track.requster.username}\`` + '\n\n'
            } else text += `**${i+1}.** [${track.info.author} -${track.info.title}](${track.info.uri}) | \`${this.client.player.convertVideoLength(track.info.length)}\` | \`${track.requster.username}\`` + '\n'
        }

        return embed.setDescription(text === '' ? 'Пусто' : text)
    }

    private resolveLoggerName(type: string, channelId?: string) {
        return `**${this.client.constants.get(type)}:** ${channelId ? channelId : this.client.config.emojis.refuse}`
    }

    async loggerList(member: GuildMember, doc: IModuleAudit) {
        return this.color()
        .setTitle('Список каналов логгера')
        .setThumbnail(this.client.util.getIcon(member.guild))
        .setDescription(
            this.client.constants.loggerTypeArray.map((type: any) => {
                const getConfig = doc.channels.find((l) => l.types.includes(type))
                if(getConfig) {
                    const channel = member.guild.channels.cache.get(getConfig.channelId)
                    if(!channel) {
                        return this.resolveLoggerName(type)
                    }

                    return this.resolveLoggerName(type, channel.toString())
                }

                return this.resolveLoggerName(type)
            }).join('\n')
        )
    }

    groupMessage() {
        return this.color()
        .setTitle('Как пользоваться?')
        .setImage(this.client.config.meta.line)
        .setDescription(`> Если вы с друзьями ищите место для приятного времяпрепровождения, то создайте приватную ветку для общения без ограничений.`)
    }

    groupManage(member: GuildMember, name: string) {
        return this.default(member, `Группа ${name}`, `**управляйте** своей **группой** с помощью **кнопок** ниже.\n> Используйте **код приглашения** для **добавления** пользователей в свою группу.`).setImage(this.client.config.meta.line)
    }

    async groupInfo(member: GuildMember, channel: ThreadChannel, group: IGroup) {
        const members = await channel.members.fetch({ cache: false }).catch(() => null)
        return this.default(member, `Информация о группе ${group.name}`, `Вот более **подробная** информация о группе.`)
        .addFields(
            {
                name: '** **',
                value: (
                    `・**Владелец:** <@!${group.userId}>` + '\n'
                    + `・**Участников:** ${members?.size || 0}` + '\n'
                    + `・**Создана:** <t:${Math.round(group.createdTimestamp / 1000)}:R>` + '\n'
                    + `・**Код:** \`${group.code}\`` + '\n'
                    + (group.limitUse !== -1 ? `・**Лимит использований:** \`${group.limitUse}\`\n` : '')
                )
            }
        )
    }
}