import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomMinusLimit',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Убрать 1 слот в приватной комнате', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Убрать 1 слот в приватной комнате', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        if(1 > voice.userLimit-1) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Убрать 1 слот в приватной комнате', `В Вашей **приватной** комнате ${voice.toString()} установлено **минимальное** количество слотов`).setColor(doc.color) ]
            })
        }

        await voice.setUserLimit(voice.userLimit-1).catch(() => {})

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Убрать 1 слот в приватной комнате', `Вы **убрали** слот в Вашей **приватной** комнате ${voice.toString()}`).setColor(doc.color) ]
        })
    }
)