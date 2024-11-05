import { TAccount } from "#db/accounts/AccountSchema"
import { Collection } from "discord.js"

export default class GuildService {
    private readonly guilds: Collection<string, string[]> = new Collection()
    private ids: string[] = []

    get() {
        return this.ids
    }

    post(ids: string[]) {
        for ( let i = 0; ids.length > i; i++ ) {
            if(!this.ids.includes(ids[i])) this.ids.push(ids[i])
        }
    }

    put(id: string, state: boolean) {
        if(state) {
            if(!this.ids.includes(id)) {
                return this.ids.push(id)
            }
        } else {
            if(this.ids.includes(id)) {
                return this.ids.splice(this.ids.indexOf(id), 1)
            }
        }
    }

    async getListUserGuilds(access_token: string, jwt_token: string) {
        const userGuilds = await this.getUserGuilds(access_token) as any[]
        if(!userGuilds?.length) return []

        const filtered = userGuilds.filter(
            (g) => g.owner || g.permissions === 2147483647
        ).map((g: any) => ({ ...g, has: this.ids.includes(g.id) }))

        if(filtered.length) {
            this.setUserGuilds(jwt_token, filtered.map((g) => g.id))
        }

        return filtered
    }

    private async getUserGuilds(access_token: string) {
        const res = await fetch('https://discord.com/api/v6/users/@me/guilds', {
            headers: { "Authorization": `Bearer ${access_token}` }
        }).then(async (r) => await r.json()).catch(() => null)

        return !res || res?.message ? [] : res
    }

    setUserGuilds(token: string, guilds: string[]) {
        this.guilds.set(token, guilds)
    }

    async accessedGuild(doc: TAccount, guildId: string) {
        if(this.guilds.has(doc.token)) {
            return (this.guilds.get(doc.token) || []).includes(guildId)
        }

        const guilds = await this.getListUserGuilds(doc.accessToken, doc.token)
        return guilds.map((g) => g.id).includes(guildId)
    }
}