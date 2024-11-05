console.clear()

import { ClusterManager } from "discord-hybrid-sharding"
import { clusterConfig } from "#config"

const manager = new ClusterManager(
    `${__dirname}/wind.js`,
    clusterConfig
)

manager.spawn()