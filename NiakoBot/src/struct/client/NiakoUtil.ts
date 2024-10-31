import { IModuleVoice } from "src/db/module_voice/ModuleVoiceSchema";
import { NiakoClient } from "./NiakoClient";
import {
    Channel,
    Guild,
    GuildMember,
    ImageSize,
    InviteGuild,
    MessageCreateOptions,
    PermissionsBitField,
    Role,
    User
} from "discord.js";

export default class NiakoUtil {
    constructor(
        private client: NiakoClient
    ) {}

    getSlashCommand(name: string, search: 'guild' | 'global' | 'all' = 'all') {
        switch(search) {
            case 'all':
                return this.client.storage.slashCommands.cache.get(name)
            /*case 'global':
                return this.client.storage.slashCommands.cache.filter((s) => s.options.global).get(name)
            case 'guild':
                return this.client.storage.slashCommands.cache.filter((s) => !s.options.global).get(name)*/
        }
    }

    getButton(name: string) {
        return (
            this.client.storage.buttons.cache.get(name) ||
            this.client.storage.buttons.cache.find((int) => name.startsWith(int.name))
        )
    }

    getModal(name: string) {
        return (
            this.client.storage.modals.cache.get(name) ||
            this.client.storage.modals.cache.find((int) => name.startsWith(int.name))
        )
    }

    getChannelMenu(name: string) {
        return (
            this.client.storage.channelMenus.cache.get(name) ||
            this.client.storage.channelMenus.cache.find((int) => name.startsWith(int.name))
        )
    }

    getStringMenu(name: string) {
        return (
            this.client.storage.stringMenus.cache.get(name) ||
            this.client.storage.stringMenus.cache.find((int) => name.startsWith(int.name))
        )
    }

    getUserMenu(name: string) {
        return (
            this.client.storage.userMenus.cache.get(name) ||
            this.client.storage.userMenus.cache.find((int) => name.startsWith(int.name))
        )
    }

    async getGuild(id: string) {
        const guilds = await this.client.cluster.broadcastEval(
            (client, c) => client.guilds.cache.get(c.guildId),
            { context: { guildId: id } }
        )

        const guild = (guilds as Guild[]).find((g) => Boolean(g))
        if(guild) return guild
        else return null
    }

    async getUser(id: string) {
        const users = await this.client.cluster.broadcastEval(
            async (client, c) => await client.users.fetch(c.userId, { force: true, cache: true }).catch(() => undefined),
            { context: { userId: id } }
        )

        const user = (users as User[]).find((g) => Boolean(g))
        if(user) return user
        else return null
    }

    async getChannel(id: string, data?: MessageCreateOptions) {
        const channels = await this.client.cluster.broadcastEval(
            async (client, c) => {
                const channel = client.channels.cache.get(c.channelId)
                if(channel) {
                    if(c.data && channel.type === 0) {
                        await channel.send({ ...c.data as MessageCreateOptions })
                    }

                    return channel
                }

                return null
            },
            { context: { channelId: id, data } }
        )

        const channel = (channels as Channel[]).find((g) => Boolean(g))
        if(channel) return channel
        else return null
    }

    async getMember(guild: Guild, id: string) {
        const member = await guild.members.fetch(id).catch(() => { return null })
        return member
    }

    getEmoji(guild: Guild, emoji: string | undefined) {
        return guild.emojis.cache.find(e => `<${e.animated?'a':''}:${e.name}:${e.id}>` === emoji) || null
    }

    async getGuildChannel(guild: Guild, id: string) {
        const channel = await guild.channels.fetch(id, { cache: false }).catch(() => { return undefined })
        return channel
    }

    async getSongs(search: string, source: string = 'sc') {
        if(search.includes('youtube.') || search.includes('yt.')) return null

        const node = this.client.player.getNode()!
        return {
            ...(await node.rest.resolve(
                search.startsWith('https://') ? search : `${source}search:${search}`
            )),
            node: node
        }
    }

    getAvatar(member?: GuildMember | User, size: ImageSize = 4096) {
        if(!member) return null
        return member.displayAvatarURL({extension: 'png', forceStatic: false, size: size})
    }

    getIcon(icon: Role | Guild | InviteGuild, size: ImageSize = 4096) {
        return icon.iconURL({extension: 'png', forceStatic: false, size: size}) || null
    }

    getBanner(guild: Guild | User, size: ImageSize = 4096) {
        return guild.bannerURL({extension: 'png', forceStatic: false, size: size}) || null
    }

    getDiscoverySplash(guild: Guild, size: ImageSize = 4096) {
        return guild.discoverySplashURL({extension: 'png', forceStatic: false, size: size})
    }

    getSplash(guild: Guild, size: ImageSize = 4096) {
        return guild.splashURL({extension: 'png', forceStatic: false, size: size})
    }

    isNumber(el: string, options: { minChecked?: number, maxChecked?: number } = {}) {
        const num = Number(el)
        return (isNaN(num) || (options?.minChecked ? options.minChecked : 0) > num || num > (options?.maxChecked ? options.maxChecked : 0))
    }

