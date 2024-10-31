import { ChannelType, WebhookClient } from "discord.js";
import { NiakoClient } from "../client/NiakoClient";
import WebSocket from 'ws';

export default class WebSocketManager {
    public readonly url: string = this.client.config.wsUrl

    constructor(
        private client: NiakoClient
    ) {
        this.connect()
        setInterval(() => { if(!this.ws) this.connect() }, 1000)
    }

    public ws?: WebSocket

    connect() {
        if(this.ws) this.ws.close()

        this.ws = new WebSocket(this.url)
        this.ws.on('open', () => this.client.logger.success(`WebSocket is connected on cluster #${this.client.cluster.id+1}`))
        this.ws.on('message', async (data: any) => {
            try {
                const parse = JSON.parse(data)
                switch(parse.method) {
                    case 'banner':
                        if(parse?.guildId) {
                            return this.banner(parse.guildId)
                        }
                        break
                    case 'createPrivateVoice':
                        if(parse?.guildId) {
                            return this.createVoiceRoom(parse.guildId)
                        }
                        break
                    case 'sendRoomMessage':
                        if(parse?.guildId) {
                            return this.sendRoomMessage(parse.guildId, Boolean(parse?.webhookEdit))
                        }
                        break
                    case 'deletePrivateVoice':
                        if(parse?.guildId) {
                            return this.deleteVoiceRoom(parse.guildId)
                        }
                        break
                    case 'putModuleAudit':
                        if(parse?.guildId) {
                            return this.putModuleAudit(parse.guildId)
                        }
                        break
                    case 'actionEmbedBuilder':
                        if(parse?.guildId) {
                            return this.actionEmbedBuilder(parse)
                        }
                        break
                    case 'updateGuildBadges':
                        if(parse?.guildId) {
                            return this.updateGuildBadges(parse.guildId)
                        }
                        break
                    /*case 'guilds':
                        if((this.client?.shard?.ids || [])[0] === 0) {
                            return this.ws!.send(JSON.stringify(await this.guilds()))
                        }*/
                }
            } catch (err) {
                return
            }
        })
        this.ws.on('close', (code, reason) => {
            this.client.logger.error(`${code}: ${reason}`, 'WEBSOCKET')
            setTimeout(() => this.connect(), 1000)
        })
        this.ws.on('error', (err) => {
            this.client.logger.error(err, 'WEBSOCKET')
            if(this.ws) {
                this.ws.close()
            } else {
                setTimeout(() => this.connect(), 1000)
            }
        })
    }

    /*async guilds() {
        const fetch = await this.client.shard!.broadcastEval((c) => c.guilds.cache.map((c) => c.id))
        const guilds: string[] = []
        for ( let i = 0; fetch.length > i; i++ ) {
            guilds.push(...fetch[i])
        }
        return guilds
    }*/

