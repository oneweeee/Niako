import { Guild, GuildMember, ImageSize, PermissionsBitField, Role, User } from "discord.js";
import { HistoryTypes } from "../../db/history/HistorySchema";
import Client from "./Client";

export default class NiakoUtil {
    constructor(
        private client: Client
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

    getAvatar(member: GuildMember | User, size: ImageSize = 4096) {
        return member.displayAvatarURL({extension: 'png', forceStatic: false, size: size})
    }

    getIcon(icon: Role | Guild, size: ImageSize = 4096) {
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

    isModerator(member: GuildMember) {
        return (member.roles.cache.has(this.client.config.meta.moderatorId) || member.permissions.has('Administrator'))
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

    resolveTicketTag(tag: string) {
        switch(tag) {
            case 'help':
                return 'Помощь'
            case 'bug':
                return 'Баг'
            case 'partner':
                return 'Сотрудничество'
        }
    }

    resolveGuildAfkTimeout(timeout: number) {
        return Math.round(timeout / 60)
    }

    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    arrayRandom(array: any[]) {
        return array[this.random(0, array.length-1)]
    }

    toCode(text: any, code: string = '') {
        return `\`\`\`${code}\n${text}\n\`\`\``
    }

    disconnect(member: GuildMember) {
        return member.voice.disconnect().catch(() => {})
    }

    caseText(text: string, type: 'upper' | 'lower' | 'none' = 'none') {
        switch(type) {
            case 'upper':
                return text.toUpperCase()
            case 'lower':
                return text.toLowerCase()
            case 'none':
                return text
        }
    }

    resolveEditingPermissions(oldPermissions: Readonly<PermissionsBitField>, newPermissions: Readonly<PermissionsBitField>) {
        const resolve: { deny: string[], allow: string[] } = { deny: [], allow: [] }

        oldPermissions.toArray().map((p) => { if(!newPermissions.has(p)) { resolve.deny.push(p) } })
        newPermissions.toArray().map((p) => { if(!oldPermissions.has(p)) { resolve.allow.push(p) } })

        return resolve
    }

    resolveHistoryType(type: HistoryTypes) {
        switch(type) {
            case HistoryTypes.Warn:
                return '⚠️'
            case HistoryTypes.Mute:
                return '🤢'
            case HistoryTypes.Ban:
                return '🤬'
        }
    }

    resolveNumber(num: number) {
        return String(num).split('').reverse()
        .map((v,i) => { if((i+1) % 3 === 0 && num.toString().length-1 !== i) { return ` ${v}` } else { return v }})
        .reverse().join('')
    }
}