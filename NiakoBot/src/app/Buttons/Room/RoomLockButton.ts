import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomLock',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Закрыть доступ в комнату', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Закрыть доступ в комнату', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        if(doc.defaultBlockRoles.length === 0) {
            doc.defaultBlockRoles = [ button.guildId ]
            doc.markModified('defaultBlockRoles')
            await client.db.modules.voice.save(doc)
        }
        for ( let i = 0; doc.defaultBlockRoles.length > i; i++ ) {
            await voice.permissionOverwrites.edit(doc.defaultBlockRoles[i], { Connect: false }).catch(() => {})
        }

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Закрыть доступ в комнату', `Вы успешно **закрыли** комнату ${voice.toString()}`).setColor(doc.color) ]
        })
    }
)