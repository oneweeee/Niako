import { GuildMember } from "discord.js";
import Client from "../../../struct/client/Client";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'guildMemberAdd'
    },
    async (client: Client, member: GuildMember) => {
        //await member.roles.add(client.config.meta.verified['RU']).catch(() => {})

        const doc = await client.db.role.get(member.guild.id, member.id)
        const array = doc.roles.filter((id) => !client.config.ignoreRoles.includes(id))
        if(array.length > 1) {
            for ( let i = 0; Array.length > i; i++ ) {
                const id = array[i]
                if(!member.roles.cache.has(id)) {
                    await member.roles.add(id).catch(() => {})
                }
            }
        }
    }
)