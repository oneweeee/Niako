import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import { ThreadChannel } from "discord.js";

export default new BaseEvent(
    {
        name: 'threadDelete'
    },
    async (client: NiakoClient, thread: ThreadChannel) => {
        const group = await client.db.groups.getChannel(thread.id)
        if(group) {
            await client.db.groups.remove(group)
        }
    }
)