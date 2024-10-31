import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'renameGroupModalWindow',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })
        
        const res = await client.db.modules.group.get(modal.guildId)

        const name = modal.fields.getTextInputValue('name')
        const group = await client.db.groups.getMessage(modal.message!.id)
        if(!group) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Переименовать группу',
                        `Группа с **таким** кодом **не** была найдена`
                    )
                    .setColor(res.color)
                ]
            })
        }

        await modal.channel!.edit({ name })

        const oldName = group.name

        group.name = name
        await client.db.groups.save(group)

        return modal.editReply({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Переименовать группу',
                    `Вы **изменили** название группы **${oldName}** на **${name}**`
                )
                .setColor(res.color)
            ]
        })
    }
)