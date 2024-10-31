import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomUp',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Поднять комнату вверх', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Поднять комнату вверх', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        await voice.setPosition(1)

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Поднять комнату вверх', `Вы успешно **подняли** комнату ${voice.toString()}`).setColor(doc.color) ]
        })
    }
)