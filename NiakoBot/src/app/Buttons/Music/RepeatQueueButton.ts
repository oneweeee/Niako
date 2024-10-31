import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'repeatQueue.',
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

        queue.repeat = 'Queue'
        await client.db.queues.save(queue)

        await button.message.edit({
            embeds: [ client.storage.embeds.player(queue, queue.tracks[0]!) ],
            components: client.storage.components.player(queue, client.user.id)
        })

        return button.editReply({
            embeds: [ client.storage.embeds.music('Вы включили повтор очереди') ]
        })
    }
)