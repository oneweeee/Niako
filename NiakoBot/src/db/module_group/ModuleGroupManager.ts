import { ModuleGroupSchema, TModuleGroup } from "./ModuleGroupSchema";
import Mongoose from "../Mongoose";
import {
    ButtonStyle,
    ChannelType,
    Collection,
    Guild,
    Webhook
} from "discord.js";

export default class ModuleGroupManager {
    private readonly cache: Collection<string, TModuleGroup> = new Collection()
    
    constructor(private db: Mongoose) {}

    async init() {
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            const guild = this.db.client.guilds.cache.get(doc.guildId)
            if(guild) {
                this.cache.set(doc.guildId, doc)
            }
        }

        setInterval(() => this.sweeper(), 600_000)
    }

    async array(cache: boolean = false, options: { state?: boolean } = {}) {
        return cache ? this.cache.map((g) => g) : await ModuleGroupSchema.find(options)
    }

    async find(guildId: string) {
        const find = await ModuleGroupSchema.findOne({ guildId }) 
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
        const doc = await ModuleGroupSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(doc: TModuleGroup) {
        const saved = await doc.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async delete(doc: TModuleGroup, guild: Guild) {
        const parent = await this.db.client.util.getGuildChannel(guild, doc.parentId)
        const text = await this.db.client.util.getGuildChannel(guild, doc.channelId)
    
        if(text) await text.delete().catch(() => {})
        if(parent) {
            await parent.delete().catch(() => {})
        }
    
        doc.state = false
        await this.save(doc)
    }

    async sendNewMessageInGroupChannel(guild: Guild, config: TModuleGroup, options: { webhookEdit?: boolean } = {}) {
        const channel = guild.channels.cache.get(config.channelId)
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

            if(!config.buttons || config.buttons.length === 0) {
                config.buttons = [{
                    customId: 'createGroup',
                    style: ButtonStyle.Secondary,
                    label: 'Создать группу',
                    emoji: this.db.client.config.emojis.createGroup
                },
                {
                    customId: 'goToGroup',
                    style: ButtonStyle.Secondary,
                    label: 'Присоединиться',
                    emoji: this.db.client.config.emojis.goToGroup
                }]
                config.markModified('buttons')
            }

            if(options?.webhookEdit) {
                const oldWebhook = (await channel.fetchWebhooks()).find((w: any) => w.id === config.webhook.id)
                if(oldWebhook) {
                    oldWebhook.delete().catch(() => {})
                }
                
                webhook = await channel.createWebhook({ name: config.webhook.username, avatar: config.webhook.avatar })
                config.webhook.id = webhook.id
            }

            let embed = JSON.stringify(this.db.client.storage.embeds.groupMessage().data)

            if(config.embed) {
                embed = config.embed
            } else {
                config.embed = embed
            }
            
            return webhook.send({
                embeds: [ JSON.parse(embed) ],
                components: this.db.client.storage.components.groupMessage(config)
            }).then(async (message) => {
                config.messageId = message.id
                config.markModified('webhook')
                await this.save(config)
            }).catch((err) => console.log(err))
        }
    }

    async sweeper() {
        const array = await this.array(false, { state: false })
        for( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            if(this.cache.has(doc.guildId)) {
                this.cache.delete(doc.guildId)
            }

            await doc.remove()
        }
    }
}