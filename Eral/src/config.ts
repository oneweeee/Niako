import { EmbedBuilder, GatewayIntentBits } from "discord.js";

export const token: string = 'MTExMzM1NzkyODQ5MDA5NDY5Mw.Gny5Jh.WbIray87K81tmgd8JrnmZ7AtMku8c4hbNKPuVA'

export const mongoUrl: string = 'mongodb://127.0.0.1:27017/eral'

export const owners: { id: string, emoji?: string }[] = [
    { id: '758717520525000794', emoji: '<:NK_DevHeka:1098190215581016154>', },
    { id: '919537973702303815', emoji: '<:NK_DevSkilax:1106584854520410143>' },
    { id: '951442744931389470', emoji: '<:NK_DevThiro:1098190219813072906>' },
    { id: '931917590501150730', emoji: '<:NK_DevArlenrww:1098190212879896586>' }
]

export const debug: boolean = false

export const webUrl = 'https://api.niako.xyz'

export const intents: number | GatewayIntentBits[] = 131071 // 98047

export const ignoreRoles: string[] = [
    '1115182415212707860', '1106863890169593926', '978155307031199805', '1014487363411525722'
]

export const colors = {
    main: 0x3E7DF4,
    premium: 0xFFA917,
    discord: 0x2B2D31,
    green: 0x30D158,
    yellow: 0xfdc448,
    red: 0xFF453A
}

export const meta = {
    guildId: '976118601348153414',
    iconInfo: 'https://cdn.discordapp.com/emojis/1098190313144717422.png?size=4096',
    spaceLine: 'https://cdn.discordapp.com/attachments/1094082789164462160/1094087427175481344/BannerSpace.png',

    moderatorId: '1080413094133637191',
    managerId: '1171399978669834271',
    banId: '1119125149116018700',
    verified: {
        'RU': '1014487363411525722'
    },

    setId: '1166932971811504199',

    chatId: '1014490175033847860'
}

export const emojis = {
    clear: '<:NK_Clear:1113377800003539056>',
    home: '<:NK_Home:1113374145229635616>',
    channels: '<:NK_Channels:1113374144164282428>',
    roles: '<:NK_Roles:1113374151265234964>',
    status: '<:NK_Status:1113376762731167795>',
    news: '<:NK_News:1113376819052290078>',

    transfer: '<:NK_Transfer:1113411077460463676>',
    close: '<:NK_Close:1113411071127080990>',
    addUser: '<:NK_AddUser:1113411068312690698>',
    removeUser: '<:NK_RemoveUser:1113411075837280278>',

    trash: '<:NK_Trash:1098192626848632942>',
    dot: '<:NK_Dot:1166928106867667017>'
}

export const memo = {
    channelId: '1119118243207057468',
    embeds: [
        new EmbedBuilder().setColor(colors.discord)
        .setImage('https://cdn.discordapp.com/attachments/1014818343640899604/1119884700685701170/6fd72041e2392a2d.png')
    ],
    options: [
        { label: 'О проекте', description: 'Подробная информация о Niako', value: 'project', emoji: emojis.home },
        { label: 'Серверные роли', description: 'Информация о серверных ролях', value: 'roles', emoji: emojis.roles },
        { label: 'Серверные каналы', description: 'Информация о серверных каналах', value: 'channels', emoji: emojis.channels },
        { label: 'Уведомления', description: 'Получить роли уведомлений', value: 'profile', emoji: emojis.status },
        { label: 'Условия использования', value: 'terms', emoji: emojis.news },
        { label: 'Конфиденциальность', value: 'privacy', emoji: emojis.news }
    ]
}

export const notice = {
    channelId: '1119118383691075644',
    embeds: [
        new EmbedBuilder().setColor(colors.discord)
        .setImage('https://cdn.discordapp.com/attachments/1014818343640899604/1119884702157910026/4f33f4e5c233be2a.png'),
        new EmbedBuilder().setColor(colors.discord)
        .setDescription('Хотите быть в **курсе** всех новостей и обновлений? Тогда вы можете **выбрать** нужные категории **уведомлений** в меню.')
        .setImage(meta.spaceLine)
    ],
    options: [
        { label: 'Уведомление о состоянии', value: '1119149372106616862', emoji: emojis.status },
        { label: 'Уведомление об обновлениях', value: '1119149422660550666', emoji: emojis.news },
        { label: 'Уведомление об опросах', value: '1224187436863852676', emoji: emojis.transfer }
    ]
}


