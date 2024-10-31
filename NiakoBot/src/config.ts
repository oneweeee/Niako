import { GatewayIntentBits, SelectMenuComponentOptionData } from "discord.js";
import { ClusterManagerOptions } from "discord-hybrid-sharding";

export const token: string = 'ODQyNDI1NjIzNzU0NzAyODY4.G0B47W.AoRtzzrCCTXXYvZggqVanIhDP9EGNzzdatFEd4'
export const debugToken: string = 'MTA3NjY4NTQ5MjE3MjYzNjIxMQ.G5rF9z.MRsJXTYz9fLrA0Lmf-8JtOuweh4yhbjvDLn8EI'

export const mongoUrl: string = 'mongodb://127.0.0.1:27017/niako'
export const debugMongoUrl: string = 'mongodb+srv://heka_project:heka22146@heka.8az8qbm.mongodb.net/test?retryWrites=true&w=majority'

export const owners: { id: string, emoji?: string }[] = [
    { id: '838737416948154418', emoji: '<:NK_DevHollis:1228393718244053130>' },
    { id: '758717520525000794', emoji: '<:NK_DevHeka:1190873285899071508>' },
    { id: '397471853481951262', emoji: '<:NK_DevWeeee:1181902836544585760>' }
]

export const debug: boolean = false

export const lastUpdate = 1711918800
// idk 1703998800
// v1.6 1703365200
// v1.5 1701810000
// v1.4 1698613200
// v1.3 1692887340
// v1.2 1691442000
// v1.1 1688436000
// v1.0 1687467600

export const cluster: ClusterManagerOptions = {
    totalShards: 10,
    shardsPerClusters: 1,
    token: debug ? debugToken : token
}

export const apiUrl = 'https://api.niako.xyz'

export const wsUrl = 'ws://109.107.170.114:3331'

export const intents: number | GatewayIntentBits[] = 131071

export const colors = {
    main: 0x2A6FF2, //0x548FFF, //0x93B8FF, //0x16ff61, //0x00FF4B, //0x5FF760, //0x65de91, //0x00f7cb, //0x00ec84, //0x45ea46, //0x66ff66, //0x33ff33, //0xaaffaa
    premium: 0xFFA917, //0xF86D8F
    discord: 0x2B2D31,
    green: 0x28C76F, //0xA8FE65, //0xc3fe65
    yellow: 0xfdc448, //0xf7f563
    red: 0xEA5455 //0xfe6565
}

export const roles = {
    hasBoosts: '1106863890169593926',
    earlySupport: '1091996586067886130',
    sponsor: '1115182415212707860',
    boosty: {
        '1115182415212707860': 7,
        '1210030502275321956': 7,
        '1210030504708149258': 5,
        '1210030425917890560': 2
    }
}

export const channels = {
    joinGuild: '1264246695726813245',
    leaveGuild: '1264246695726813245'
}

export const logger = {
    colors: {
        green: 0x46B585,
        red: 0xEF494B,
        yellow: 0xFAA61A
    }
}


export const activities: { emoji: string, link: string, name: string }[] = [
    {
        emoji: '<:NK_ActivitieSpotify:1098189848726212709>',
        link: 'https://www.spotify.com/',
        name: 'Spotify'
    },
    {
        emoji: '<:NK_ActivitieVisualStudioCode:1098189851326681220>',
        link: 'https://code.visualstudio.com/',
        name: 'Visual Studio Code'
    }
]

interface IDiscordCustomGame extends SelectMenuComponentOptionData { id: string }

export const games: IDiscordCustomGame[] = [
    { label: 'Putt Party', value: 'puttparty', id: '', description: 'Участников — не более 8' },
    { label: 'YouTube Watch Together', value: 'youtube', id: '', description: 'Неограниченое число участников' },
    { label: 'Gratic Phone', value: 'graticphone', id: '', description: 'Участников — не более 16' },
    { label: 'Know What I Meme', value: 'meme', id: '', description: 'Участников — не более 9' },
    { label: 'Poker Night', value: 'pokernight', id: '', description: 'Участников — не более 7' },
    { label: 'Chess In The Park', value: 'chess', id: '', description: 'Неограниченое число участников' },
    { label: 'Bobble League', value: 'bobbleleague', id: '', description: 'Участников — не более 8' },
    { label: 'Land-io', value: 'landio', id: '', description: 'Участников — не более 16' },
    { label: 'Sketch Heads', value: 'sketchheads', id: '', description: 'Участников — не более 8' },
    { label: 'Blazing 8s', value: 'blazing', id: '', description: 'Участников — не более 8' },
    { label: 'SpellCast', value: 'spellcast', id: '', description: 'Участников — не более 6' },
    { label: 'Checkers In The Park', value: 'checkers', id: '', description: 'Неограниченое число участников' },
    { label: 'Leter League', value: 'lettertile', id: '', description: 'Участников — не более 8' }
]

export const meta = {
    minDepositAmount: 50,
    supportUrl: 'https://discord.gg/wA3Mmsvmcm',
    supportGuildId: '976118601348153414',
    line: 'https://cdn.discordapp.com/attachments/1094082789164462160/1094087427175481344/BannerSpace.png',
    pack: 'https://cdn.discordapp.com/attachments/1094082789164462160/1113115220714471504/BannerShop.png',
    error: 'https://cdn.discordapp.com/attachments/1094082789164462160/1113654247339339826/Error.png',
    lines: {
        'Default': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125650453692458/LineMain.png',
        'Pink': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125650701160478/LinePink.png',
        'Blue': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125649912647850/LineBlue.png',
        'Red': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125651191894108/LineRed.png',
        'Purple': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125650965397585/LinePurple.png',
        'Green': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125650218819624/LineGreen.png',
        'Yellow': 'https://cdn.discordapp.com/attachments/1094082789164462160/1107125651414196396/LineYellow.png'
    },
    musicIcon: 'https://cdn.discordapp.com/emojis/1112315116659167292.gif?size=128'
}