import { Collection } from "discord.js";

export default class ConstantManager {
    public readonly cache: Collection<string, { [key: string]: string }> = new Collection()
    private defaultLanguage: string = 'ru'

    init() {
        this.initRuConstant()
    }

    get(search: string | undefined, lang: string = 'ru'): string | null {
        if(!search) return 'unknown'
        
        let get = this.cache.get(lang)
        if(!get) get = this.cache.get(this.defaultLanguage)!

        return get[search] || 'unknown'
    }

    public readonly textTypeArray = [
        'VoiceOnline', 'UserCount', 'MemberCount', 'BotCount',
        'Time','BoostCount', 'BoostTier', 'ActiveMemberUsername',
        'ActiveMemberNickname', 'ActiveMemberStatus', 'Default'
    ]

    public readonly loggerTypeArray = [
        'guildMemberAdd', 'guildMemberRemove', 'guildBotAdd', 'guildBotRemove',
        'guildUpdate', 'voiceStateJoin', 'voiceStateLeave', 'voiceStateUpdate',
        'channelCreate', 'channelUpdate', 'channelDelete', 'emojiCreate',
        'emojiDelete', 'emojiUpdate', //'stickerCreate', 'stickerDelete',
        /*'stickerUpdate',*/ 'roleCreate', 'roleDelete', 'roleUpdate',
        'inviteCreate', 'inviteDelete', 'guildBanAdd', 'guildBanRemove',
        'messageDelete', 'messageUpdate', //'guildScheduledEventCreate',
        //'guildScheduledEventDelete', 'guildScheduledEventUpdate',
        'guildMemberNicknameUpdate', 'guildMemberRoleAdd', 'guildMemberRoleRemove'
    ]

    private initRuConstant() {
        this.cache.set(
            'ru',
            {
                'guildMemberAdd': 'Вход участника',
                'guildMemberRemove': 'Выход участника',
                'guildBotAdd': 'Добавление бота',
                'guildBotRemove': 'Выход бота с сервера',
                'guildUpdate': 'Обновление сервера',
                'voiceStateJoin': 'Вход в голосовой канал',
                'voiceStateLeave': 'Выход из голосового канала',
                'voiceStateUpdate': 'Переход в другой голосовой канал',
                'channelCreate': 'Создание канала',
                'channelUpdate': 'Изменение канала',
                'channelDelete': 'Удаление канала',
                'emojiCreate': 'Создание эмодзи',
                'emojiDelete': 'Изменение эмодзи',
                'emojiUpdate': 'Удаление эмодзи',
                'roleCreate': 'Создание роли',
                'roleUpdate': 'Изменение роли',
                'roleDelete': 'Удаление роли',
                'inviteCreate': 'Создание приглашения',
                'inviteDelete': 'Удаление приглашения',
                'guildBanAdd': 'Блокировка пользователя',
                'guildBanRemove': 'Разблокировка пользователя',
                'messageDelete': 'Удаление сообщения',
                'messageUpdate': 'Обновление сообщения',
                'guildMemberNicknameUpdate': 'Изменение никнейма участника',
                'guildMemberRoleAdd': 'Добавление роли участнику',
                'guildMemberRoleRemove': 'Удаление роли у участника',
                'VoiceOnline': 'Голосовая активность',
                'UserCount': 'Общее количество участников',
                'MemberCount': 'Количество участников',
                'BotCount': 'Количество ботов',
                'Time': 'Время',
                'BoostCount': 'Количество бустов',
                'BoostTier': 'Уровень буста',
                'ActiveMemberTag': 'Тэг самого активного',
                'ActiveMemberDiscriminator': 'Дискриминатор самого активного',
                'ActiveMemberUsername': 'Юзернейм самого активного',
                'ActiveMemberNickname': 'Отображаемый ник самого активного',
                'ActiveMemberStatus': 'Статус самого активного',
                'Default': 'Обычный текст',
                'Image': 'Изображение по ссылке',
                'ActiveMemberAvatar': 'Аватарка самого активного',
                'verificationGuildLevel.0': 'Отсутствует',
                'verificationGuildLevel.1': 'Низкий',
                'verificationGuildLevel.2': 'Средний',
                'verificationGuildLevel.3': 'Высокий',
                'verificationGuildLevel.4': 'Очень высокий',
                'explicitContentFilter.Disabled': 'Выключена',
                'explicitContentFilter.MembersWithoutRoles': 'Участники без ролей',
                'explicitContentFilter.AllMembers': 'Все участники',
                'mfaLevel.None': 'Выключена',
                'mfaLevel.Elevated': 'Включена',
                'nsfwLevel.Default': 'Обычный',
                'nsfwLevel.Explicit': 'Откровенный',
                'nsfwLevel.Safe': 'Безопасный',
                'nsfwLevel.AgeRestricted': 'Ограниченный',
                'defaultAutoArchiveDuration.60': '1ч',
                'defaultAutoArchiveDuration.1440': '1д',
                'defaultAutoArchiveDuration.4320': '3д',
                'defaultAutoArchiveDuration.10080': '7д',
                'defaultForumLayout.0': 'Неизвестно',
                'defaultForumLayout.1': 'Список',
                'defaultForumLayout.2': 'Плитка',
                'defaultSortOrder.0': 'По активности',
                'defaultSortOrder.1': 'По дате',
                'online': 'В сети',
                'offline': 'Не в сети',
                'idle': 'Не активен',
                'dnd': 'Не беспокоить',
                'manageRoomRename': 'Изменение названия комнаты',
                'manageRoomLimit': 'Изменение лимита комнаты',
                'manageRoomKick': 'Выгнать участника с комнаты',
                'manageRoomCrown': 'Передача прав на комнату',
                'manageRoomReset': 'Сброс прав пользователя',
                'manageRoomInfo': 'Информация о комнате',
                'manageRoomMute': 'Заглушение участника в комнате',
                'manageRoomUnmute': 'Разглушение участника в комнате',
                'manageRoomStateMute': 'Заглушение/Разглушение участника в комнате',
                'manageRoomLock': 'Закрыть комнату',
                'manageRoomUnlock': 'Открыть комнату',
                'manageRoomStateLock': 'Закрыть/Открыть комнату',
                'manageRoomRemoveUser': 'Забрать доступ к комнате',
                'manageRoomAddUser': 'Выдать доступ к комнате',
                'manageRoomStateUser': 'Забрать/Выдать доступ к комнате',
                'manageRoomStateHide': 'Скрыть/Раскрыть комнату',
                'manageRoomPlusLimit': 'Добавить слот в комнату',
                'manageRoomMinusLimit': 'Убрать слот с комнаты',
                'manageRoomUp': 'Поднять комнату'
            }
        )
    }
}