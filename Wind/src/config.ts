import { ClusterManagerOptions } from "discord-hybrid-sharding"
import { GatewayIntentBits } from "discord.js"
import { NodeOption } from "shoukaku"

export const internal = {
    token: '',
    mongoUrl: 'mongodb://127.0.0.1:27017/wind',
    prefix: '!'
}

export const debugInternal = {
    token: '',
    mongoUrl: 'mongodb+srv://roma2005:roma2005@safety.2djs5xd.mongodb.net/Wind',
    prefix: '.'
}

export const clientId: string = '973958601616015380'
export const clientSecret: string = '75s0uu1pjDthalseLM4JMH4qGGM_0U-y'

export const debug: boolean = false

//export const SdcToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk3Mzk1ODYwMTYxNjAxNTM4MCIsImlhdCI6MTY5NzE1ODkyNX0.OWfRyYOg2swqnxBhpUZoWAUyrdF2cWAOxVn_XnOUqZ0'

export const BoticordToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk0NzU4NjEzOTkxMTQ5MTYzNSIsInRva2VuIjoiNS8yeFh4ZERvVk1BTURCYTI2eWdvNTUrVVBtc1M2aXBFckhJN1ZHT1Vha0FickZJUjRyM2thVXJRWDlHOExkTyIsInR5cGUiOiJib3QiLCJyZWRpcmVjdCI6ItGC0Ysg0LTRg9C80LDQuyDRgtGD0YIg0YfRgtC-LdGC0L4g0LHRg9C00LXRgj8iLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNjk3NjAyMDA2fQ.zVXKvDFI_9pFQGWdhKk_tQo3hbfplHmE0tiDW641qVU'

export const developers: string[] = [ '947586139911491635', '758717520525000794', '397471853481951262' ]

export const apiUrl = `http://162.248.100.176:3001`

export const clusterConfig: ClusterManagerOptions = {
    totalShards: (debug ? 1 : 4),
    shardsPerClusters: (debug ? 1 : 2),
    token: (debug ? debugInternal : internal).token
}

export const logger = {
    guildCreate: '1156162583364120626',
    guildDelete: '1156162583364120626',
    error: '1156132741130235924',
    website: '1183012545678815332'
}

export const memo = {
    guildId: '1156131475851333672',
    channelId: '1158411365346713620',
    messageId: '1160582453241589831'
}

export const links = {
    invite: 'https://discord.com/api/oauth2/authorize?client_id=973958601616015380&permissions=8&scope=bot',
    support: 'https://discord.gg/UCw7FkP3QF'
}

export const intents: GatewayIntentBits[] | number = (debug ? 131071 : 3276543)

export enum Colors {
    Brand = 0x2B2D31,
    Green = 0x00A56A,
    Red = 0xD61A3C,
    Yellow = 0x8980E8
}

export const ip: string = '162.248.100.176'

export const ws: { port: number, ip: string } = { port: 3002, ip }

export const lavalink: { enabled: boolean, nodes: NodeOption[] } = {
    enabled: true,
    nodes: [
        { name: 'Crimson', url: `${debug ? ip : 'localhost'}:7000`, auth: 'roma079841393A' }
    ]
}