import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelModalWindow.AddStar',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const userId = modal.fields.getTextInputValue('userId')
        const count = modal.fields.getTextInputValue('count')

        if(client.util.isNumber(count, { minChecked: 1, maxChecked: 99})) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        modal.member, 'Выдача звёзд',
                        `Указанный аргумент **${count}** не является числом или имеет отрицательное значение`
                    )
                ]
            })
        }

        await client.db.boosts.createMultiple(userId, Number(count))

        return modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    modal.member, 'Выдача звёзд',
                    `Вы **выдали** пользователю <@${userId}> **${count}** ${client.config.emojis.premium.boost}`, true
                )
                .setFooter({ text: `・Количество звёзд ${(await client.db.boosts.filter({ userId })).length}` })
            ]
        })
    }
)