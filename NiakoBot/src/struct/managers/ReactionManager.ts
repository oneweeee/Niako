import { ApplicationCommandOptionType, Collection, CommandInteraction } from "discord.js";
import { ISlashCommandOptions, ISlashCommandOptionsData } from "@base/BaseSlashCommand";
import { NiakoClient } from "../client/NiakoClient";

export default class ReactionManager {
    private readonly cache: Collection<string, string> = new Collection()
    public commands: Collection<string, ISlashCommandOptions> = new Collection()

    constructor(
        private client: NiakoClient
    ) {}

    async init() {
        const reactions = await this.client.request.getReactions()
        if(!reactions.status) return

        const res = reactions.answer
        for ( let i = 0; res.length > i; i++ ) {
            const name = res[i].file.split('-')[0]
            if(this.config[name]) {
                this.cache.set(res[i].file, res[i].url)

                const config = this.config[name]
                if(!this.commands.has(name)) {
                    const options: ISlashCommandOptionsData[] = []

                    if(config?.targetReplies && config.targetReplies.length > 0) {
                        options.push({
                            name: 'пользователь',
                            description: `Пользователь, на которого хотите использовать реакцию`,
                            detailedDescription: `Пользователь, на которого хотите использовать реакцию`,
                            type: ApplicationCommandOptionType.User,
                            required: (config?.singleReplies || []).length === 0
                        })
                    }

                    this.commands.set(name, {
                        name,
                        options,
                        detailedDescription: config.description,
                        description: config.description,
                        module: 'unknown'
                    })
                }
            }
        }
    }

    async send(interaction: CommandInteraction<'cached'>) {
        await interaction.deferReply().catch(() => {})

        const target = interaction.options.getMember('пользователь')
        
        let image: string

        const get = this.config[interaction.commandName]
        if(!get) {
            image = this.cache.get('404.gif')!
        } else {
            image = this.client.util.randomElement(
                this.cache.filter((v, k) => k.startsWith(interaction.commandName)).map((r) => r)
            )
        }

        const description = this.client.util.randomElement(
            ((target ? get.targetReplies : get.singleReplies) || []) as string[]
        )

        return interaction.editReply({
            embeds: [
                this.client.storage.embeds.color()
                .setTitle(`Реакция: ${get.title}`)
                .setImage(image)
                .setDescription(
                    description ? (
                        description
                        .replace(`{author}`, interaction.member.toString())
                        .replace(`{target}`, (target ? target : interaction.member).toString())
                    ) : null
                )
                .setFooter({ text: interaction.user.username, iconURL: (this.client.util.getAvatar(interaction.member) ?? undefined) })
                .setTimestamp()
            ]
        }).catch(() => {})
    }

