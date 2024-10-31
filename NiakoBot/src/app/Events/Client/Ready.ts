import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ActivityType, ChannelType, Guild } from "discord.js";
import BaseEvent from "../../../struct/base/BaseEvent";
//import moment from "moment-timezone";

export default new BaseEvent(
    {
        name: 'ready'
    },
    async (client: NiakoClient) => {
        client.user.setActivity(
            {
                name: `https://niako.xyz/`,
                type: ActivityType.Watching
            }
        )
        
        await client.storage.slashCommands.initGlobalApplicationCommands()
        await client.db.init()

        client.logger.success(`${client.user.tag} is login for cluster #${client.cluster.id+1}`)
        
        //client.voiceManager.initVoiceMemberOnline()
        
        //await client.db.modules.banner.copyright()
        //await client.db.modules.voice.copyright()
        //await client.db.modules.audit.copyright()
        //await client.db.rooms.copyright()

        if(client.config.debug) return

        client.request.init()

        /*if(client.cluster.id === 0) {
            setTimeout(async () => {
                const guilds = ((await client.cluster.broadcastEval(
                    client => client.guilds.cache.map((g) => g)
                )).flat() as Guild[])

                console.log(guilds.sort((a, b) => b.memberCount - a.memberCount).map((g) => (
                    { name: g.name, memberCount: g.memberCount, code: g?.vanityURLCode ? `https://discord.gg/${g.vanityURLCode}` : '...'  }
                )).slice(0, 100))
            }, 180_000)
        }*/

        /*if(client.cluster.id === 0) {
            return client.db.modules.audit.updateTypes()
        }*/

        /*setInterval(() => {
            const time = moment(Date.now()).tz(`Europe/Moscow`).locale('ru-RU').format('HH')
            if(client.hh !== time) {
                client.hh = time
                return client.user.setAvatar(
                    `${__dirname}/../../../../assets/images/Avatar/${time}.png`
                ).catch(() => {})
            }
        }, 300_000)*/
    }
)