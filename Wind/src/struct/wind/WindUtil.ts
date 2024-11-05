import { ICrashPush } from "#db/crash/CrashSchema"
import WindClient from "struct/WindClient"
import {
    ActivityType,
    Collection,
    Guild,
    GuildMember,
    GuildVerificationLevel,
    ImageSize,
    InviteGuild,
    Locale,
    Message,
    PermissionsBitField,
    Role,
    Snowflake,
    TextChannel,
    User
} from "discord.js"

export default class WindUtil {
    constructor(
        private client: WindClient
    ) {}

    getClusterName(id: number) {
        const k = this.client.services.constants.clusters[String(id) as '1']
        if(k) return k
        else return 'Unknown'
    }

    getSlashCommand(name: string) {
        return this.client.watchers.slashCommands.cache.get(name)
    }

    getMessageCommand(name: string) {
        return this.client.watchers.messageCommands.cache.get(name) || this.client.watchers.messageCommands.cache.find((c) => (c.options?.aliases || []).includes(name))
    }

    getModal(name: string) {
        return this.client.watchers.modals.cache.get(name) || this.client.watchers.modals.cache.find((b) => name.startsWith(b.options.name))
    }

    getButton(name: string) {
        return this.client.watchers.buttons.cache.get(name) || this.client.watchers.buttons.cache.find((b) => name.startsWith(b.options.name))
    }

    getStringSelectMenu(name: string) {
        return this.client.watchers.stringMenus.cache.get(name) || this.client.watchers.stringMenus.cache.find((b) => name.startsWith(b.options.name))
    }

    getAvatar(member?: GuildMember | User, size: ImageSize = 4096, extension: 'png' | 'jpg' | 'gif' = 'png') {
        if(!member) return null
        return member.displayAvatarURL({ extension, size, forceStatic: false })
    }

    getIcon(icon: Role | Guild | InviteGuild, size: ImageSize = 4096) {
        return icon.iconURL({ extension: 'png', forceStatic: false, size: size}) || null
    }

    getBanner(guild: Guild | User, size: ImageSize = 4096, extension: 'png' | 'jpg' | 'gif' = 'png') {
        return guild.bannerURL({ extension, size, forceStatic: false }) || null
    }

    getDiscoverySplash(guild: Guild, size: ImageSize = 4096) {
        return guild.discoverySplashURL({ extension: 'png', forceStatic: false, size: size})
    }

    getSplash(guild: Guild, size: ImageSize = 4096) {
        return guild.splashURL({ extension: 'png', forceStatic: false, size: size})
    }

    getMaxPage(array: any[], count: number) {
        return Math.ceil(array.length/count) === 0 ? 1 : Math.ceil(array.length/count)
    }

    getVerify(type: GuildVerificationLevel, locale: Locale) {
        switch(type) {
            case GuildVerificationLevel.Low:
                return `${this.client.services.lang.get("commands.serverinfo.verify_low", locale)}`
            case GuildVerificationLevel.Medium:
                return `${this.client.services.lang.get("commands.serverinfo.verify_medium", locale)}`
            case GuildVerificationLevel.High:
                return `${this.client.services.lang.get("commands.serverinfo.verify_high", locale)}`
            case GuildVerificationLevel.VeryHigh:
                return `${this.client.services.lang.get("commands.serverinfo.verify_very_high", locale)}`
            default:
                return `${this.client.services.lang.get("commands.serverinfo.missings", locale)}`
        }
    }

    getCategory(cat: string, locale: Locale) {
        switch(cat) {
            case 'info':
                return `${this.client.services.lang.get("commands.help.category.information", locale)}`
            case 'mod':
                return `${this.client.services.lang.get("commands.help.category.moderation", locale)}`
            case 'settings':
                return `${this.client.services.lang.get("commands.help.category.settings", locale)}`
            case 'music':
                return `${this.client.services.lang.get("commands.help.category.music", locale)}`
            default:
                return cat
        }
    }

    getSpotify(member: GuildMember) {
        if(!member?.presence) return undefined

        const act = member.presence.activities.find((a) => a.type === ActivityType.Listening && a.name === 'Spotify')
        return act ? `${act.state} - ${act.details}` : act
    }

    isNumber(el: string, options: { min?: number, max?: number } = {}) {
        const num = Number(el)
        return (!isNaN(num) || num > (options?.min || 0) || (options?.max || Infinity) > num)
    }

