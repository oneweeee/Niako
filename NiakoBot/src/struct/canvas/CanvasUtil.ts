import { IItemImage, IItemText, TModuleBanner } from "../../db/module_banner/ModuleBannerSchema";
import { CanvasRenderingContext2D, Image, loadImage } from "canvas";
import { NiakoClient } from "../client/NiakoClient";
import moment from "moment-timezone";
import {
    Collection,
    ChannelType,
    Guild,
    GuildMember,
    GuildPremiumTier,
    AttachmentBuilder,
    ActivityType
} from "discord.js";

export default abstract class CanvasUtil {
    constructor(
        public client: NiakoClient
    ) {}

    public readonly imageFormates: string[] = [ 'png', 'jpg', 'jpeg', 'gif' ]
    public readonly fontFormates: string[] = [ 'ttf', 'otf' ]
    public readonly gifCadrs: { [key: string]: number } = { '0': 1, '1': 1, '2': 40, '3': 80 }

    public readonly customTexts: { text: string, description?: string }[] = [
        { text: '123' }
    ]

    public voiceTypes: ChannelType[] = [ ChannelType.GuildVoice, ChannelType.GuildStageVoice ]

    public guildTiers: GuildPremiumTier[] = [ GuildPremiumTier.Tier2, GuildPremiumTier.Tier3 ]

    public readonly proportions: {
        [key: string]: { width: number, height: number }
    } = { 'Compressed': { width: 540, height: 300 }, 'Normal': { width: 960, height: 540 } }

    public async loadImage(url: string) {
        try {
            if(url.startsWith('canvasCache')) {
                const name = url.split('.')[1]
                return (await this.client.canvas.images.get(name) || await this.client.canvas.images.get('BackgroundDefault'))
            } else {
                return (await loadImage(url))
            }
        } catch (err) {
            return null
            //return (await this.client.canvas.images.get('BackgroundDefault'))
        }
    }

    public async loadImageState(url: string) {
        try {
            await loadImage(url)
            return true
        } catch {
            return false
        }
    }

    fillTextWidth(ctx: CanvasRenderingContext2D, text: string, width: number) {
        const strs = text.split('')
        let txt = ''
        
        for ( let i = 0; strs.length > i; i++ ) {
            if(width >= ctx.measureText(txt + strs[i]).width) {
                txt += strs[i]
            } else {
                if(txt.length >= 4) {
                    return text.substring(0, txt.length-3) + '...'
                } else {
                    return text
                }
            }
        }

        return txt
    }

    public async updateActiveMember(guild: Guild, res: TModuleBanner) {
        const members = await this.client.db.members.filter({ guildId: guild.id })

        this.client.db.modules.banner.addUpdateGuild(guild.id)

        if(members.length > 0) {
            const activeUsers = res.activeType === 'Online' ? members.sort((a, b) => b.online.banner - a.online.banner) : members.sort((a, b) => b.message.banner - a.message.banner)
            const firstActiveUser = activeUsers[0]
            const someMembers = res.activeType === 'Online' ? activeUsers.filter((m) => m.online.banner === firstActiveUser.online.banner) : activeUsers.filter((m) => m.message.banner === firstActiveUser.message.banner)
            const findActiveUser = this.client.util.randomElement(someMembers)
    
            if(findActiveUser && (res.activeType === 'Online' ? findActiveUser.online.banner !== 0 : findActiveUser.message.banner !== 0)) {
                res.activeUserId = findActiveUser.userId
            }
        }

        if(res.activeUserId === '0') {
            res.activeUserId = guild.ownerId
        }

        for ( let i = 0; members.length > i; i++ ) {
            members[i].online.banner = 0
            members[i].message.banner = 0
            members[i].markModified('online')
            members[i].markModified('message')
            await this.client.db.members.save(members[i]).catch(() => {})
        }

        res.activeUserStatus = res.status
        res.activeUserLastUpdate = Date.now()
        await this.client.db.modules.banner.save(res)
    }

