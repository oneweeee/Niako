import { createCanvas } from "canvas";
import ImageManager from "./managers/ImageManager";
import FontManager from "./managers/FontManager";
import PackManager from "./managers/PackManager";
import CanvasUtil from "./CanvasUtil";
import Client from "../client/Client";
import moment from 'moment-timezone';

export default class CanvasClient extends CanvasUtil {
    constructor(
        client: Client
    ) {
        super(client)
    }

    public images = new ImageManager(this)
    public fonts = new FontManager(this)
    public packs = new PackManager(this)
    
    async init() {
        this.images.init()
        this.fonts.init()
    }

    async drawBanner() {
        const canvas = createCanvas(960, 540)
        const ctx = canvas.getContext('2d')

        const background = await this.loadImage('canvasCache.Banner2')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        ctx.font = '42px "Montserrat"'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        const res = await fetch(`${this.client.config.webUrl}/public/stats`)
        .then(async (res) => await res.json()).catch(() => ({ totalGuilds: 0, totalMembers: 0 })) as {
            totalGuilds: number,
            totalMembers: number
        }

        ctx.fillText(String(this.client.util.resolveNumber(res.totalGuilds)), 349, 288)
        ctx.fillText(String(this.client.util.resolveNumber(res.totalMembers)), 617, 288)

        return canvas.toBuffer()
    }

    async drawDefaultBanner() {
        const background = await this.loadImage('canvasCache.DefaultBanner')
        const canvas = createCanvas(background.width, background.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        ctx.font = '96px "Gilroy SemiBold"'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        
        const res = await fetch(`${this.client.config.webUrl}/public/stats`)
        .then(async (res) => await res.json()).catch(() => ({ totalGuilds: 0, totalMembers: 0 })) as {
            totalGuilds: number,
            totalMembers: number
        }

        ctx.fillText(String(this.client.util.resolveNumber(res.totalGuilds)), 416, 514)
        ctx.fillText(String(this.client.util.resolveNumber(res.totalMembers)), 1004, 514)

        return canvas.toBuffer()
    }

    async drawNewYearBanner() {
        const canvas = createCanvas(960, 540)
        const ctx = canvas.getContext('2d')

        const year = moment(Date.now()).tz(`Europe/Moscow`).locale('ru-RU').format('YYYY')

        const background = await this.loadImage(`canvasCache.${year === '2023' ? 'SoonNewYear' : 'NewYear'}`)
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        ctx.font = '48px "Gilroy SemiBold"'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'start'
        ctx.textBaseline = 'top'

        const res = await fetch(`${this.client.config.webUrl}/public/stats`)
        .then(async (res) => await res.json()).catch(() => ({ totalGuilds: 0, totalMembers: 0 })) as {
            totalGuilds: number,
            totalMembers: number
        }

        ctx.fillText(String(this.client.util.resolveNumber(res.totalGuilds)), 210, 256)
        ctx.fillText(String(this.client.util.resolveNumber(res.totalMembers)), 504, 256)

        return canvas.toBuffer()
    }
}