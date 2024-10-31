import BaseSlashCommand from "../base/BaseSlashCommand";
import { Collection, GuildMember } from "discord.js";
import { NiakoClient } from "../client/NiakoClient";

export default class CooldownManager {
    private readonly cache: Collection<string, Collection<string, number>> = new Collection()

    constructor(
        private client: NiakoClient
    ) {
        setInterval(() => this.autoRemove(), 300_000)
    }

    private autoRemove() {
        this.cache.map((guild, guildId) => {
            if(guild.size === 0) this.cache.delete(guildId)

            guild.map((num, key) => {
                if(Date.now() > num) {
                    this.cache.delete(key)
                }
            })
        })
    }

    add(member: GuildMember, command: BaseSlashCommand) {
        if(this.client.config.owners.map((o) => o.id).includes(member.id)) return
        
        if(!this.cache.has(member.guild.id)) {
            this.cache.set(member.guild.id, new Collection())
        }

        this.cache.get(member.guild.id)!.set(`${member.id}.${command.name}`, Math.round(Date.now() + (command.options?.cooldown || 0) * 1000))
    }

    get(member: GuildMember, commandName: string) {
        if(this.client.config.owners.map((o) => o.id).includes(member.id)) return
        
        const guild = this.cache.get(member.guild.id)
        if(!guild) return 0

        const time = guild.get(`${member.id}.${commandName}`)
        if(!time) return 0

        return time
    }
}