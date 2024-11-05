import { Collection, GuildMember, Message } from "discord.js";
import Client from "../client/Client";

export interface IAntispam {
    id: string,
    content: string,
    createdTimestamp: number,
}

export default class AntispamManager {
    private readonly cache: Collection<string, IAntispam[]> = new Collection()

    constructor(
        private client: Client
    ) {}

    private resolveMember(member: GuildMember) {
        if(this.cache.has(`${member.guild.id}.${member.id}`)) {
            return this.cache.get(`${member.guild.id}.${member.id}`)!
        } else {
            return this.cache.set(`${member.guild.id}.${member.id}`, []).get(`${member.guild.id}.${member.id}`)!
        }
    }

    async resolveLink(message: Message) {
        if(this.client.db.tickets.channels.has(message.channel.id) || message.channelId === '1172531116935225436') return

        const reg = new RegExp(`(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)`)
        if(reg.test(message.content)) {
            const invite = await this.client.fetchInvite(message.content)
            if(invite?.guild?.id !== message.guildId) {
                return message.delete().catch(() => {})
            }
        }
    }

    async send(message: Message) {
        if(message.member!.permissions.has('Administrator')) return

        await this.resolveLink(message)

        const array = this.resolveMember(message.member!)

        if(array.length >= 3) {
            array.shift()
        }

        array.push({ id: message.id, content: message.content, createdTimestamp: Date.now() })

        if(array.length === 3 && 2000 > (array[2].createdTimestamp - array[0].createdTimestamp) && array.some((m) => 16 > m.content.length)) {
            return message.channel.send({ content: `${message.author.toString()} прекрати спамить!` })
            .then(() => {
                array.map(async (m) => {
                    const msg = await message.channel.messages.fetch(m.id).catch(() => null)
                    if(msg && msg.deletable) {
                        return msg.delete().catch(() => {})
                    }
                })
            })
        }
    }
}