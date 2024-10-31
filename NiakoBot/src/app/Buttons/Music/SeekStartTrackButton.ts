import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'seekStartTrack',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const player = client.player.players.get(button.guildId)
        const queue = await client.db.queues.get(button.guildId)

        if(!player || (player && !queue.paused && !queue.played) || (queue.tracks.length === 0)) {
            await button.message.delete().catch(() => {})
            return button.reply({
                embeds: [ client.storage.embeds.music('Произошла ошибка. Сообщение было удалено...') ],
                ephemeral: true
            })
        }

        queue.tracks[0].start = Date.now()
        await client.db.queues.save(queue)

        player.seekTo(0)

        return button.update({
            embeds: [ client.storage.embeds.manageSeek(queue) ]
        })
    }
)