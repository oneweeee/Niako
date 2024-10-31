import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'manageRoomLimitModalWindow',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const doc = await client.db.modules.voice.get(modal.guildId)
        
        const userLimit = modal.fields.getTextInputValue('limit')

        const voice = modal.member.voice?.channel
        if(!voice) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Установить лимит пользователей',
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
                        modal.member, 'Установить лимит пользователей',
                        `Вы **не** находитесь в **своей** приватной комнате`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        if(client.util.isNumber(userLimit, { minChecked: 0, maxChecked: 99 })) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Установить лимит пользователей',
                        `**количество** слотов должно быть **положительным** числом от **0** до **99**`
                    )
                    .setColor(doc.color)
                ]
            })
        }

        res.limit = Number(userLimit)
        await client.db.rooms.save(res)
        await voice.setUserLimit(Number(userLimit))

        return modal.editReply({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Установить лимит пользователей',
                    `Вы **установили** новое количество **слотов** для своей **приватной комнаты** ${voice.toString()}`
                )
                .setColor(doc.color)
            ]
        })
    }
)