    async banner(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId)
        if(guild) {
            const doc = await this.client.db.modules.banner.findOne(guildId)
            if(doc.state) {
                const data = await this.client.canvas.drawBanner(guild, doc)
                if(!data) return
                
                return guild.setBanner(data.buffer).catch(() => {})
            }
        }
    }

    async createVoiceRoom(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId)
        if(guild) {
            const doc = await this.client.db.modules.voice.get(guildId)
            if(doc.state) return

            const member = await guild.members.fetchMe({ force: true, cache: true }).catch(() => null)
            if(!member || !member.permissions.has('Administrator')) return

            const parent = await guild.channels.create(
                {
                    name: '━━・Приватные комнаты', type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [
                                'ViewChannel',
                                'MentionEveryone',
                                'CreatePrivateThreads',
                                'CreatePrivateThreads',
                                'UseApplicationCommands',
                                'UseEmbeddedActivities',
                                'AddReactions',
                                'EmbedLinks',
                                'SendMessages'
                            ]
                        }
                    ]
                }
            )
            
            const text = await guild.channels.create(
                { name: '🔧・настройка', type: ChannelType.GuildText, parent: parent.id }
            )
        
            const voice = await guild.channels.create(
                { name: '➕・Создать', type: ChannelType.GuildVoice, parent: parent.id }
            )

            const webhook = await text.createWebhook(
                { name: member.user.username, avatar: `https://niako.xyz/img/Logo.png` }
            ).catch((e) => { console.log(e); return null })

            if(!webhook) {
                await text.delete().catch(() => {})
                await voice.delete().catch(() => {})
                return parent.delete().catch(() => {})
            }
        
            doc.state = true
            doc.type = 'Default'
            doc.messageId = '0'
            doc.webhook.id = webhook.id
            doc.webhook.username = 'Niako'
            doc.webhook.avatar = `${__dirname}/../../../../../assets/images/Logo.png`
            doc.voiceChannelId = voice.id
            doc.textChannelId = text.id
            doc.parentId = parent.id
            doc.color = '#2B2D31'
            doc.style = 'Default'
            doc.line = this.client.config.meta.line
            doc.game = false
            doc.default.roomLimit = 0
            doc.default.roomName = '$username'
            doc.defaultBlockRoles = [ guild.id ]
            doc.buttons = this.client.db.modules.voice.createRoomComponents(doc, 'Default')

            const embed = this.client.storage.embeds.manageRoomPanel(doc)
            doc.embed = JSON.stringify(embed.data)

            const message = await webhook.send({
                embeds: [ JSON.parse(this.client.util.replaceVariable(doc.embed, { moduleVoice: doc, guild })) ],
                components: this.client.storage.components.settingPrivateRoom(doc)
            })

            doc.messageId = message.id
            doc.markModified('default')
            doc.markModified('webhook')
            return this.client.db.modules.voice.save(doc)
        }
    }

    async sendRoomMessage(guildId: string, webhookEdit: boolean) {
        const guild = this.client.guilds.cache.get(guildId)
        if(guild) {
            const doc = await this.client.db.modules.voice.find(guildId)
            if(doc.state) {
                this.client.db.modules.voice.sendNewMessageInPrivateChannel(guild, doc, { webhookEdit })
            }
        }
    }

    async deleteVoiceRoom(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId)
        if(guild) {
            const doc = await this.client.db.modules.voice.get(guildId)
            this.client.db.modules.voice.delete(doc, guild)
        }
    }

    async putModuleAudit(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId)
        if(guild) {
            await this.client.db.modules.audit.find(guildId)
        }
    }

    async actionEmbedBuilder(res: { guildId: string, url?: string, message?: any, channelId?: string, type?: 'Channel' | 'Webhook' }) {
        const guild = this.client.guilds.cache.get(res.guildId)
        if(!guild) return
        
        if((!res?.type || !['Channel', 'Webhook'].includes(res.type)) || !res.message || typeof res.message !== 'string') return

        let messageOptions
        try {
            messageOptions = JSON.parse(res.message)
        } catch {
            messageOptions = 'Error'
        }

        if(messageOptions === 'Error') return

        switch(res.type) {
            case 'Channel':
                if(!res.channelId) return

                const channel = guild.channels.cache.get(res.channelId)
                if(channel?.type !== ChannelType.GuildText) return

                return channel.send(messageOptions).catch(() => {})
            case 'Webhook':
                if(!res.url) return

                const webhook = new WebhookClient({ url: res.url })

                if(messageOptions?.avatarURL) {
                    await webhook.edit({ avatar: messageOptions.avatarURL }).catch(() => {})
                }

                if(messageOptions?.username) {
                    await webhook.edit({ name: messageOptions.username }).catch(() => {})
                }

                return webhook.send(messageOptions).catch(() => {})
        }
    }

    async updateGuildBadges(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId)
        if(!guild) return

        const badges = await this.client.db.badges.filterGuild(guild.id, true);
        
        (
            await this.client.db.badges.filterGuild(guild.id)
        ).map((d) => this.client.db.badges.removeCache(d))

        badges.map((d) => this.client.db.badges.addGuildCache(d))
    }
}