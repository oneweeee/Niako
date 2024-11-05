import { Collection, Guild, Invite } from "discord.js"
import WindClient from "#client"

export default class InviteService {
    private readonly cache: Collection<string, Collection<string, number>> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const guilds = this.client.guilds.cache.map((g) => g)
        for ( let i = 0; guilds.length > i; i++ ) {
            await this.updateGuild(guilds[i])
        }
    }

    async updateGuild(guild: Guild) {
        const invites = await guild.invites.fetch().catch(() => null)
        if(invites) {
            const set = this.cache.set(guild.id, new Collection())
            invites.map((i) => set.get(guild.id)!.set(i.code, i.uses || 0))
        }
    }

    async resolveInvite(guild: Guild) {
        const oldResolveInvites = this.cache.get(guild.id)
        if(!oldResolveInvites) return null

        const newResolveInvites = await guild.invites.fetch().catch(() => null)
        if(!newResolveInvites) return null

        const oldInvites = oldResolveInvites.map((v, k) => ({ code: k, uses: v}))
        const newInvites = newResolveInvites.map((i) => i)

        for ( let i = 0; newInvites.length > i; i++) {
            const nvInv = newInvites[i]
            const inv = oldInvites.find((i) => i.code === nvInv.code)
            if(inv && inv?.uses !== nvInv?.uses) {
                oldResolveInvites.set(nvInv.code, (nvInv.uses || 0))
                return inv
            }
        }
    }

    inviteCreate(invite: Invite) {
        if(!invite?.guild) return

        const cl = this.cache.get(invite.guild.id)
        if(!cl) return

        return cl.set(invite.code, (invite.uses || 0))
    }

    inviteDelete(invite: Invite) {
        if(!invite?.guild) return

        const cl = this.cache.get(invite.guild.id)
        if(!cl || !cl.has(invite.code)) return

        return cl.delete(invite.code)
    }
}