    resolveBoostCost(count: number) {
        switch(count) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                return count * 40 - 1
            default:
                const cost = Math.round(count * 40 / 100 * 90 - 1)
                if(!String(cost).endsWith('9')) {
                    return Number(String(cost).substring(0, String(cost).length-1)+'9')
                } else {
                    return cost
                }
        }
    }

    resolveGuildAfkTimeout(timeout: number) {
        return Math.round(timeout / 60)
    }

    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    randomElement<T>(array: T[]) {
        return array[this.random(0, array.length-1)]
    }

    arrayRandom(array: any[]) {
        return array[this.random(0, array.length-1)]
    }

    endElement<T>(array: T[]) {
        return array[array.length-1]
    }

    toCode(text: any, code: string = '') {
        return `\`\`\`${code}\n${text}\n\`\`\``
    }

    disconnect(member: GuildMember) {
        return member.voice.disconnect().catch(() => {})
    }

    caseText(text: string, type: 'upper' | 'lower' | 'none' = 'none') {
        /*switch(type) {
            case 'upper':
                return text.toUpperCase()
            case 'lower':
                return text.toLowerCase()
            case 'none':
                return text
        }*/
        return text
    }

    resolveEditingPermissions(oldPermissions: Readonly<PermissionsBitField>, newPermissions: Readonly<PermissionsBitField>) {
        const resolve: { deny: string[], allow: string[] } = { deny: [], allow: [] }

        oldPermissions.toArray().map((p) => { if(!newPermissions.has(p)) { resolve.deny.push(p) } })
        newPermissions.toArray().map((p) => { if(!oldPermissions.has(p)) { resolve.allow.push(p) } })

        return resolve
    }

    /*resolveSupportBanner() {
        switch(this.client.supportBanner) {
            case 'Guilds':
                this.client.supportBanner = 'Users'
                break
            case 'Users':
                this.client.supportBanner = 'Premium'
                break
            case 'Premium':
                this.client.supportBanner = 'Guilds'
                break
        }

        return this.client.supportBanner
    }*/

    replaceVariable(text: string, options: { moduleVoice?: IModuleVoice, guild?: Guild, member?: GuildMember  } = {}) {
        if(options.guild) {
            text = text.replace(/[$]guildName/g, options.guild.name)
            .replace(/[$]guildId/g, options.guild.id)
        }

        if(options.member) {
            text = text.replace(/[$]username/g, options.member.user.username)
            .replace(/[$]membername/g, options.member.displayName)
            .replace(/[$]guildName/g, options.member.guild.name)
            .replace(/[$]guildId/g, options.member.guild.id)
        }
        
        if(options.moduleVoice) {
            text = text.replace(/[$]emojiRoomRename/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Rename'))
            .replace(/[$]emojiRoomLimit/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Limit'))
            .replace(/[$]emojiRoomKick/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Kick'))
            .replace(/[$]emojiRoomOwner/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Crown'))
            .replace(/[$]emojiRoomReset/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Reset'))
            .replace(/[$]emojiRoomInfo/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Info'))
            .replace(/[$]emojiRoomMute/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Mute'))
            .replace(/[$]emojiRoomUnmute/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Unmute'))
            .replace(/[$]emojiRoomStateMute/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'StateMute'))
            .replace(/[$]emojiRoomLock/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Lock'))
            .replace(/[$]emojiRoomUnlock/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Unlock'))
            .replace(/[$]emojiRoomStateLock/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'StateLock'))
            .replace(/[$]emojiRoomRemoveUser/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'RemoveUser'))
            .replace(/[$]emojiRoomAddUser/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'AddUser'))
            .replace(/[$]emojiRoomStateUser/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'StateUser'))
            .replace(/[$]emojiRoomStateHide/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'StateHide'))
            .replace(/[$]emojiRoomPlusLimit/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'PlusLimit'))
            .replace(/[$]emojiRoomMinusLimit/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'MinusLimit'))
            .replace(/[$]emojiRoomUp/g, this.client.db.modules.voice.getButtonEmoji(options.moduleVoice, 'Up'))
        }

        return text
    }

    razbitNumber(num: number) {
        return String(num).split('').reverse().map((v,i) => { if((i+1) % 3 === 0 && num.toString().length-1 !== i) { return ` ${v}` } else { return v }}).reverse().join('')
    }

    convertOnline(number: number) {
        if(number === 0) {
            return `0 ч, 0 м`
        }

        let s = Math.trunc(number/1000)
        let m = Math.trunc(s / 60)
        s = s - m * 60
        let h = Math.trunc(m / 60)
        m = m - h * 60

        return `${h} ч, ${m} м`
    }

    key(length: number) {
        return `${Math.random().toString(34).slice(5, length+5)}`
    }

    stringResize(str: string, size: number) {
        return str.length > size ? str.substring(0, size) : str
    }
}