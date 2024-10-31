import { ModuleAuditSchema, TModuleAudit } from "./ModuleAuditSchema";
import Mongoose from "../Mongoose";
import {
    ChannelType,
    Collection,
    Guild,
    GuildChannel,
    User
} from "discord.js";

export default class ModuleAuditManager {
    private readonly cache: Collection<string, TModuleAudit> = new Collection()
    
    constructor(private db: Mongoose) {}

    async init() {
        this.sweeper()
        
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            const guild = this.db.client.guilds.cache.get(doc.guildId)
            if(guild) {
                this.cache.set(doc.guildId, doc)
            }
        }
    }

    /*async updateTypes() {
        const array = (await this.array())

        const updated = array.filter((g) => g.state && g.channels.length > 0)
        this.db.client.logger.info(`Starting update docs... ${updated.length}`)
        for ( let i = 0; updated.length > i; i++ ) {
            const chs = updated[i].channels
            for ( let j = 0; chs.length > j; j++ ) {
                const tps = chs[j].types
                for ( let k = 0; tps.length > k; k++ ) {
                    updated[i].types.push(
                        {
                            type: tps[k],
                            state: chs[j].state,
                            channelId: chs[j].channelId
                        }
                    )
                }
            }

            await updated[i].save()
        }

        this.db.client.logger.success('Update logger document')

        const ids = updated.map((g) => g.guildId)
        const deleted = array.filter((g) => !ids.includes(g.guildId))
        this.db.client.logger.info(`Starting delete docs... ${deleted.length}`)
        for ( let i = 0; deleted.length > i; i++ ) {
            await deleted[i].remove()
        }

        this.db.client.logger.success('Delete logger document')
    }*/

    /*async copyright() {
        const array = (await this.db.guilds.array()).filter((g) => g.moduleLogger.state)
        this.db.client.logger.info(`Starting update docs... ${array.length}`)
        for ( let i = 0; array.length > i; i++ ) {
            const oldCfg = array[i].moduleLogger
            const doc = await this.get(array[i].guildId)

            const guild = this.db.client.guilds.cache.get(array[i].guildId)

            doc.state = true
            doc.channels = oldCfg.logs
            
            await this.save(doc).then(() => this.db.client.logger.log(`Данные аудита "${guild?.name || array[i].guildId}" перенесены. Index: ${i}`))
        }
    }*/

    async array(cache: boolean = false) {
        return cache ? this.cache.map((g) => g) : await ModuleAuditSchema.find()
    }

    async find(guildId: string) {
        const find = await ModuleAuditSchema.findOne({ guildId }) 
        if(find) {
            this.cache.set(find.guildId, find)
            return find
        } else {
            return (await this.create(guildId))
        }
    }

    async get(guildId: string) {
        if(this.cache.has(guildId)) {
            return this.cache.get(guildId)!
        } else {
            return (await this.find(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await ModuleAuditSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(doc: TModuleAudit) {
        const saved = await doc.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async getLoggerChannel(channelId: string, doc: TModuleAudit) {
        const get = doc.channels.find((l) => l.channelId === channelId)
        if(get) {
            return get
        } else {
            const option = { channelId: channelId, state: false, types: [], createdTimestamp: Date.now() }
            doc.channels.push(option)
            await this.save(doc)
            return option
        }
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

    getChannelAssets(channel: GuildChannel, style: ('Green' | 'Yellow' | 'Red')) {
        switch(channel.type) {
            case ChannelType.GuildAnnouncement:
                return {
                    icon: this.db.client.config.icons['Annonce'][style],
                    authors: {
                        'Create': 'Создан новостной канал сервера',
                        'Delete': 'Удален новостной канал сервера',
                        'Update': 'Изменение новостного канала'
                    }
                }


            case ChannelType.GuildCategory:
                return {
                    icon: this.db.client.config.icons['Category'][style],
                    authors: {
                        'Create': 'Создана категория каналов',
                        'Delete': 'Удалена категория каналов',
                        'Update': 'Изменение категории каналов'
                    }
                }


            case ChannelType.GuildForum:
                return {
                    icon: this.db.client.config.icons['Forum'][style],
                    authors: {
                        'Create': 'Создан канал форум',
                        'Delete': 'Удален канал форум',
                        'Update': 'Изменение канала форума'
                    }
                }


            case ChannelType.GuildStageVoice:
                return {
                    icon: this.db.client.config.icons['Stage'][style],
                    authors: {
                        'Create': 'Создан канал мероприятий',
                        'Delete': 'Удален канал мероприятий',
                        'Update': 'Изменение канала мероприятий'
                    }
                }


            case ChannelType.GuildVoice:
                return {
                    icon: this.db.client.config.icons['Voice'][style],
                    authors: {
                        'Create': 'Создан голосовой канал',
                        'Delete': 'Удален голосовой канал',
                        'Update': 'Изменение голосовой канала'
                    }
                }

                
            default:
                return {
                    icon: this.db.client.config.icons['Text'][style],
                    authors: {
                        'Create': 'Создан текстовый канал',
                        'Delete': 'Удален текстовый канал',
                        'Update': 'Изменение текстовый канала'
                    }
                }
        }
    }

    sweeper() {
        setInterval(async () => {
            const array = await this.array(true)

            for ( let i = 0; array.length > i; i++ ) {
                const doc = array[i]
                const guild = this.db.client.guilds.cache.get(doc.guildId)
                if(guild) {
                    const loggers = doc.channels
                    if(loggers.length > 0) {
                        for ( let j = 0; loggers.length > j; j++ ) {
                            if(!guild.channels.cache.has(loggers[j].channelId)) {
                                doc.channels.splice(j, 1)
                            }
                        }

                        await this.save(doc)
                    }
                }
            }
        }, 1_800_000)
    }
}