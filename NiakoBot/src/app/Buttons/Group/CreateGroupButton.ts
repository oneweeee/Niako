import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'createGroup',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const doc = await client.db.modules.group.get(button.guildId)
        if(!doc.state) {
            return button.reply({ content: 'Модуль **групп** выключен на сервере', ephemeral: true })
        }

        return button.showModal(
            new ModalBuilder()
            .setTitle('Создать группу')
            .setCustomId('createGroupModalWindow')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('name')
                    .setLabel('Название')
                    .setMaxLength(32)
                    .setPlaceholder('Название группы')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                    .setValue(button.user.username.length > 32 ? button.user.username.substring(0, 29) + '...' : button.user.username)
                )
            )
        )
    }
)