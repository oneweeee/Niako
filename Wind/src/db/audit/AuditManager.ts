import AuditSchema, { IAuditType, TAudit } from './AuditSchema'
import WindClient from '#client'
import ms from 'ms'
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Guild,
    GuildChannel,
    GuildMember,
    Locale,
    User
} from 'discord.js'

export default class AuditManager {
    private readonly cache: Collection<string, TAudit> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const docs = await this.array()
        for ( let i = 0; docs.length > i; i++ ) {
            const guild = this.client.guilds.cache.get(docs[i].guildId)
            if(guild) {}
        }
    }

    async array(cache: boolean = false, options: {} = {}) {
        if(cache) {
            if(Object.keys(options).length > 0) {
                return this.cache.map((c) => c).filter((c) => c)
            }

            return this.cache.map((c) => c)
        } else {
            return (await AuditSchema.find(options))
        }
    }

    async get(guildId: string) {
        if(this.cache.has(guildId)) {
            return this.cache.get(guildId)!
        } else {
            return (await this.find(guildId))
        }
    }

    async find(guildId: string) {
        const doc = await AuditSchema.findOne({ guildId })
        if(doc) {
            this.cache.set(doc.guildId, doc)
            return doc
        } else {
            return (await this.create(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await AuditSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(res: TAudit) {
        const saved = await res.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async remove(res: TAudit) {
        if(this.cache.has(res.guildId)) {
            this.cache.delete(res.guildId)
        }

        const obj = res.toObject()
        await res.deleteOne()

        return obj
    }

    async getAudit(guild: Guild, event: AuditLogEvent) {
        const audit = (await guild.fetchAuditLogs({ limit: 1 }).catch(() => {}))
        if(!audit) return null

        const e = audit.entries.find((a) => a.action === event)
        if(!e || Date.now() > (e.createdTimestamp + 5000)) return null

        return e
    }

    async resolveChannel(guild: Guild, type: IAuditType | IAuditType[]) {
        const audit = await this.get(guild.id)
        if(!audit.enabled) return null

        const getType = audit.types.find((t) => typeof type === 'string' ? t.type === type : type.includes(t.type))
        if(!getType || !getType.channelId || !getType.enabled) return null

        const channel = guild.channels.cache.get(getType.channelId)
        if(!channel || !channel.isTextBased()) return null

        return { text: channel, type: getType }
    }

    async sendCustomModLogger(type: IAuditType, member: GuildMember | string, target: GuildMember | User, options: { reason?: string, time?: string }, locale: Locale) {
        if(!(target instanceof GuildMember) && !(member instanceof GuildMember)) return
        
        const channel = await this.resolveChannel(((target || member) as GuildMember).guild, type)
        if(!channel) return
        
        const embed = (type.includes('Un') ? this.client.storage.embeds.green() : this.client.storage.embeds.red())
        .setAuthor({name: this.resolveAuditType(type, locale).replace('(Wind)', '')})
        .addFields(
            {
                name: typeof member === 'string' ? 'Снял' : this.getMemberName(member.guild, member.user, true),
                value: typeof member === 'string' ? 'Автоснятие' : `${member.toString()} | \`${member.user.username}\``,
                inline: true
            },
            {
                name: 'Пользователь',
                value: `${target.toString()} | \`${target instanceof User ? target.username : target.user.username}\``,
                inline: true
            }
        )
        .setFooter({text: `ID пользователя: ${target.id}${type.includes('Un') ? `・Наказан ${options.time === '0' ? 'навсегда' : 'до'}` : ''}`})
        .setTimestamp(type.includes('Un') ? Date.now() : Math.round(Date.now() + (options?.time ? ms(options.time) : 0)))

        
        if(!type.includes('Un')) {
            embed.addFields({ name: 'Причина', value: options?.reason || 'Без указания причины' })
        }

        return channel.text.send({ embeds: [ embed ] }).catch(() => {})
    }

    getMemberName(guild: Guild, user: User, mod: boolean = false) {
        if(user.bot) return 'Бот'
        else if(user.id === guild.ownerId) return 'Владелец'
        else {
            const member = guild.members.cache.get(user.id)
            if(member && member.permissions.has('Administrator')) return 'Администратор'
            else return (mod ? 'Модератор' : 'Пользователь')
        }
    }

    getChannelAssets(channel: GuildChannel, style: ('Green' | 'Yellow' | 'Red'), locale: Locale) {
        switch(channel.type) {
            case ChannelType.GuildAnnouncement:
                return {
                    icon: this.client.icons['Annonce'][style],
                    authors: {
                        'Create': 'Создан новостной канал сервера',
                        'Delete': 'Удален новостной канал сервера',
                        'Update': 'Изменение новостного канала'
                    }
                }

            case ChannelType.GuildCategory:
                return {
                    icon: this.client.icons['Category'][style],
                    authors: {
                        'Create': 'Создана категория каналов',
                        'Delete': 'Удалена категория каналов',
                        'Update': 'Изменение категории каналов'
                    }
                }

            case ChannelType.GuildForum:
                return {
                    icon: this.client.icons['Forum'][style],
                    authors: {
                        'Create': 'Создан канал форум',
                        'Delete': 'Удален канал форум',
                        'Update': 'Изменение канала форума'
                    }
                }

            case ChannelType.GuildStageVoice:
                return {
                    icon: this.client.icons['Stage'][style],
                    authors: {
                        'Create': 'Создан канал мероприятий',
                        'Delete': 'Удален канал мероприятий',
                        'Update': 'Изменение канала мероприятий'
                    }
                }

            case ChannelType.GuildVoice:
                return {
                    icon: this.client.icons['Voice'][style],
                    authors: {
                        'Create': 'Создан голосовой канал',
                        'Delete': 'Удален голосовой канал',
                        'Update': 'Изменение голосовой канала'
                    }
                }

            default:
                return {
                    icon: this.client.icons['Text'][style],
                    authors: {
                        'Create': 'Создан текстовый канал',
                        'Delete': 'Удален текстовый канал',
                        'Update': 'Изменение текстовый канала'
                    }
                }
        }
    }

    resolveAuditType(type: IAuditType, locale: Locale) {
        switch(type) {
            case 'ChannelCreate':
                return 'Создание канала'
            case 'ChannelDelete':
                return 'Удаление канала'
            case 'ChannelUpdate':
                return 'Изменение канала'
            case 'EmojiCreate':
                return 'Создание эмодзи'
            case 'EmojiDelete':
                return 'Удаление эмодзи'
            case 'EmojiUpdate':
                return 'Изменение эмодзи'
            case 'GuildBanAdd':
                return 'Блокировка пользователя'
            case 'GuildBanRemove':
                return 'Разблокировка пользователя'
            case 'GuildBotAdd':
                return 'Добавление бота'
            case 'GuildBotRemove':
                return 'Удаление бота'
            case 'GuildMemberAdd':
                return 'Вход пользователя'
            case 'GuildMemberNicknameUpdate':
                return 'Изменение имени пользователя'
            case 'GuildMemberRemove':
                return 'Выход пользователя'
            case 'GuildMemberRoleAdd':
                return 'Выдача ролей пользователю'
            case 'GuildMemberRoleRemove':
                return 'Удаление ролей у пользователя'
            case 'GuildScheduledEventCreate':
                return 'Создание мероприятия'
            case 'GuildScheduledEventDelete':
                return 'Удаление мероприятия'
            case 'GuildScheduledEventUpdate':
                return 'Изменение мероприятия'
            case 'GuildUpdate':
                return 'Изменение сервера'
            case 'InviteCreate':
                return 'Создание приглашения'
            case 'InviteDelete':
                return 'Удаление приглашения'
            case 'MessageDelete':
                return 'Удаление сообщения'
            case 'MessageUpdate':
                return 'Изменение сообщения'
            case 'RoleCreate':
                return 'Создание роли'
            case 'RoleDelete':
                return 'Удаление роли'
            case 'RoleUpdate':
                return 'Изменение роли'
            case 'StickerCreate':
                return 'Создание стикера'
            case 'StickerDelete':
                return 'Удаление стикера'
            case 'StickerUpdate':
                return 'Изменение стикера'
            case 'VoiceStateJoin':
                return 'Вход в голосвой канал'
            case 'VoiceStateLeave':
                return 'Выход из голосвого канала'
            case 'VoiceStateUpdate':
                return 'Переход в другой голосовой канал'
            case 'GuildMuteAdd':
                return 'Заглушение участника'
            case 'GuildMuteRemove':
                return 'Разглушение участника'
            case 'PresenceStatus':
                return 'Обновление статуса участника'
        }
    }
}