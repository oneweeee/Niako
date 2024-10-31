import { TAccount } from "../../db/accounts/AccountSchema";
import { IBoost } from "../../db/boosts/BoostSchema";
import { NiakoClient } from "../client/NiakoClient";
import moment from "moment-timezone";
import { readdir } from "fs";
import {
    Collection,
    CommandInteraction,
    GuildChannel,
    GuildMember,
    Role
} from "discord.js";

export interface ILanguageChangeOptions {
    roles?: Role[],
    channels?: GuildChannel[],
    role?: Role,
    channel?: GuildChannel,
    cooldown?: number,
    commandName?: string,
    author?: GuildMember,
    target?: GuildMember,
    interaction?: CommandInteraction<'cached'>,
    interactionCached?: number,
    documentAccount?: TAccount,
    documentsBoost?: IBoost[],
    documentBoost?: IBoost,
    cost?: number,
    count?: number,
    pageNow?: number,
    pageMax?: number,
    id?: string,
    name?: string,
    userId?: string
}

export default class LanguageManager {
    public readonly cache: Collection<string, any> = new Collection()
    private readonly dirWithLangs: string = `${__dirname}/../lang`
    private defaultLanguage: string = 'ru'

    constructor(
        private client: NiakoClient
    ) {
        this.init()
    }

    init() {
        readdir(this.dirWithLangs, (err, files) => {
            if(err) return this.client.logger.error(err)

            files.filter((f) => ['js', 'ts'].includes(f.split('.')[1]))
            .forEach(async (file) => {
                const data = (await import(`${this.dirWithLangs}/${file}`))

                if(data?.default && typeof data?.default === 'object') {
                    this.cache.set(file.split('.')[0], data.default)
                }
            })
        })
    }

    get(search: string, language: string = this.defaultLanguage, options: ILanguageChangeOptions = {}): string {
        let lang = this.cache.get(language)
        if(!lang) {
            lang = this.cache.get(this.defaultLanguage)!
        }

        try {
            let resolve = eval(`lang.${search}`)
            if(resolve && typeof resolve === 'string') {
                if(this.needChange(resolve)) {
                    resolve = this.changeText(resolve, options)
                }

                return resolve
            } else return '???'
        } catch {
            return '???'
        }
    }

    changeText(text: string, options: ILanguageChangeOptions = {}) {
        let res = ''
        while(text.includes('{')) {
            res += text.substring(0, text.indexOf('{'))
            text = text.substring(text.indexOf('{') + 1)
            res += this.textSwitcher(text.substring(0, text.indexOf('}')), options)
            text = text.substring(text.indexOf('}') + 1)
        }

        return (res + text)
    }

    private needChange(text: string) {
        return (text.includes('{') && text.includes('}'))
    }

    private textSwitcher(text: string, options: ILanguageChangeOptions = {}): string {
        switch(text) {
            case 'ping':
                return String(this.client.ws.ping)
            case 'cooldown':
                if(options?.cooldown) {
                    return `<t:${Math.round(options.cooldown / 1000)}:R>`
                }
            case 'commandName':
                if(options?.commandName) {
                    return options.commandName
                }
            case 'author.mention':
                if(options.author) {
                    return options.author.toString()
                }
            case 'author.username':
            case 'author.tag':
                if(options.author) {
                    return eval(`${options.author}.${text.split('.')[1]}`)
                }
            case 'target.mention':
                if(options.target) {
                    return options.target.toString()
                }
            case 'target.username':
            case 'author.tag':
                if(options.target) {
                    return eval(`${options.target}.${text.split('.')[1]}`)
                }
            case 'interactionEdited':
                if(options.interaction && options.interactionCached) {
                    return String(Math.round((options.interactionCached - options.interaction.createdTimestamp) / 10))
                }
            case 'totalPing':
                if(options.interaction && options.interactionCached) {
                    return String(Math.round((options.interactionCached - options.interaction.createdTimestamp) / 10 + this.client.ws.ping))
                }
            case 'account.balance':
                if(options.documentAccount) {
                    return String(options.documentAccount.balance)
                }
            case 'boost.boostedTimestamp':
                if(options.documentBoost) {
                    return String(options.documentBoost.boostedTimestamp)
                }
            case 'boostBoostedTime':
                if(options.documentBoost) {
                    return moment(options.documentBoost.boostedTimestamp).tz('Europe/Moscow').locale('ru-RU').format('DD.MM.YYYY')
                }
            case 'count':
                if(options.count) {
                    return String(options.count)
                }
            case 'boosts.noactived':
                if(options.documentsBoost) {
                    return String(options.documentsBoost.filter((b) => !b.actived).length)
                }
            case 'boosts.noboosted':
                if(options.documentsBoost) {
                    return String(options.documentsBoost.filter((b) => b.actived && !b.boosted).length)
                }
            case 'nowPage':
                if(options.pageNow) {
                    return String(options.pageNow)
                }
            case 'maxPage':
                if(options.pageMax) {
                    return String(options.pageMax)
                }
            case 'cost':
                if(options.cost) {
                    return String(options.cost)
                }
            case 'name':
                if(options.name) {
                    return options.name
                }
            case 'id':
                if(options.id) {
                    return options.id
                }
            case 'userId':
                if(options.userId) {
                    return options.userId
                }
            default:
                if(text.startsWith('emojis') || text.startsWith('meta')) {
                    return String(eval(`this.client.config.${text}`) || (text.startsWith('emojis') ? this.client.config.emojis.unknown : 0))
                }

                if(text.startsWith('util')) {
                    return String(eval(`this.client.${text}`) || 'error')
                }

                return text
        }
    }
}