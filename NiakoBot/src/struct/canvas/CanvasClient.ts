import { IItemImage, IItemText, TModuleBanner } from "../../db/module_banner/ModuleBannerSchema";
import { Guild, GuildMember, GuildPremiumTier } from "discord.js";
import { TBackup } from "../../db/backups/BackupSchema";
import { NiakoClient } from "../client/NiakoClient";
import ImageManager from "./managers/ImageManager";
import { createCanvas, loadImage } from "canvas";
import FontManager from "./managers/FontManager";
import PackManager from "./managers/PackManager";
import CanvasUtil from "./CanvasUtil";
import ms from "ms";

const GifEncoder = require('gif-encoder-2')
const getGifFrames = require('gif-frames')

export default class CanvasClient extends CanvasUtil {
    constructor(
        client: NiakoClient
    ) {
        super(client)
    }

    public images = new ImageManager(this)
    public fonts = new FontManager(this)
    public packs = new PackManager(this)
    
    async init() {
        this.images.init()
        this.fonts.init()

        setInterval(() => this.startDrawingBannerOnGuilds(), 60_000)
    }

    private async startDrawingBannerOnGuilds() {
        const array = (await this.client.db.modules.banner.array(false, { state: true }))
        .filter(
            (b) => this.client.guilds.cache.has(b.guildId) && ((Date.now() > b.nextUpdate && this.client.db.modules.banner.hasUpdateGuild(b)) || (Date.now() > (b.activeUserLastUpdate+ms(b.activeUserUpdated))))
        ).map(async (doc) => {
            const guild = this.client.guilds.cache.get(doc.guildId)
            if(guild && guild?.premiumTier && this.guildTiers.includes(guild.premiumTier)) {
                const data = await this.drawBanner(guild, doc)
                if(data && data?.buffer) {
                    this.client.db.modules.banner.removeUpdateBanner(doc.guildId)
                    doc.lastUpdate = Date.now()
                    doc.nextUpdate = Math.round(Date.now() + ms(doc.updated))
                    await this.client.db.modules.banner.save(doc)
                    await guild.setBanner(data.buffer).catch(() => {})
                }
            } else {
                doc.state = false
                await this.client.db.modules.banner.save(doc)
            }
        })

        return Promise.all(array)

        /*for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]

            const guild = this.client.guilds.cache.get(doc.guildId)
            if(guild && guild?.premiumTier && this.guildTiers.includes(guild.premiumTier)) {
                const data = await this.drawBanner(guild, doc)
                if(data && data?.buffer) {
                    this.client.db.modules.banner.removeUpdateBanner(doc.guildId)
                    doc.lastUpdate = Date.now()
                    doc.nextUpdate = Math.round(Date.now() + ms(doc.updated))
                    await this.client.db.modules.banner.save(doc)
                    await guild.setBanner(data.buffer).catch(() => {}) // Потом логи сделать
                }
            } else {
                doc.state = false
                await this.client.db.modules.banner.save(doc)
            }
        }*/
    }

