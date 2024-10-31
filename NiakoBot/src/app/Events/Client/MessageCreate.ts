import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import { Message } from "discord.js";

export default new BaseEvent(
    {
        name: 'messageCreate'
    },
    async (client: NiakoClient, message: Message) => {
        if(!message.guild || message?.author?.bot) return

        const res = await client.db.members.get(message.guild.id, message.author.id)
        res.message.all += 1
        res.message.banner += 1
        res.markModified('message')
        await client.db.members.save(res)
    }
)