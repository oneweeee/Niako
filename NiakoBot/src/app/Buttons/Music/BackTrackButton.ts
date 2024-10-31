import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'backTrack.',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        const resolveBot = client.player.resolveProvider(button.member)

        if(!resolveBot || resolveBot.id !== button.customId.split('.')[1]) {
            return button.editReply({
                embeds: [ client.storage.embeds.music('Это не Ваш плеер!') ]
            })
        }

        const player = client.player.players.get(button.guildId)
        const queue = await client.db.queues.get(button.guildId)

        if(!player || (player && !queue.paused && !queue.played) || (queue.tracks.length === 0)) {
            await button.message.delete().catch(() => {})
            return button.editReply({
                embeds: [ client.storage.embeds.music('Произошла ошибка. Сообщение было удалено...') ]
            })
        }

        const lastTrack = Object.values(queue.lasts)[0]
        if(!lastTrack) {
            return button.editReply({
                embeds: [ client.storage.embeds.music('Трек не был найден :(') ]
            })
        }
        
        delete queue.lasts[lastTrack.track]
        lastTrack.start = Date.now()
        queue.tracks.unshift(lastTrack)

        await client.db.queues.save(queue)

        player.playTrack({ track: lastTrack.track, options: { noReplace: false } })

        return button.editReply({
            embeds: [ client.storage.embeds.music(`Вы вернулись к треку "${lastTrack.info.title}"`) ]
        })
    }
)