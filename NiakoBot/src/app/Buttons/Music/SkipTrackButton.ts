import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction, ChannelType } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'forwardTrack.',
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

        const skiping = queue.tracks.shift()
        if(queue.tracks[0]) {
            client.player.resolveLastTracks(queue, skiping)
            queue.tracks[0].start = Date.now()

            player.playTrack({ track: queue.tracks[0].track, options: { noReplace: false } })
            
            await client.db.queues.save(queue)
        } else {
            await client.db.queues.destroy(queue, button.guild)
        }
        
        return button.editReply({
            embeds: [ client.storage.embeds.music(`Вы пропустили проигрываемый трек`) ]
        })
    }
)