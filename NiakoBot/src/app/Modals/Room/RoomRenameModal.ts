import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'manageRoomRenameModalWindow',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const doc = await client.db.modules.voice.get(modal.guildId)
        
        const name = modal.fields.getTextInputValue('name')

        const voice = modal.member.voice?.channel
        if(!voice) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Изменить название канала',
                        `Вы **не** находитесь в **голосовом** канале`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== modal.member.id) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Изменить название канала',
                        `Вы **не** находитесь в **своей** приватной комнате`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        if(res.nameCooldown > Date.now()) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Изменить название канала',
                        `**приватную комнату** ${voice.toString()} можно будет **переименовать** через **<t:${Math.round(res.nameCooldown/1000)}:R>**`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        res.nameCount += 1
        if(res.nameCount >= 2) {
            res.nameCooldown = Date.now() + 60 * 10* 1000
            res.nameCount = 0
        }
        res.name = name.replace('{username}', modal.user.username)
        await client.db.rooms.save(res)

        await voice.setName(name)

        return modal.editReply({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Изменить название канала',
                    `Вы **установили** новое имя для своей **приватной комнаты** ${voice.toString()}`
                )
                .setColor(doc.color)
            ]
        })
    }
)