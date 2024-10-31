import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomStateLock',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Закрыть/открыть доступ в комнату', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Закрыть/открыть доступ в комнату', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        let state: boolean = false
        
        if(doc.defaultBlockRoles.length === 0) {
            doc.defaultBlockRoles = [ button.guildId ]
            doc.markModified('defaultBlockRoles')
            await client.db.modules.voice.save(doc)
        }
        for ( let i = 0; doc.defaultBlockRoles.length > i; i++ ) {
            const closed = voice.permissionOverwrites.cache.get(doc.defaultBlockRoles[i])
            if(closed && closed.deny.has('Connect')) {
                state = true
            }
        }
        for ( let i = 0; doc.defaultBlockRoles.length > i; i++ ) {
            await voice.permissionOverwrites.edit(doc.defaultBlockRoles[i], { Connect: state }).catch(() => {})
        }

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Закрыть/открыть доступ в комнату', `Вы успешно **${state?'открыли':'закрыли'}** комнату ${voice.toString()}`).setColor(doc.color) ]
        })
    }
)