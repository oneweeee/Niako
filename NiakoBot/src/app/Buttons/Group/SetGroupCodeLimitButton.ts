import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'setLimitCodeUse',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.reply({ content: 'Модуль **групп** выключен на сервере', ephemeral: true })
        }

        const group = await client.db.groups.getMessage(button.message.id)
        if(!group || group?.userId !== button.user.id) {
            return button.reply({
                embeds: [ client.storage.embeds.default(button.member, 'Установить лимит использований', `Вы **не** можете управлять **чужой** группой`).setColor(doc.color) ],
                ephemeral: true
            })
        }

        return button.showModal(
            new ModalBuilder()
            .setTitle('Установить лимит использований')
            .setCustomId('setLimitCodeUseModalWindow')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('limit')
                    .setLabel('Лимит')
                    .setMaxLength(4)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }
)