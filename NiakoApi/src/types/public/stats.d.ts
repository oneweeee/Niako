export interface IStatsAnswer {
    totalGuilds: number,
    totalMembers: number,
    clusters: IShardStats[]
}

export type IShardState = 'Connect' | 'Disconnect' | 'Starting'

export interface IShardStats {
    clusterId: number,
    shards: string[],
    guildCount: number,
    memberCount: number,
    ping: number,
    state: IShardState,
    lastUpdate: number
}

export interface IShardRequestRecord {
    clusterId: number,
    shards: string[],
    guildCount: string,
    memberCount: string,
    ping: string
}