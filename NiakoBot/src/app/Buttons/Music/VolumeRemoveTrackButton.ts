import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'volumeRemoveTrack',
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

        if(0.05 >= queue.volume) {
            return button.reply({
                embeds: [ client.storage.embeds.music('Вы не можете сделать ещё тише!') ],
                ephemeral: true
            })
        }

        queue.volume = Number((queue.volume - 0.05).toFixed(2))
        await client.db.queues.save(queue)

        player.setVolume(queue.volume)

        return button.update({
            embeds: [ client.storage.embeds.manageVolume(queue.volume) ]
        })
    }
)