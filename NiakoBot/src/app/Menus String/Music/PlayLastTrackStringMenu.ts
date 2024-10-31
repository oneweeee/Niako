import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { StringSelectMenuInteraction } from "discord.js";

export default new BaseInteraction(
    'lasts.',
    async (client: NiakoClient, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
        await menu.deferReply({ ephemeral: true })

        const resolveBot = client.player.resolveProvider(menu.member)

        if(!resolveBot || resolveBot.id !== menu.customId.split('.')[1]) {
            return menu.editReply({
                embeds: [
                    client.storage.embeds.music(
                        'Это не Ваш плеер!'
                    )
                ]
            })
        }

        const player = client.player.players.get(menu.guildId)
        const queue = await client.db.queues.get(menu.guildId)

        if(!player) {
            await menu.message.delete().catch(() => {})
            return menu.editReply({
                embeds: [
                    client.storage.embeds.music(
                        'Я не нашла плеер...'
                    )
                ]
            })
        }

        const lastTrack = Object.values(queue.lasts).find(t => t.info.uri === menu.values[0])
        if(!lastTrack) {
            return menu.editReply({
                embeds: [
                    client.storage.embeds.music(
                        `Трек не был найден :(`
                        )
                    ]
            }).catch(() => {})
        }

        delete queue.lasts[lastTrack.track]

        queue.tracks.unshift(lastTrack)
        lastTrack.start = Date.now()

        await client.db.queues.save(queue)
        
        player.playTrack({ track: lastTrack.track, options: { noReplace: false }})

        return menu.editReply({
            embeds: [
                client.storage.embeds.music(
                    `Вы вернулись к треку "${lastTrack.info.title}"`
                )
            ]
        })
    }
)