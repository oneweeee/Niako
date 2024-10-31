console.clear()

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import { ClusterManager } from "discord-hybrid-sharding"
import { cluster as clusterConfig } from "./config"

const manager = new ClusterManager(
    `${__dirname}/niako.js`,
    clusterConfig
)

manager.spawn()