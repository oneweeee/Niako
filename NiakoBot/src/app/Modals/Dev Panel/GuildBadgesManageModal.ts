import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalMessageModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelModalWindow.SelectGuildBadgeManage',
    async (client: NiakoClient, modal: ModalMessageModalSubmitInteraction<'cached'>, lang: string) => {
        const guildId = modal.fields.getTextInputValue('id')

        const guild = await client.util.getGuild(guildId)
        if(!guild) {
            return modal.update({
                embeds: [
                    client.storage.embeds.error(
                        modal.member, 'Управление значками',
                        `Сервер с Id **${guildId}** не найден`
                    )
                ]
            })
        }
        
        return modal.update({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Управление значками',
                    `В этой панели Вы можете управлять значками **${guild.name}**`
                )
            ],
            components: await client.storage.components.editGuildBadges(guild.id)
        })
    }
)