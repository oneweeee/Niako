import WindClient from "#client"
import WebSocket from 'ws'

export default class WebSocketManager {
    public readonly url: string = `ws://${this.client.config.ws.ip}:${this.client.config.ws.port}`

    constructor(
        private client: WindClient
    ) {
        this.connect()
        setInterval(() => { if(!this.ws) this.connect() }, 1000)
    }

    ws?: WebSocket

    connect() {
        if(this.ws) return

        this.ws = new WebSocket(this.url)
        this.ws.on('open', () => this.client.logger.connect(`WebSocket is connected on #${this.client.cluster.id+1}`))
        this.ws.on('message', async (data: any) => {
            try {
                const parse = JSON.parse(data)
                switch(parse.method) {
                    case 'who':
                        return this.who()
                    case 'getServerInfo':
                        if(parse?.guildId) return this.getServerInfo(parse.guildId)
                    case 'putGuildMain':
                        if(parse?.guildId) return this.putGuildMain(parse.guildId)
                }
            } catch (err) {
                return
            }
        })
        this.ws.on('close', (code, reason) => {
            if(code !== 1006) {
                this.client.logger.error(`${code}: ${reason}`, 'WebSocket')
            }

            this.ws = undefined
        })
        this.ws.on('error', (err) => {
            if(!err.message.startsWith('connect ECONNREFUSED')) {
                this.client.logger.error(err, 'WebSocket')
            }

            this.ws = undefined
        })
    }

    who() {
        if(this.ws) {
            return this.ws.send(JSON.stringify({ method: 'getWho', who: 'client' }))
        }
    }

    getServerInfo(guildId: string) {
        if(this.ws) {
            const guild = this.client.guilds.cache.get(guildId)
            if(!guild) return

            return this.ws.send(JSON.stringify({ method: 'sendGuildInfo', guildId: guild.id, data: guild.ownerId }))
        }
    }

    putGuildMain(guildId: string) {
        const guild = this.client.guilds.cache.get(guildId)
        if(!guild) return

        return this.client.db.guilds.find(guildId, guild.preferredLocale)
    }
}