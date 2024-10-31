import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomRename',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const doc = await client.db.modules.voice.get(button.guildId)

        const voice = button.member.voice?.channel
        if(!voice) {
            return button.reply({
                ephemeral: true,
                embeds: [ client.storage.embeds.default(button.member, 'Изменить название канала', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const room = await client.db.rooms.get(`${button.guildId}.${button.member.id}`)

        return button.showModal(
            new ModalBuilder()
            .setCustomId('manageRoomRenameModalWindow')
            .setTitle('Изменить название канала')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('name')
                    .setLabel('Новое название')
                    .setMaxLength(100)
                    .setPlaceholder('Укажите новое имя приватной комнаты')
                    .setRequired(true)
                    .setValue(room.name)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }
)