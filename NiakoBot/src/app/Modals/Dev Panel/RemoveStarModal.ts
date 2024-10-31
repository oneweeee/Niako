import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelModalWindow.RemoveStar',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const userId = modal.fields.getTextInputValue('userId')
        const count = modal.fields.getTextInputValue('count')

        const arr = (await client.db.boosts.filter({ userId })).sort((a, b) => Number(b.boosted) - Number(a.boosted))
        
        if(client.util.isNumber(count, { minChecked: 1, maxChecked: arr.length })) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        modal.member, 'Удаление звёзд',
                        `Указанное число **${count}** не является **им** или оно **отрицательного** значения`
                    )
                    .setFooter({ text: `・Сейчас у пользователя ${arr.length} звёзд` })
                ]
            })
        }
        
        for ( let i = 0; Number(count) > i; i++ ) {
            await arr[i].remove()
        }

        return modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    modal.member, 'Удаление звёзд',
                    `Вы **выдали** пользователю <@${userId}> **${count}** ${client.config.emojis.premium.boost}`, true
                )
                .setFooter({ text: `・Количество звёзд ${(await client.db.boosts.filter({ userId })).length}` })
            ]
        })
    }
)