    private readonly config: { [key: string]: any } = {
        angry: {
            title: 'Злюсь',
            usage: 'angry [@user | id | username]',
            examples: [
                {
                    usage: 'angry',
                    description: 'Злиться на всех'
                }, {
                    usage: 'angry @oneits',
                    description: 'Злиться на участника oneits'
                }
            ],
            description: 'Злиться',
            singleReplies: ['{author} злится. Все, прячьтесь! ＼(〇_ｏ)／'],
            targetReplies: ['{author} злится на {target}. Спасайся, кто может! ＼(〇_ｏ)／']
        },
        bite: {
            title: 'Кусь',
            usage: 'bite [@user | id | username]',
            examples: [
                {
                    usage: 'bite',
                    description: 'Укусить всех'
                }, {
                    usage: 'bite @oneits',
                    description: 'Укусить участника oneits'
                }
            ],
            description: 'Кусаться',
            singleReplies: ['{author} начинает кусаться. Осторожно! (≧▽≦)'],
            targetReplies: ['{author} делает кусь {target}. Ооо... Это так мило! (≧▽≦)']
        },
        cheek: {
            title: 'Поцелуй в щеку',
            usage: 'cheek <@user | id | username>',
            description: 'Поцеловать в щеку участника',
            confirmation: ['{author} хочет поцеловать {target} в щечку'],
            targetReplies: ['{author} поцеловал {target} в щечку. Так мило! (´｡• ᵕ •｡\`)']
        },
        confuse: {
            title: 'Смущаюсь',
            usage: 'confuse [@user | id | username]',
            examples: [
                {
                    usage: 'confuse',
                    description: 'Засмущаться из-за окружающих'
                }, {
                    usage: 'confuse @oneits',
                    description: 'Засмущаться из-за участника oneits'
                }
            ],
            description: 'Смущаться',
            singleReplies: ['Смотрите, как мило! {author} засмущался! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'],
            targetReplies: ['{target} засмущал нашего {author}! Как же мило... (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧']
        },
        cry: {
            title: 'Плак-плак',
            usage: 'cry [@user | id | username]',
            examples: [
                {
                    usage: 'cry',
                    description: 'Плакать из-за окружающих'
                }, {
                    usage: 'cry @oneits',
                    description: 'Плакать из-за участника oneits'
                }
            ],
            description: 'Плакать',
            singleReplies: ['Э-э-эй! {author} плачет. Нужно скорее его обнять!'],
            targetReplies: ['Э-э-эй! {target} не обижайц нашего {author}! Он уже плачет...']
        },
        dance: {
            title: 'Туц-туц',
            usage: 'dance [@user | id | username]',
            examples: [
                {
                    usage: 'dance',
                    description: 'Танцевать в чате'
                }, {
                    usage: 'dance @oneits',
                    description: 'Танцевать с участником oneits'
                }
            ],
            description: 'Танцевать',
            singleReplies: ['Смотрите, как красиво танцует {author}!'],
            targetReplies: ['Танец {author} вместе с {target} так прекрасен!']
        },
        drink: {
            title: 'Пьет чай',
            usage: 'drink [@user | id | username]',
            examples: [
                {
                    usage: 'drink',
                    description: 'Пить чай в одиночестве'
                }, {
                    usage: 'drink @oneits',
                    description: 'Пить чай с участником oneits'
                }
            ],
            description: 'Чай на столе, жаль что не ты...',
            singleReplies: ['Присоединяйтесь к чаепитию с {author}. (｡◕‿◕｡)'],
            targetReplies: ['{author} пьет чай вместе с {target}. Я бы к ним тоже присоединился (｡◕‿◕｡)']
        },
        eat: {
            title: 'Кушать',
            usage: 'eat',
            examples: [
                {
                    usage: 'eat',
                    description: 'Кушать вкусняшки'
                }, {
                    usage: 'eat @oneits',
                    description: 'Съесть oneits'
                }
            ],
            description: 'Кушать',
            singleReplies: ['М~м {author} ест вкусняшки. А поделиться? /(т-т)\\'],
            targetReplies: ['{author} кушает {target} с таким аппетитом... Аж завидно (｡◕‿◕｡)', '{target} любимый десерт {author}... Неожиданно (｡◕‿◕｡)']
        },
        feed: {
            title: 'Покормить',
            usage: 'feed <@user | id | username>',
            description: 'Покормить',
            targetReplies: ['М~м~ {author} поделился едой с {target}. (ﾉ◕ヮ◕)ﾉ'],
        },
        hit: {
            title: 'Ударить',
            usage: 'hit <@user | id | username>',
            description: 'Ударить',
            targetReplies: ['Вызывайте скорую! {author} ударил {target}. (*｀0´)']
        },
        hug: {
            title: 'Обнимашки',
            usage: 'hug [@user | id | username]',
            examples: [
                {
                    usage: 'hug',
                    description: 'Обнять всех в чате'
                }, {
                    usage: 'hug @oneits',
                    description: 'Обнять участника oneits'
                }
            ],
            description: 'Обнять',
            singleReplies: ['{author} обнял весь чат! Какие же большие ручки у него. (･ω<)☆'],
            targetReplies: ['{author} и {target} обнимаются. Может они не просто друзья? (･ω<)☆']
        },
        kiss: {
            title: 'Поцелуй',
            usage: 'kiss <@user | id | username>',
            description: 'Поцеловать',
            confirmation: ['{author} хочет поцеловать {target}.'],
            targetReplies: ['{author} страстно целует {target}. У них любовь? ヽ(ﾟ〇ﾟ)ヽ']
        },
        laugh: {
            title: 'Смеяться',
            usage: 'laugh [@user | id | username]',
            examples: [
                {
                    usage: 'laugh',
                    description: 'Смеяться'
                }, {
                    usage: 'laugh @oneits',
                    description: 'Смеяться над oneits'
                }
            ],
            description: 'Смеяться',
            singleReplies: ['Ха-ха~ {author} смеётся.'],
            targetReplies: ['Ха-ха~ {author} смеётся над {target}.']
        },
        lick: {
            title: 'Лизать',
            usage: 'lick [@user | id | username]',
            examples: [
                {
                    usage: 'lick',
                    description: 'Лизать'
                }, {
                    usage: 'lick @oneits',
                    description: 'Лизать участника oneits'
                }
            ],
            description: 'Лизать',
            singleReplies: ['Ничего себе! {author} что-то лижет! Это мороженное... ╰(▔∀▔)╯'],
            targetReplies: ['Ничего себе! {author} лижет {target}. Кто-то считает, что это мороженое... ╰(▔∀▔)╯']
        },
        love: {
            title: 'Признаться в любви',
            usage: 'love <@user | id | username>',
            description: 'Признаться в любви',
            targetReplies: ['Ого~ {author} признался в любви {target}? Так мило! (´｡• ᵕ •｡\`)']
        },
        miss: {
            title: 'Скучать',
            usage: 'miss [@user | id | username]',
            examples: [
                {
                    usage: 'miss',
                    description: 'Скучать'
                }, {
                    usage: 'miss @oneits',
                    description: 'Скучать по участнику oneits'
                }
            ],
            description: 'Скучать',
            singleReplies: ['{author} так скучно... Может его кто-то хочет развеселить? (´｡• ᵕ •｡\`)'],
            targetReplies: ['{author} так скучает по {target}. Это так мило... (´｡• ᵕ •｡\`)']
        },
        pat: {
            title: 'Гладить',
            usage: 'pat [@user | id | username]',
            examples: [
                {
                    usage: 'pat',
                    description: 'Погладить по головке всех'
                }, {
                    usage: 'pat @oneits',
                    description: 'Погладить по головке участника oneits'
                }
            ],
            description: 'Гладить по головке',
            singleReplies: ['{author} гладит всех в чате! Как же у него много ручек... (⌒ω⌒)'],
            targetReplies: ['{author} гладит {target} по головке! Наверное это приятно... (⌒ω⌒)']
        },
        poke: {
            title: 'Тык-тык',
            usage: 'poke [@user | id | username]',
            examples: [
                {
                    usage: 'poke',
                    description: 'Тыкать всех в чате'
                }, {
                    usage: 'poke @oneits',
                    description: 'Тыкать участника oneits'
                }
            ],
            description: 'Тыкать',
            singleReplies: ['{author} тыкает всех в чате! Наверное это больно... (⌒▽⌒)'],
            targetReplies: ['{author} тыкает {target}. Зачем? (⌒▽⌒)']
        },
        run: {
            title: 'Бегать',
            usage: 'run [@user | id | username]',
            examples: [
                {
                    usage: 'run',
                    description: 'Бежать просто так'
                }, {
                    usage: 'run @oneits',
                    description: 'Бежать от участника oneits'
                }
            ],
            description: 'Бегать',
            singleReplies: ['Смотри куда бежишь, {author}! Там может быть стена... (¬_¬)'],
            targetReplies: ['{author} бежит от {target}. Смотри куда бежишь главное! (¬_¬)']
        },
        sad: {
            title: 'Грустить',
            usage: 'sad [@user | id | username]',
            examples: [
                {
                    usage: 'sad',
                    description: 'Грустить просто так'
                }, {
                    usage: 'sad @oneits',
                    description: 'Грустить из-за участника oneits'
                }
            ],
            description: 'Грустить',
            singleReplies: ['Солнышко {author} загрустило... Кому-то срочно нужно поднять настроение! (´｡• ᵕ •｡\`)'],
            targetReplies: ['{author} грустит из-за {target}. Может пора прекратить! (¬_¬)']
        },
        scare: {
            title: 'Испугать',
            usage: 'scare <@user | id | username>',
            description: 'Испугать пользователя',
            targetReplies: ['Аааа! {author} напугал {target}. Все прячьтесь! ＼(〇_ｏ)／']
        },
        sex: {
            title: 'Любовь',
            usage: 'sex <@user | id | username>',
            description: 'Любовь 18+ только',
            confirmation: ['{author} хочет заняться жаркой с {target}', '{author} хочет пошалить с {target}'],
            targetReplies: ['{author} и {target} были замечены в общем туалете. Интересно чем они там занимались? (´｡• ᵕ •｡\`)']
        },
        shot: {
            title: 'Выстрел',
            usage: 'shot [@user | id | username]',
            examples: [
                {
                    usage: 'shot',
                    description: 'Устроить войнушку'
                }, {
                    usage: 'shot @oneits',
                    description: 'Выстрелить в участника oneits'
                }
            ],
            description: 'Выстрелить',
            singleReplies: ['{author} взял оружие в руки. Спасайтесь кто может! ＼(〇_ｏ)／'],
            targetReplies: ['{author} выстрелил в {target}. Я надеюсь, что не насмерть... ヘ(>_<ヘ)']
        },
        slap: {
            title: 'Пощечина',
            usage: 'slap [@user | id | username]',
            examples: [
                {
                    usage: 'slap',
                    description: 'Дать всем в чате пощечину'
                }, {
                    usage: 'slap @oneits',
                    description: 'Дать пощечину участнику oneits'
                }
            ],
            description: 'Дать пощечину',
            singleReplies: ['{author} дал всем ляпася. Откуда же у него столько рук... (ಠ_ಠ)'],
            targetReplies: ['{author} дал ляпаса {target}. Между ними что-то случилось!? (ಠ_ಠ)']
        },
        sleep: {
            title: 'Спать',
            usage: 'sleep [@user | id | username]',
            examples: [
                {
                    usage: 'sleep',
                    description: 'Уснуть прямо в чате'
                }, {
                    usage: 'sleep @oneits',
                    description: 'Заснуть из-за участника oneits'
                }
            ],
            description: 'Спать',
            singleReplies: ['Котёнок {author} уснул. Давайте будем потише в чате... (~˘▾˘)~'],
            targetReplies: ['{author} начал засыпать из-за {target}. Неужели он такой нудный? (ಠ_ಠ)']
        },
        smack: {
            title: 'Хлопать',
            usage: 'smack [@user | id | username]',
            examples: [
                {
                    usage: 'smack',
                    description: 'Хлопать просто так'
                }, {
                    usage: 'smack @oneits',
                    description: 'Хлопать участнику oneits'
                }
            ],
            description: 'Хлопать',
            singleReplies: [' {author} хлопает в ладоши! Хорошо сходил в цирк все же. (~˘▾˘)~'],
            targetReplies: ['{author} хлопает участнику {target}. Хорошое представление. (~˘▾˘)~']
        },
        smoke: {
            title: 'Курить',
            usage: 'smoke',
            description: 'Курить',
            singleReplies: [' {author} закурил... Может не стоит? ノ(º _ ºノ)'],
        },
        spit: {
            title: 'Плевать',
            usage: 'spit [@user | id | username]',
            examples: [
                {
                    usage: 'spit',
                    description: 'Плюнуть в чат'
                }, {
                    usage: 'spit @oneits',
                    description: 'Плюнуть в участника oneits'
                }
            ],
            description: 'Плюнуть',
            singleReplies: [' {author} плюнул в чат. Ходите осторожнее, чтобы не поскользнуться (~˘▾˘)~'],
            targetReplies: ['{author} плюнул участнику {target} в лицо. Будет ли драка? (ಠ_ಠ)']
        },
        tickle: {
            title: 'Щекотать',
            usage: 'tickle <@user | id | username>',
            description: 'Щекотать',
            targetReplies: ['{author} щекочет {target} в очень странных местах. ＼(〇_ｏ)／']
        },
        wink: {
            title: 'Подмигивать',
            usage: 'wink [@user | id | username]',
            examples: [
                {
                    usage: 'wink',
                    description: 'Подмигнуть'
                }, {
                    usage: 'wink @oneits',
                    description: 'Подмигнуть участнику oneits'
                }
            ],
            description: 'Подмигнуть',
            singleReplies: ['Интересно, почему {author} подмигнул? Давайте подумаем... (´｡• ᵕ •｡\`)'],
            targetReplies: ['{author} подмигнул {target}. Интересно, что он имел ввиду? (´｡• ᵕ •｡\`)']
        },
    }
}