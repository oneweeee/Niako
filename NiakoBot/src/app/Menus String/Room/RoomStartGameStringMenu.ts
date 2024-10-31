import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { StringSelectMenuInteraction } from "discord.js";

export default new BaseInteraction(
    'createRoomGame',
    async (client: NiakoClient, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
        await menu.deferReply({ ephemeral: true, fetchReply: true })

        const doc = await client.db.modules.voice.get(menu.guildId)
        
        const voice = menu.member.voice?.channel
        if(!voice) {
            return menu.editReply({
                embeds: [
                    client.storage.embeds.default(
                        menu.member, 'Запустить игру',
                        `Вы **не** находитесь в **голосовом** канале`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        const game = client.config.games.find((g) => g.value === menu.values[0])
        if(!game) {
            return menu.editReply({
                embeds: [
                    client.storage.embeds.default(
                        menu.member, 'Запустить игру',
                        `Я **не** нашла такую **игру** в дискорде...`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        const invite = await client.together.createTogetherCode(voice.id, menu.values[0])

        return menu.editReply({
            embeds: [
                client.storage.embeds.default(
                    menu.member, 'Запустить игру',
                    `нажмите на **кнопку** ниже, чтобы запустить **${game.label}** в ${voice.toString()}`
                )
                .setColor(doc.color)
            ],
            components: client.storage.components.linkActiviteGame(invite.code)
        })
    }
)