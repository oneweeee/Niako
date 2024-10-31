import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'removeGroupMember',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })
        
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.editReply({ content: 'Модуль **групп** выключен на сервере' })
        }

        const group = await client.db.groups.getMessage(button.message.id)
        if(!group) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Выгнать пользователя с группы', `Я **не** нашла **группу**`).setColor(doc.color) ]
            })
        }

        if(group.userId !== button.user.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Выгнать пользователя с группы', `Вы **не** можете управлять **чужой** группой`).setColor(doc.color) ]
            })
        }

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Выгнать пользователя с группы', `Выберите **участника**, которого хотите **выгнать** с группы`).setColor(doc.color) ],
            components: client.storage.components.rowSelectMenuUser('selectKickMemberGroup')
        })
    }
)