    async drawStaticBannerForText(member: GuildMember, doc: TModuleBanner, text: IItemText) {
        const prop = this.proportions[doc.type]

        let background = await this.loadImage(doc.background)
        if(!background) return

        const canvas = createCanvas(prop.width, prop.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        await this.writeGuildText(ctx, doc, text, member)

        return canvas.toBuffer()
    }

    async drawStaticBannerForImage(member: GuildMember, doc: TModuleBanner, image: IItemImage) {
        const prop = this.proportions[doc.type]

        let background = await this.loadImage(doc.background)
        if(!background) return

        const canvas = createCanvas(prop.width, prop.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        await this.drawCustomImage(ctx, image, member)

        return canvas.toBuffer()
    }

    async drawStaticBannerForBackup(member: GuildMember, doc: TModuleBanner, backup: TBackup) {
        const prop = this.proportions[backup.bannerType]

        let background = await this.loadImage(backup.background)
        if(!background) return

        const canvas = createCanvas(prop.width, prop.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        await this.writeGuildTexts(ctx, doc, (backup.items.filter((t) => t.type === 'Text' && !t.disabled) as IItemText[]), member.guild, member)
        await this.drawCustomImages(ctx, (backup.items.filter((t) => ['Image', 'ActiveMemberAvatar'].includes(t.type) && !t.disabled) as IItemImage[]), member.guild, member)

        return canvas.toBuffer()
    }

    async drawChooseFont(font: string) {
        const canvas = createCanvas(900, 300)
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = '#ffffff'
        ctx.font = `32px "${font}"`

        ctx.fillText(
            (
                `+=-_(){}[]&?^:%$;#@"/,.<>!\`` + '\n'
                + `AaBbCcDdEeFfGgHhIiJjKkLlMmNn` + '\n'
                + `OoPpQqRrSsTtUuVvWwXxYyZz` + '\n'
                + `АаБбВвГгДдЕеЁёЖжЗзИиЙиКкЛлМм` + '\n'
                + `НнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъ` + '\n'
                + `ЫыЬьЭэЮюЯя 1234567890`
            ),
            20, 20, 860
        )

        return canvas.toBuffer()
    }

    async drawBanner(guild: Guild, doc: TModuleBanner): Promise<{ gif: boolean, buffer: Buffer } | undefined> {
        const background = this.checkBackground(doc)

        const format = this.imageFormates.find((f) => background.includes(`.${f}`))
        if((!format && background !== 'Default' && !background.startsWith('canvasCache')) || !background || background.includes('&format=webp')) {
            doc.state = false
            await this.client.db.modules.banner.save(doc)
            
            return this.drawDefaultBanner('Неправильная ссылка на изображение')
        }

        if(Date.now() > (doc.activeUserLastUpdate + ms(doc.activeUserUpdated))) {
            await this.updateActiveMember(guild, doc)
        }

        if(format === 'gif' && guild?.premiumTier === GuildPremiumTier.Tier3 && ([2, 3].includes(this.client.db.boosts.getGuildLevelById(guild.id)) || this.client.db.badges.partners.has(guild.id))) {
            let updated = false
            
            if(doc.type === 'Normal') {
                doc.type = 'Compressed'
                updated = true
            }

            if(doc.updated === '1m') {
                doc.updated = '2m'
                updated = true
            }

            if(updated) {
                await this.client.db.modules.banner.save(doc)
            }

            return this.drawAnimatedBanner(guild, doc, background)
        } else {
            return this.drawStaticBanner(guild, doc, background)
        }
    }

    private async drawDefaultBanner(reason: string) {
        const canvas = createCanvas(540, 300)
        const ctx = canvas.getContext('2d')

        const bg = await this.images.get('BackgroundDefault')
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

        ctx.textAlign = 'center'
        ctx.fillStyle = '#ffffff'
        ctx.textBaseline = 'middle'
        ctx.font = 'bold 22px Arial'

        ctx.fillText(reason, canvas.width / 2, canvas.height / 2, canvas.width)

        return { buffer: canvas.toBuffer(), gif: false }
    }

    async drawStaticBanner(guild: Guild, doc: TModuleBanner, loadBackground: string) {
        const prop = this.proportions[doc.type]

        let background = await this.loadImage(loadBackground)
        if(!background) return

        const canvas = createCanvas(prop.width, prop.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width+1, canvas.height+1)

        const member = await this.client.util.getMember(guild, doc.activeUserId)

        await this.drawCustomImages(ctx, (doc.items.filter((t) => t.type === 'Image' && t?.name === 'Template') as IItemImage[]), guild, member)
        await this.writeGuildTexts(ctx, doc, (doc.items.filter((t) => t.type === 'Text' && !t.disabled) as IItemText[]), guild, member)
        let state = await this.drawCustomImages(ctx, (doc.items.filter((t) => ['Image', 'ActiveMemberAvatar'].includes(t.type) && (t as IItemImage).name !== 'Template' && !t.disabled) as IItemImage[]), guild, member)
        if(!state) return

        return { gif: false, buffer: canvas.toBuffer() }
    }

    private async drawAnimatedBanner(guild: Guild, doc: TModuleBanner, loadBackground: string) {
        let url: string

        try {
            await loadImage(loadBackground)
            url = loadBackground
        } catch {
            return this.drawDefaultBanner('Неизвестная ссылка на изображение')
        }

        const canvas = createCanvas(540, 300)
        const ctx = canvas.getContext('2d')
        
        const member = await this.client.util.getMember(guild, doc.activeUserId)

        await this.drawCustomImages(ctx, (doc.items.filter((t) => t.type === 'Image' && !t.disabled && t?.name === 'Template') as IItemImage[]), guild, member)
        await this.writeGuildTexts(ctx, doc, (doc.items.filter((t) => t.type === 'Text' && !t.disabled) as IItemText[]), guild, member)
        let state = await this.drawCustomImages(ctx, (doc.items.filter((t) => ['Image', 'ActiveMemberAvatar'].includes(t.type) && (t as IItemImage).name !== 'Template' && !t.disabled) as IItemImage[]), guild, member)
        if(!state) return
        
        const animatedCanvas = createCanvas(540, 300)
        const animatedCtx = animatedCanvas.getContext('2d')

        const encoder = new GifEncoder(540, 300)

        const cadrs = this.gifCadrs[this.client.db.badges.partners.has(guild.id) ? 3 :  this.client.db.boosts.getGuildLevelById(guild.id)]
        
        const frames = await getGifFrames(
            {
                url, frames: `0-${cadrs}`,
                outputType: 'canvas',
                cumulative: true
            }
        )

        encoder.start()
        encoder.setRepeat(0)
        encoder.setQuality(10)

        for ( let i = 0; (Number(frames.length) > cadrs ? cadrs : Number(frames.length)) > i; i++ ) {
            const frame = frames[i]

            encoder.setDelay(frame.frameInfo.delay*10)
            
            animatedCtx.drawImage(frame.getImage(), 0, 0, canvas.width+1, canvas.height+1)
            animatedCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height)

            encoder.addFrame(animatedCtx)
        }

        encoder.finish()

        return { gif: true, buffer: encoder.out.getData() as Buffer }
    }

    async drawSupportBanner(type: 'Guilds' | 'Users' | 'Premium') {
        const background = await this.loadImage(`canvasCache.SupportBanner${type}`)
        if(!background) return

        const canvas = createCanvas(960, 540)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, 960, 540)

        ctx.fillStyle = '#ffffff'
        ctx.font = '72px Stolzl'

        const data = await this.client.request.getStats()
                
        switch(type) {
            case 'Guilds':
                if(data) {
                    ctx.fillText(String(data.totalGuilds), 450, 250)
                } else ctx.fillText('Error', 450, 250)
                break
            case 'Users':
                if(data) {
                    ctx.fillText(String(data.totalUsers), 450, 250)
                } else ctx.fillText('Error', 450, 250)
                break
            case 'Premium':
                const premiumSize = await this.client.db.boosts.getUserSize()
                ctx.fillText(String(premiumSize), 450, 250)
                break
        }

        return canvas.toBuffer()
    }
}