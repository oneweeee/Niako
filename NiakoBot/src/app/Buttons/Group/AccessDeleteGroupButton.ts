import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'accessDeleteGroup',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.update({ content: 'Модуль **групп** выключен на сервере', components: [] })
        }

        const group = await client.db.groups.getChannel(button.channel!.id)
        if(!group) {
            return button.update({
                embeds: [ client.storage.embeds.default(button.member, 'Удалить группу', `Я **не** нашла **группу**`).setColor(doc.color) ],
                components: []
            })
        }

        await button.update({
            embeds: [ client.storage.embeds.default(button.member, 'Удалить группу', `Группа будет **удалена** через **несколько** секунд...`).setColor(doc.color) ],
            components: []
        })

        return setTimeout(() => client.db.groups.remove(group, button.guild), 1500)
    }
)