export const ticket = {
    channelId: '1119118901515657309',
    embeds: [
        new EmbedBuilder().setColor(colors.discord)
        .setImage('https://cdn.discordapp.com/attachments/1014818343640899604/1119884701470044181/c86cd2aab064629c.png'),
        new EmbedBuilder().setColor(colors.discord)
        .setDescription('Если вам **требуется** помощь, вы хотите огласить **баг** или обсудить **деловое** предложение выберите соответствующий **пункт** в меню.')
        .setImage(meta.spaceLine)
    ],
    options: [
        { label: 'Помощь', description: 'Помощь и поддержка с Niako', emoji: '<:NK_News:1113376819052290078>', value: 'help' },
        { label: 'Обнаружение бага', description: 'Сообщение о нахождение уязвимости', emoji: '<:NK_Settings:1098190318031093830>', value: 'bug' },
        { label: 'Сотрудничество', description: 'Предложение о партнёрской программе', emoji: '<:NK_Transfer:1113411077460463676>', value: 'partner' }
    ],
    createParentId: '1119118859169955840',
    parentId: '1119122603890716782',
    requestId: '1119122682588430348'
}

export const block = {
    channelId: '1119123823866953750',
    loggerId: '1119123869018640444',
    embeds: [
        new EmbedBuilder().setColor(colors.discord)
        .setImage('https://cdn.discordapp.com/attachments/1014818343640899604/1119884699343523900/85ffcb5df10d0a85.png'),
        new EmbedBuilder().setColor(colors.discord)
        .setDescription('Причиной вашего **пребывания** здесь скорее всего является **нарушение** наших **правил** или **условий** пользования Niako, **однако** у вас все еще есть **шанс**, ведь **мы** предоставляем вам **возможность** подать **аппеляцию**, в случае **принятия** которой ваша **блокировка** будет снята.')
        .setImage(meta.spaceLine)
    ]
}

export const rules = {
    channelId: '1119118291009552415',
    embeds: [
        new EmbedBuilder().setColor(colors.discord)
        .setImage('https://cdn.discordapp.com/attachments/1014818343640899604/1119884701759442994/9c6ebaff9a6a0d61.png'),
        new EmbedBuilder().setColor(colors.discord)
        .setTitle('> Введение')
        .setDescription(`\`\`\`fix\nДанные правила относятся к серверу Niako Family, однако для использования нашей продукции вам требуется ознакомиться и принять Условия пользования и Политику конфидициальности Niako. Так же вы, как и наш проект учитываем ToS и политику самого Discord.\n\`\`\``)
        .setImage(meta.spaceLine),
        new EmbedBuilder().setColor(colors.discord)
        .setTitle('> Адекватное поведение')
        .setDescription(`\`\`\`\nВоздержитесь от оскорблений, грубостей злоупотребления матом и прочих разновидностей буянства.\nУважайте собеседников и не создавайте другим дискомфорт.\n\`\`\``)
        .setImage(meta.spaceLine),
        new EmbedBuilder().setColor(colors.discord)
        .setTitle('> Загрязнение сервера')
        .setDescription(`\`\`\`\nЗапрещается чрезмерно использовать КАПС и ЗаБоРчИк, а так же: Z̈̀̕ȃ̛͛l҇͒͋g̅̃͠o͗̀͝ шрифты, флуд и спам. По-мимо этого вам запрещено использовать сервер в целях привлечения коммерческой выгоды и размещать рекламу сторонних ресурсов.\n\`\`\``)
        .setImage(meta.spaceLine),
        new EmbedBuilder().setColor(colors.discord)
        .setTitle('> Язык')
        .setDescription(`\`\`\`\nNiako в данный момент ориентируется исключительно на 1 сегмент — русский, соответсвенно разговоры на любых других языках будут восприниматься как нарушение.\n\`\`\``)
        .setImage(meta.spaceLine),
        new EmbedBuilder().setColor(colors.discord)
        .setTitle('> Жалоба')
        .setDescription(`\`\`\`\nЕсли вам не нравится пользователь можете подать на него жалобу или обсудить его поведение, с одним из модераторов, или просто заглушить его для себя.\n\`\`\``)
        .setImage(meta.spaceLine)
    ]
}

export const set = {
    channelId: '',
    embeds: [
        new EmbedBuilder().setColor(colors.discord)
        .setImage('https://cdn.discordapp.com/attachments/1014818343640899604/1119884699800707153/d2f6104c9f3f3b66.png')
    ],
    sets: {
        '1113391737612795914': {
            loggerId: '1118052867056619550',
            roleId: '1113391737612795914',
            emoji: undefined
        },
        '1094091736999022753': {
            loggerId: '1118052409768423524',
            roleId: '1094091736999022753',
            emoji: undefined
        },
    }
}