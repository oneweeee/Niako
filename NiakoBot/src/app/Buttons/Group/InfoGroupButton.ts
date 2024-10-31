import { ButtonInteraction, ThreadChannel } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'infoGroup',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.editReply({ content: 'Модуль **групп** выключен на сервере' })
        }

        const group = await client.db.groups.getMessage(button.message.id)
        if(!group) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Информация о группе', `Я **не** нашла **группу**`).setColor(doc.color) ]
            })
        }

        return button.editReply({
            embeds: [ (await client.storage.embeds.groupInfo(button.member, button.channel as ThreadChannel, group)).setColor(doc.color) ]
        })
    }
)