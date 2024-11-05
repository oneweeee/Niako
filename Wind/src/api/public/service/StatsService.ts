type TClusterState = 'Connect' | 'Starting' | 'Disconnect'

export default class StatsService {
    private stats: {
        totalGuilds: number, totalUsers: number, clusters: {
            id: number, shards: any[], ping: number, guildCount: number, memberCount: number,
            state: TClusterState, lastUpdate: number
        }[]
    } = { totalGuilds: 0, totalUsers: 0, clusters: [] }

    constructor() {
        setInterval(() => {
            this.stats.clusters.filter((c) => (c.lastUpdate + 90000) > Date.now()).map((c) => this.disconnectCluster(c.id))
            this.autoResolveTotal()
        }, 180_000)
    }

    get() {
        return this.stats
    }

    postCluster(id: number) {
        const get = this.stats.clusters.find((c) => c.id === id)
        if(get) {
            get.state = 'Starting'
            get.lastUpdate = Date.now()
            return get
        } else {
            return this.stats.clusters.push(this.createCluster(id))
        }
    }

    putCluster(body: { id: number, shards?: any[], guildCount?: number, memberCount?: number, ping?: number }) {
        const get = this.getCluster(body.id)
        if(!get) return get

        get.shards = (body?.shards || get?.shards)
        get.guildCount = (body?.guildCount || get?.guildCount)
        get.memberCount = (body?.memberCount || get?.memberCount)
        get.ping = (body?.ping || get?.ping)
        get.state = 'Connect'
        get.lastUpdate = Date.now()

        this.autoResolveTotal()
        
        return get
    }

    private autoResolveTotal() {
        this.stats.totalGuilds = this.stats.clusters.reduce((n, c) => n + c.guildCount, 0)
        this.stats.totalUsers = this.stats.clusters.reduce((n, c) => n + c.memberCount, 0)
        return this.stats
    }

    private disconnectCluster(id: number) {
        const get = this.getCluster(id)
        if(!get) return get

        get.ping = -1
        get.guildCount = 0
        get.memberCount = 0
        get.state = 'Disconnect'

        return get
    }

    private getCluster(id: number) {
        return this.stats.clusters.find((c) => c.id === id) || null
    }

    private createCluster(id: number) {
        return {
            id, shards: [], guildCount: 0, memberCount: 0,
            ping: 0, state: 'Starting' as TClusterState, lastUpdate: Date.now()
        }
    }
}