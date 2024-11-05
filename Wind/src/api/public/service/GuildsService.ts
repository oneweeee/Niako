export default class GuildsService {
    private data: {
        totalGuilds: number, totalUsers: number, guilds: any[]
    } = { totalGuilds: 0, totalUsers: 0, guilds: [] }

    get() {
        return this.data
    }

    post(body: any[]) {
        this.data.totalGuilds = body.length
        this.data.totalUsers = body.reduce((n: number, g: any) => n + g.memberCount, 0)
        const topGuilds = body.sort((a: any, b: any) => b.memberCount - a.memberCount).slice(0, body.length > 16 ? 16 : body.length)
        this.data.guilds = topGuilds
        return this.data
    }
}