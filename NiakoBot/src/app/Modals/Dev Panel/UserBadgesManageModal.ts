import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalMessageModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelModalWindow.SelectUserBadgeManage',
    async (client: NiakoClient, modal: ModalMessageModalSubmitInteraction<'cached'>, lang: string) => {
        const userId = modal.fields.getTextInputValue('id')

        const user = await client.util.getUser(userId)
        if(!user) {
            return modal.update({
                embeds: [
                    client.storage.embeds.error(
                        modal.member, 'Управление значками',
                        `Пользователь <@${userId}> с Id **${userId}** не найден`
                    )
                ]
            })
        }
        
        return modal.update({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Управление значками',
                    `В этой панели Вы можете управлять значками <@${userId}>`
                )
            ],
            components: await client.storage.components.editUserBadges(user.id)
        })
    }
)