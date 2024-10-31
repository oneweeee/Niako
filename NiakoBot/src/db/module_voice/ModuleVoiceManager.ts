import Mongoose from "../Mongoose";
import {
    IModuleVoice,
    IModuleVoiceButtonType,
    ModuleVoiceSchema,
    TModuleVoice,
    TModuleVoiceStyle
} from "./ModuleVoiceSchema";
import {
    ButtonStyle,
    ChannelType,
    Collection,
    Guild,
    VoiceChannel,
    Webhook
} from "discord.js";

export default class ModuleVoiceManager {
    private readonly cache: Collection<string, TModuleVoice> = new Collection()
    public readonly channels: Set<string> = new Set()
    
    constructor(private db: Mongoose) {}

    async init() {
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            const guild = this.db.client.guilds.cache.get(doc.guildId)
            if(guild) {
                this.cache.set(doc.guildId, doc)
                if(doc.state) this.channels.add(doc.voiceChannelId)
            }
        }
    }

    /*async copyright() {
        const array = (await this.db.guilds.array()).filter((g) => g.modulePrivateRooms.type !== 'None')
        this.db.client.logger.info(`Starting update docs... ${array.length}`)
        for ( let i = 0; array.length > i; i++ ) {
            const oldCfg = array[i].modulePrivateRooms as IPrivateRoomsConfig
            const doc = await this.get(array[i].guildId)

            const guild = this.db.client.guilds.cache.get(array[i].guildId)

            doc.state = true
            doc.type = oldCfg.type
            doc.game = oldCfg.game

            doc.default = {
                roomName: oldCfg.name,
                roomLimit: oldCfg.limit,
                roleId: (oldCfg.customRoleId || array[i].guildId)
            }

            doc.messageId = doc.messageId !== '0' ? doc.messageId : oldCfg.messageId
            doc.parentId = oldCfg.parentId
            doc.textChannelId = oldCfg.textChannelId
            doc.voiceChannelId = oldCfg.voiceChannelId
            doc.webhook = {
                id: oldCfg.webhookId,
                avatar: oldCfg.webhookAvatar,
                username: oldCfg.webhookName
            }
            doc.color = oldCfg.color
            doc.style = oldCfg.style === 'None' ? 'Default' : oldCfg.style
            doc.line = oldCfg.line
            doc.embed = oldCfg?.embed || JSON.stringify(this.db.client.storage.embeds.manageRoomPanel(doc).data)

            doc.buttons = this.createRoomComponents(doc, oldCfg.style === 'None' ? 'Default' : oldCfg.style)
            doc.markModified('webhook')
            doc.markModified('default')
            doc.markModified('buttons')
            await this.save(doc).then(() => this.db.client.logger.log(`Данные комнат "${guild?.name || array[i].guildId}" перенесены. Index: ${i}`))
            if(guild) {
                await this.sendNewMessageInPrivateChannel(guild, doc)
            }
        }
    }*/

    async array(cache: boolean = false) {
        return cache ? this.cache.map((g) => g) : await ModuleVoiceSchema.find()
    }

    async find(guildId: string) {
        const find = await ModuleVoiceSchema.findOne({ guildId }) 
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
        const doc = await ModuleVoiceSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(doc: TModuleVoice) {
        const saved = await doc.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async delete(doc: TModuleVoice, guild: Guild) {
        const parent = await this.db.client.util.getGuildChannel(guild, doc.parentId)
        const voice = await this.db.client.util.getGuildChannel(guild, doc.voiceChannelId)
        const text = await this.db.client.util.getGuildChannel(guild, doc.textChannelId)
    
        if(text) await text.delete().catch(() => {})
        if(voice) await voice.delete().catch(() => {})
        if(parent) {
            if(parent.type === ChannelType.GuildCategory) {
                parent.children.cache.filter((c) => this.db.rooms.hasChannel(c.id) && c.type === ChannelType.GuildVoice).map(async (c) => await c.delete().catch(() => {}))
            }
            
            await parent.delete().catch(() => {})
        }

        if(this.channels.has(doc.voiceChannelId)) {
            this.channels.delete(doc.voiceChannelId)
        }
    
        doc.state = false
        await this.save(doc)
    }

    getButtonConfig(doc: IModuleVoice, emoji: IModuleVoiceButtonType) {
        return doc.buttons[emoji] || { label: undefined, emoji: undefined, type: emoji, style: ButtonStyle.Secondary }
    }

    getButtonEmoji(doc: IModuleVoice, emoji: IModuleVoiceButtonType) {
        return (doc.buttons[emoji]?.emoji || this.db.client.config.emojis.rooms['Default'][emoji])
    }

    async sendRoomMessage(channel: VoiceChannel, config: TModuleVoice) {
        const webhook = (await channel.createWebhook({ name: config.webhook.username, avatar: config.webhook.avatar }).catch(() => null))
        if(!webhook) return

        let embed = JSON.stringify(this.db.client.storage.embeds.manageRoomPanel(config).data)

        if(config.embed) {
            embed = config.embed
        } else {
            config.embed = embed
        }
        
        return webhook.send({
            embeds: [ JSON.parse(this.db.client.util.replaceVariable(embed, { moduleVoice: config, guild: channel.guild })) ],
            components: this.db.client.storage.components.settingPrivateRoom(config)
        }).catch(() => {})
    }

    async sendNewMessageInPrivateChannel(guild: Guild, config: TModuleVoice, options: { webhookEdit?: boolean } = {}) {
        const channel = guild.channels.cache.get(config.textChannelId)
        if(channel && channel.type === ChannelType.GuildText) {
            if(!guild.members.me?.permissions?.has('Administrator')) return

            const message = await channel.messages.fetch(config.messageId).catch(() => null)
            if(message) {
                await message.delete().catch(() => {})
            }

            let webhook: Webhook | null = (
                (await channel.fetchWebhooks().catch(() => (new Collection<any, any>()))).find((w) => w.id === config.webhook.id) ||
                (await channel.createWebhook({ name: config.webhook.username, avatar: config.webhook.avatar }).catch(() => null))
            )

            if(!webhook) return

            if(options?.webhookEdit) {
                const oldWebhook = (await channel.fetchWebhooks()).find((w: any) => w.id === config.webhook.id)
                if(oldWebhook) {
                    oldWebhook.delete().catch(() => {})
                }
                
                webhook = await channel.createWebhook({ name: config.webhook.username, avatar: config.webhook.avatar })
                config.webhook.id = webhook.id
            }

            let embed = JSON.stringify(this.db.client.storage.embeds.manageRoomPanel(config).data)

            if(config.embed) {
                embed = config.embed
            } else {
                config.embed = embed
            }
            
            return webhook.send({
                embeds: [ JSON.parse(this.db.client.util.replaceVariable(embed, { moduleVoice: config, guild })) ],
                components: this.db.client.storage.components.settingPrivateRoom(config)
            })
            .then(async (message) => {
                config.messageId = message.id
                config.markModified('default')
                config.markModified('webhook')
                await this.save(config)
            }).catch(() => {})
        }
    }

    createRoomComponents(doc: TModuleVoice, style: TModuleVoiceStyle = 'Default') {
        let obj: { [key: string]: any } = {}
        const components = this.db.client.db.modules.voice.resolveRoomComponent(doc)
        const keys = Object.keys(this.db.client.config.emojis.rooms['Default'])
        
        for ( let i = 0; keys.length > i; i++ ) {
            const k = keys[i] as any
            const emoji = this.db.client.config.emojis.rooms[style][k as 'Crown'] || this.db.client.config.emojis.rooms['Default'][k as 'Up']
            if(doc.buttons[k] && doc.type === 'Custom') {
                if(emoji.startsWith('<:')) {
                    doc.buttons[k].emoji = emoji
                } else {
                    doc.buttons[k].label = emoji
                }

                obj[k] = doc.buttons[k]
            } else {
                obj[k] = {
                    type: k,
                    position: {
                        row: components.includes(k) ? Math.trunc((components.indexOf(k))/(doc.type === 'Compact' ? 4 : 5)) : 0,
                        button: components.includes(k) ? Math.trunc((components.indexOf(k)+1) / 2) : 0
                    },
                    style: ButtonStyle.Secondary,
                    used: components.includes(k),
                    emoji: emoji.startsWith('<:') ? emoji : undefined,
                    label: emoji.startsWith('<:') ? undefined : emoji
                }
            }
        }

        return obj
    }

    editEmojiStyle(doc: TModuleVoice, style: TModuleVoiceStyle) {
        const keys = Object.keys(this.db.client.config.emojis.rooms['Default'])
        for ( let i = 0; keys.length > i; i++ ) {
            const k = keys[i] as any
            const emoji = this.db.client.config.emojis.rooms[style][k as 'Crown'] || this.db.client.config.emojis.rooms['Default'][k as 'Up']
            if(doc.buttons[k] && emoji) {
                if(emoji.startsWith('<:')) {
                    doc.buttons[k].emoji = emoji
                } else {
                    doc.buttons[k].label = emoji
                }
            }
        }

        return doc.buttons
    }

    resolveButtonPosition(doc: TModuleVoice, compact: boolean = false) {
        let filter = Object.values(doc.buttons).filter((b) => b.position.row === 0 && b.used)
        if(filter.length >= (compact ? 4 : 5)) {
            filter = Object.values(doc.buttons).filter((b) => b.position.row === 1 && b.used)
            if(filter.length >= (compact ? 4 : 5)) {
                filter = Object.values(doc.buttons).filter((b) => b.position.row === 2 && b.used)
                if(filter.length >= (compact ? 4 : 5)) {
                    return { row: 3, button: Object.values(doc.buttons).filter((b) => b.position.row === 3 && b.used).length+1 }
                } return { row: 2, button: filter.length+1 }
            } return { row: 1, button: filter.length+1 }
        } return { row: 0, button: filter.length+1 }
    }

    resolveRoomComponent(doc: TModuleVoice) {
        let resolve: IModuleVoiceButtonType[] = Object.values(doc.buttons).filter((b) => b.used).map((b) => b.type)
        switch(doc.type) {
            case 'Compact':
                resolve = [ 'StateLock', 'StateHide', 'StateMute', 'StateUser', 'Kick', 'Crown', 'Rename', 'Limit' ]
                break
            case 'Default':
                resolve = [ 'Limit', 'Lock', 'Unlock', 'RemoveUser', 'AddUser', 'Rename', 'Crown', 'Kick', 'Mute', 'Unmute' ]
                break
            case 'Full':
                resolve = [ 'Rename', 'Limit', 'StateLock', 'StateHide', 'StateUser', 'StateMute', 'Kick', 'Reset', 'Crown', 'Info' ]
                break
            case 'DefaultFull':
                resolve = [ 'PlusLimit', 'Rename', 'StateLock', 'StateHide', 'StateUser', 'MinusLimit', 'Limit', 'StateMute', 'Kick', 'Crown' ]
                break
        }

        return resolve
    }

    async resolveEditRoomStyle(doc: TModuleVoice, style: TModuleVoiceStyle) {
        doc.buttons = this.editEmojiStyle(doc, style)
        doc.style = style
        if(doc.type === 'Default') {
            doc.line = (this.db.client.config.meta.lines as any)[style]
        } else {
            doc.line = 'None'
        }

        switch(style) {
            case 'Default':
                doc.color = '#2A6FF2'
                break
            case 'Pink':
                doc.color = '#FBC7E0'
                break
            case 'Blue':
                doc.color = '#7DCDFB'
                break
            case 'Red':
                doc.color = '#FE7189'
                break
            case 'Purple':
                doc.color = '#AEA4FB'
                break
            case 'Green':
                doc.color = '#59CCB9'
                break
            case 'Yellow':
                doc.color = '#FFB537'
                break
        }

        doc.markModified('buttons')
        return (await this.save(doc))
    }
}