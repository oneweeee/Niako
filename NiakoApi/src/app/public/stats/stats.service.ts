import { IShardRequestRecord, IShardStats, IStatsAnswer } from "../../../types/public/stats";
import { Injectable } from "@nestjs/common";
import BaseService from "../../../struct/BaseService";

@Injectable()
export class StatsService extends BaseService {
    public stats: IStatsAnswer = {
        totalGuilds: 0,
        totalMembers: 0,
        clusters: []
    }

    constructor() { super(); setInterval(() => this.autoUpdateState(), 90_000) }

    getStats() {
        return this.stats
    }

    private autoUpdateState() {
        const clusters = this.stats.clusters.filter((s) => Date.now() > (s.lastUpdate + 60000))
        if(clusters.length > 0) {
            for ( let i = 0; clusters.length > i; i++ ) {
                if(clusters[i].state === 'Disconnect') {
                    clusters.splice(clusters.indexOf(clusters[i]), 1)
                } else {
                    clusters[i].ping = 0
                    clusters[i].state = 'Disconnect'
                }
            }

            this.updateTotalCount()
        }
    }

    recordActivity(res: IShardStats) {
        const clusterId = this.resolveNumber(res.clusterId, false)
        const get = this.stats.clusters.find((s) => s.clusterId === clusterId)

        if(get) {
            get.state = 'Starting'
            get.lastUpdate = Date.now()
        } else if(clusterId !== -1) {
            this.pushNewShard(res.clusterId, res.shards)
        }
    }

    recordStats(res: IShardRequestRecord) {
        const get = this.stats.clusters.find((s) => s.clusterId === res.clusterId)
        
        if(get) {
            get.state = 'Connect'
            get.shards = res.shards
            get.ping = this.resolveNumber(res.ping)
            get.guildCount = this.resolveNumber(res.guildCount)
            get.memberCount = this.resolveNumber(res.memberCount)
            get.lastUpdate = Date.now()

            this.updateTotalCount()
        } else if(res.clusterId >= 0) {
            this.pushNewShard(res.clusterId, res.shards)
        }
    }

    private pushNewShard(clusterId: number, shards: string[]) {
        this.stats.clusters.push({
            clusterId,
            shards,
            guildCount: 0,
            memberCount: 0,
            ping: -1,
            state: 'Starting',
            lastUpdate: Date.now()
        })
    }

    private updateTotalCount() {
        this.stats.totalGuilds = this.stats.clusters.reduce((i, s) => s.guildCount + i, 0)
        this.stats.totalMembers = this.stats.clusters.reduce((i, s) => s.memberCount + i, 0)
    }

    private resolveNumber(str: any, zero: boolean = true) {
        return isNaN(parseInt(String(str))) ? (zero ? 0 : -1) : parseInt(str)
    }

    private getClusterName(clusterId: any) {
        return (this.clusterNames[String(clusterId)] || 'Unknown')
    }

    private clusterNames = {
        '0': 'Brooklyn',
        '1': 'Medicine',
        '2': 'Tantra',
        '3': 'Captain',
        '4': 'Sorry',
        '5': 'Minor',
        '6': 'Yamakasi',
        '7': 'Utopia',
        '8': 'Marmalade',
        '9': 'Freeman',
        '10': 'Kosandra',
        '11': 'Atlant',
        '12': 'Marlboro',
        '13': 'Bismarck',
        '14': 'Texture',
        '15': 'Force',
        '16': 'Trenchtown',
        '17': 'Angel',
        '18': 'Fantasy',
        '19': 'Saloon',
        '20': 'Silhouette',
        '21': 'Untouchable',
        '22': 'Bounty'
    }
}