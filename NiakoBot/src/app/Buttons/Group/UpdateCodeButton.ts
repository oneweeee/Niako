import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'updateGroupCode',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.editReply({ content: 'Модуль **групп** выключен на сервере' })
        }

        const group = await client.db.groups.getMessage(button.message.id)
        if(!group) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Обновить код', `Я **не** нашла **группу**`).setColor(doc.color) ]
            })
        }

        if(group.userId !== button.user.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Обновить код', `Вы **не** можете управлять **чужой** группой`).setColor(doc.color) ]
            })
        }

        const limitUse = group.limitUse !== -1

        group.limitUse = -1
        group.code = client.util.key(8).toUpperCase()
        await client.db.groups.save(group)

        return button.editReply({
            embeds: [
                client.storage.embeds.default(button.member, 'Обновить код', `Держите **новый** код приглашения в **Вашу** группу \`${group.code}\``)
                .setFooter(limitUse ? { text: `・Лимит использования был сброшен` } : null).setColor(doc.color)
            ]
        })
    }
)