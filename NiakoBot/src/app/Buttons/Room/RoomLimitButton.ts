import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomLimit',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const doc = await client.db.modules.voice.get(button.guildId)

        const voice = button.member.voice?.channel
        if(!voice) {
            return button.reply({
                ephemeral: true,
                embeds: [ client.storage.embeds.default(button.member, 'Установить лимит пользователей', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const room = await client.db.rooms.get(`${button.guildId}.${button.member.id}`)

        return button.showModal(
            new ModalBuilder()
            .setCustomId('manageRoomLimitModalWindow')
            .setTitle('Установить лимит пользователей')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('limit')
                    .setLabel('Количество пользователей')
                    .setMaxLength(2)
                    .setPlaceholder('0')
                    .setRequired(true)
                    .setValue(String(room.limit))
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }
)