    isColor(color: string) {
        return color.startsWith('#') && color.length === 7 && this.match(/#[0-9A-Fa-f]{6}/g, color)
    }

    isWord(str: string) {
        return str.toUpperCase() !== str.toLowerCase()
    }

    hasRole(member: GuildMember, roles: Snowflake[]) {
        return member.roles.cache.some((r) => roles.includes(r.id))
    }

    async removeRoles(member: GuildMember, ids: string[]) {
        return member.roles.set([]).catch(() => {})
        /*for (const id of ids) {
            await member.roles.remove(id).catch(() => {})
        }*/
    }

    async addRoles(member: GuildMember, ids: string[]) {
        for (const id of ids) {
            await member.roles.add(id).catch(() => {})
        }
    }

    razbitNumber(num: number) {
        return String(num).split('').reverse().map((v,i) => { if((i+1) % 3 === 0 && num.toString().length-1 !== i) { return ` ${v}` } else { return v }}).reverse().join('')
    }

    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    randomElement<T>(array: T[]) {
        return array[this.random(0, array.length-1)]
    }

    endElement<T>(array: T[]) {
        return array[array.length-1]
    }

    toCode(text: any, code: string = '') {
        return `\`\`\`${code}\n${text}\n\`\`\``
    }

    getMessageReplyOptions() {
        return { allowedMentions: { repliedUser: false } }
    }

    async getMember(guild: Guild, id: string) {
        return (await guild.members.fetch(id).catch(() => null))
    }

    parseJSON(str: string): any | null {
        try {
            return JSON.parse(str)
        } catch {
            return null
        }
    }

    match(regexp: RegExp, test: string) {
        return new RegExp(regexp).test(test)
    }

    resolveString(str: string, length: number) {
        return str.length > length ? str.substring(0, length-3) + '...' : str
    }

    resolveEditingPermissions(oldPermissions: Readonly<PermissionsBitField>, newPermissions: Readonly<PermissionsBitField>) {
        const resolve: { deny: string[], allow: string[] } = { deny: [], allow: [] }

        oldPermissions.toArray().map((p) => { if(!newPermissions.has(p)) { resolve.deny.push(p) } })
        newPermissions.toArray().map((p) => { if(!oldPermissions.has(p)) { resolve.allow.push(p) } })

        return resolve
    }

    resolvePushType(type: ICrashPush, locale: Locale) {
        switch(type) {
            case 'Ban':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.punishments.ban", locale)}`
            case 'Kick':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.punishments.kick", locale)}`
            case 'Lockdown':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.punishments.quarantine", locale)}`
            case 'Warn':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.punishments.warn", locale)}`
            case 'None':
                return `${this.client.services.lang.get("commands.antinuke.anticrash.punishments.nothing", locale)}`
            default:
                return type
        }
    }

    getPingEmoji(ping: number) {
        if(ping >= 100) {
            return this.client.emoji.ping.disconnect
        } else if(40 > ping) {
            return this.client.emoji.ping.connect
        } else {
            return this.client.emoji.ping.starting
        }
    }

    async fetchMessages(channel: TextChannel, options: { limit: number, lastId: string, users?: Set<string>, date?: number }) {
        let messages = new Collection<string, Message<true>>()
        let scaned = 0
        let oldfetched = 0
        let lastId = options.lastId
        if(options.limit > 1000) options.limit = 1000

        while (options.limit > scaned) {
            let fetchedMessages = (await channel.messages.fetch({ limit: 100, cache: true, around: lastId })).filter(
                (msg) => msg.createdTimestamp > (Date.now() - 14*24*60*60*1000) && ![options.lastId, lastId].includes(msg.id)
            ).sort((a, b) => b.createdTimestamp - a.createdTimestamp)

            if ((oldfetched !== 100 && ((fetchedMessages.size-1 === oldfetched && messages.size !== 0) || oldfetched === fetchedMessages.size)) || scaned === 1000 || fetchedMessages.size === 0 || (options.limit && (messages.size >= options.limit))) {
                if (options?.users && options.users!.size > 0) {
                    messages = messages.filter(msg => options.users!.has(msg.author.id))
                }

                if(messages.size > options.limit) {
                    while(messages.size > options.limit) {
                         messages.delete(messages.lastKey()!)
                    }
               }

                return messages
            }

            lastId = fetchedMessages.lastKey()!
            oldfetched = fetchedMessages.size
            messages = messages.concat(fetchedMessages)
            scaned = messages.size
        }

        if(messages.size > options.limit) {
            while(messages.size > options.limit) {
                messages.delete(messages.lastKey()!)
            }
        }

        return messages
    }

    barDraw(active: number, all: number, size: number = 10) {
        const fullBar = [
            this.client.emoji.music.progess.move.start,
            ...new Array(size-2).fill(null).map(() => this.client.emoji.music.progess.move.full),
            this.client.emoji.music.progess.move.end
        ]
        const emptyBar = [
            this.client.emoji.music.progess.start,
            ...new Array(size-2).fill(null).map(() => this.client.emoji.music.progess.full),
            this.client.emoji.music.progess.end
        ]

        let res = ''
        for ( let i = 0; i < fullBar.length; i++) {
            if(Math.trunc(active/all*size) >= i+1) {
                res += fullBar[i]
            } else {
                res += emptyBar[i]
            }
        }
        
        return res
    }

    isActionTime(str: string) {
        return this.regexp.actionTime.test(str)
    }

    public readonly regexp = {
        actionTime: new RegExp(/([0-9-0]*)([yMwdms])+$/)
    }
}