    public swicthText(guild: Guild, doc: TModuleBanner, text: IItemText, activeMember: GuildMember | null): string {
        switch(text.textType) {
            case 'UserCount':
                return String(guild.memberCount)
            case 'BotCount':
                return String(guild.members.cache.filter((m) => m.user.bot).size)
            case 'MemberCount':
                return String(guild.memberCount - guild.members.cache.filter((m) => m.user.bot).size)
            case 'VoiceOnline':
                const size = guild.channels.cache.filter((c) => this.voiceTypes.includes(c.type))
                .reduce((count, v) => count + (v.members as Collection<string, GuildMember>).size, 0)
                return String(size)
            case 'Time':
                return moment(Date.now()).tz(`Etc/${text.timezone}`).locale('ru-RU').format('HH:mm')
            case 'BoostCount':
                return String(guild.premiumSubscriptionCount)
            case 'BoostTier':
                return String(this.swicthGuildTier(guild.premiumTier))
            case 'ActiveMemberDiscriminator':
                if(activeMember && activeMember?.user) {
                    return activeMember.user.discriminator
                } else {
                    return '0000'
                }
            case 'ActiveMemberTag':
                if(activeMember && activeMember?.user) {
                    return activeMember.user.tag
                } else {
                    return 'Invalid#0000'
                }
            case 'ActiveMemberUsername':
                if(activeMember && activeMember?.user) {
                    return activeMember.user.username
                } else {
                    return 'Invalid'
                }
            case 'ActiveMemberNickname':
                if(activeMember && activeMember?.user) {
                    if(activeMember.user?.globalName) {
                        return activeMember.user.globalName
                    } else {
                        return activeMember.user.username
                    }
                } else {
                    return 'Invalid'
                }
            case 'ActiveMemberStatus':
                if(activeMember && activeMember?.user && activeMember?.presence && activeMember.presence?.activities) {
                    const status = (activeMember.presence.activities || []).find((a) => a.type === ActivityType.Custom)
                    if(status) {
                        return (status.state ?? doc.status)
                    } else {
                        return doc.status
                    }
                } else {
                    return doc.status
                }
            case 'RoleMembers':
                if(text?.roleId && guild.roles.cache.has(text.roleId)) {
                    return String(
                        guild.roles.cache.get(text.roleId)!.members.size
                    )
                } else {
                    return '0'
                }
            case 'Default':
                return text.text
        }
    }

    async writeGuildText(ctx: CanvasRenderingContext2D, doc: TModuleBanner, text: IItemText, member: GuildMember) {
        ctx.textBaseline = text.baseline
        ctx.textAlign = text.align
        ctx.fillStyle = text.color
        ctx.font = `${text.size}px "${text.font}"`

        if(text.angle !== 'None') {
            ctx.save()
            ctx.translate(text.x, text.y)
            ctx.rotate(Math.PI * 2 / 360 * text.angle);
            ctx.translate(-text.x, -text.y)
        }

        const resolveText = this.swicthText(member.guild, doc, text, member)
        //resolveText.substring(0, text.length === 'None' ? resolveText.length : text.length),
        if(text.width === 'None') {
            ctx.fillText(resolveText, text.x, text.y)
        } else {
            ctx.fillText(this.fillTextWidth(ctx, resolveText, text.width), text.x, text.y, text.width)
        }
        
        if(text.angle !== 'None') {
            ctx.restore()
        }
    }

    async writeGuildTexts(ctx: CanvasRenderingContext2D, doc: TModuleBanner, texts: IItemText[], guild: Guild, member: GuildMember | null) {
        for ( let i = 0; texts.length > i; i++ ) {
            const text = texts[i]

            ctx.textBaseline = text.baseline
            ctx.textAlign = text.align
            ctx.fillStyle = text.color

            ctx.font = `${text.size}px "${text.font}"`

            if(text.angle !== 0 && text.angle !== 'None') {
                ctx.save()
                ctx.translate(text.x, text.y)
                ctx.rotate(Math.PI * 2 / 360 * text.angle);
                ctx.translate(-text.x, -text.y)
            }

            let resolveText = this.swicthText(guild, doc, text, member)
            if(text?.isRazbit && !isNaN(parseInt(resolveText))) {
                resolveText = this.client.util.razbitNumber(parseInt(resolveText))
            }
            //resolveText.substring(0, text.length === 'None' ? resolveText.length : text.length),
            if(text?.width !== 'None') {
                ctx.fillText(this.fillTextWidth(ctx, resolveText, text.width), text.x, text.y, text.width)
            } else {
                ctx.fillText(resolveText, text.x, text.y)
            }

            if(text.angle !== 0 && text.angle !== 'None') {
                ctx.restore()
            }
        }
    }

