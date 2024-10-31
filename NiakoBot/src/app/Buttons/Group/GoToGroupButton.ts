import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'goToGroup',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.reply({ content: 'Модуль **групп** выключен на сервере', ephemeral: true })
        }

        return button.showModal(
            new ModalBuilder()
            .setTitle('Войти в группу')
            .setCustomId('goToGroupModalWindow')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('code')
                    .setLabel('Код')
                    .setMaxLength(8)
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }
)