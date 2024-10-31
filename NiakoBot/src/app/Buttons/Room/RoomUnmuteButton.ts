import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomUnmute',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true, fetchReply: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        const message = await button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `укажите **пользователя**, которому Вы хотите **разрешить** в ${voice.toString()} **говорить**`).setColor(doc.color) ],
            components: client.storage.components.rowSelectMenuUser('manageRoomCollectorMuted')
        })

        return client.storage.collectors.interaction(
            button,
            message,
            async (i) => {
                const doc = await client.db.modules.voice.get(button.guildId)
        
                const voice = i.member.voice?.channel
                if(!voice) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ],
                        components: []
                    })
                }
        
                const res = await client.db.rooms.getChannel(voice.id)
                if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ],
                        components: []
                    })
                }

                if(i.isUserSelectMenu()) {
                    const member = i.members.first()!

                    if(member.id === button.user.id) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы **не** можете **выдать** право **говорить** самому себе`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    const channelId = member.voice.channelId!
                    if(!res.channels.includes(channelId) && channelId !== voice.id) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `${member.toString()} **не** находится в ${voice.toString()}`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    await voice.permissionOverwrites.edit(member.id, { Speak: true })

                    if(member.voice?.channelId === voice.id) {
                        await client.util.disconnect(member)
                    }

                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы успешно **разрешили** пользователю ${member.toString()} **говорить** в ${voice.toString()}`).setColor(doc.color) ],
                        components: []
                    })
                }
            },
            30_000,
            async (collected, reason) => {
                if(reason === 'time') {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Выдать право говорить пользователю', `Вы **не** успели указать пользователя`).setColor((doc as any).color) ],
                        components: client.storage.components.rowSelectMenuUser('manageRoomCollectorKick', undefined, true)
                    })
                }
            },
            1
        )
    }
)