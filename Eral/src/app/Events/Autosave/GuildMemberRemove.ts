import { GuildMember } from "discord.js";
import Client from "../../../struct/client/Client";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'guildMemberRemove'
    },
    async (client: Client, member: GuildMember) => {
        const doc = await client.db.role.get(member.guild.id, member.id)
        doc.roles = member.roles.cache.map((r) => r.id)
        await client.db.role.save(doc)
    }
)