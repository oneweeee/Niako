import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { StringSelectMenuInteraction } from "discord.js";

export default new BaseInteraction(
    'bass.',
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

        const levels = {
            'none': 0.0,
            'low': 0.20,
            'medium': 0.35,
            'high': 0.50,
        }

        queue.filter = menu.values[0] === 'none' ? '' : menu.values[0]
        await client.db.queues.save(queue)

        await menu.message.edit({
            embeds: [
                client.storage.embeds.player(queue, queue.tracks[0])
            ],
            components: client.storage.components.player(queue, client.user.id)
        })

        player.setEqualizer(
            menu.values.includes('none') ? [] : [
                { band: 0, gain: levels[menu.values[0] as 'none'] },
                { band: 1, gain: levels[menu.values[0] as 'none'] },
                { band: 2, gain: levels[menu.values[0] as 'none'] },
                { band: 3, gain: levels[menu.values[0] as 'none'] }
            ]
        )

        return menu.editReply({
            embeds: [
                client.storage.embeds.music(
                    menu.values.includes('none') ? 'Вы очистили фильтр басса'
                    : menu.values[0] === 'low' ? 'Вы включили минимальный басс буст'
                    : menu.values[0] === 'medium' ? 'Вы включили средний басс буст'
                    : 'Вы включили высокий басс буст'
                )
            ]
        })
    }
)