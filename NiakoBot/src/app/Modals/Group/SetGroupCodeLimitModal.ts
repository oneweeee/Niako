import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'setLimitCodeUseModalWindow',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const res = await client.db.modules.group.get(modal.guildId)
        
        const limit = modal.fields.getTextInputValue('limit')
        const group = await client.db.groups.getMessage(modal.message!.id)
        if(!group) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Установить лимит использований',
                        `Группа с **таким** кодом **не** была найдена`
                    )
                    .setColor(res.color)
                ]
            })
        }

        if(client.util.isNumber(limit, { minChecked: 1, maxChecked: 1000000 })) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Установить лимит использований',
                        `Укажите **натуральное** числовое значение`
                    )
                    .setColor(res.color)
                ]
            })
        }

        group.limitUse = Math.round(Number(limit))
        await client.db.groups.save(group)

        return modal.editReply({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Установить лимит использований',
                    `Вы **установили** лимит кода группы **${group.name}** на **${Math.round(Number(limit))}**`
                )
                .setColor(res.color)
            ]
        })
    }
)