    async drawCustomImages(ctx: CanvasRenderingContext2D, images: IItemImage[], guild: Guild, member: GuildMember | null) {
        let isLoad: boolean = true       
        for ( let i = 0; images.length > i; i++ ) {
            const img = images[i]

            try {
                let load: Image | null = null
                
                if(img.type === 'Image') {
                    load = (await this.loadImage(img.url))
                } else {
                    if(member && member?.user) {
                        load = (await this.loadImage(this.client.util.getAvatar(member, 1024)!))
                    } else {
                        load = await this.client.canvas.images.get('DefaultAvatar')
                    }
                }

                if(!load) {
                    isLoad = false
                }

                if(load) {
                    ctx.save()
                    ctx.beginPath()
    
                    if(img.shape) {
                        ctx.arc(img.x+(img.width/2), img.y+(img.width/2), (img.width/100*img.radius)/2, 0, Math.PI*2)
                        ctx.clip()
                    }
    
                    ctx.drawImage(load, img.x, img.y, img.width, img.height)
                    ctx.closePath()
                    ctx.restore()
                }
            } catch {}
        }

        return isLoad
    }

    async drawCustomImage(ctx: CanvasRenderingContext2D, image: IItemImage, member: GuildMember) {
        try {
            let load: Image | null = null
            
            if(image.type === 'Image') {
                load = (await this.loadImage(image.url))
            } else {
                if(member && member?.user) {
                    load = (await this.loadImage(this.client.util.getAvatar(member, 1024)!))
                } else {
                    load = await this.client.canvas.images.get('DefaultAvatar')
                }
            }

            if(load) {
                ctx.save()
                ctx.beginPath()

                if(image.shape) {
                    ctx.arc(image.x+(image.width/2), image.y+(image.width/2), (image.width/100*image.radius)/2, 0, Math.PI*2)
                    ctx.clip()
                }

                ctx.drawImage(load, image.x, image.y, image.width, image.height)
                ctx.closePath()
                ctx.restore()
            }
        } catch {}
    }

    backgroundAdaptation(imgWidth: number, imgHeight: number, width: number, height: number) {
        const obj = { height, width, x: 0, y: 0 }

        if(imgWidth > width) {
            obj.x = (imgWidth - width) / 2 - imgWidth
            obj.width = imgWidth
        }

        if(imgHeight > height) {
            obj.y = (imgHeight - height) / 2 - imgHeight
            obj.height = imgHeight
        }

        return obj
    }

    swicthGuildTier(tier: GuildPremiumTier | null) {
        switch(tier) {
            case GuildPremiumTier.Tier1:
                return 1
            case GuildPremiumTier.Tier2:
                return 2
            case GuildPremiumTier.Tier3:
                return 3
            default:
                return 0
        }
    }

    public attachment(buffer: Buffer, gif: boolean, options: { name?: string } = {}) {
        const att = new AttachmentBuilder(buffer, { name: `${options?.name || 'file'}.${gif?'gif':'png'}` })

        return att
    }

    public checkBackground(doc: TModuleBanner) {
        const hh = moment(Date.now()).tz(`Etc/${doc.timezone}`).locale('ru-RU').format('HH')
        const background = (doc?.backgrounds && typeof doc.backgrounds[`${hh}:00`] === 'string' ? doc.backgrounds[`${hh}:00`] : doc.background)
        return background
    }
}