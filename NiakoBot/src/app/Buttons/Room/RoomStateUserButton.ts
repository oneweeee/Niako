import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomStateUser',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true, fetchReply: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        const message = await button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `укажите **пользователя**, которому Вы хотите **разрешить** или **запретить** подключаться в ${voice.toString()}`).setColor(doc.color) ],
            components: client.storage.components.rowSelectMenuUser('manageRoomCollectorUsered')
        })

        return client.storage.collectors.interaction(
            button,
            message,
            async (i) => {
                const doc = await client.db.modules.voice.get(button.guildId)
                
                const voice = i.member.voice?.channel
                if(!voice) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ],
                        components: []
                    })
                }
        
                const res = await client.db.rooms.getChannel(voice.id)
                if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ],
                        components: []
                    })
                }

                if(i.isUserSelectMenu()) {
                    const member = i.members.first()!

                    if(member.id === button.user.id) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы **не** можете **забрать/выдать** доступ самому себе`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    const muted = voice.permissionOverwrites.cache.get(member.id)
                    let state: boolean = false

                    if(muted && muted.deny.has('Connect')) {
                        state = true
                    }

                    await voice.permissionOverwrites.edit(member.id, { Connect: state })

                    if(member.voice?.channelId === voice.id) {
                        await client.util.disconnect(member)
                    }

                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы успешно **${state?'разрешили':'запретили'}** пользователю ${member.toString()} **подключаться** в ${voice.toString()}`).setColor(doc.color) ],
                        components: []
                    })
                }
            },
            30_000,
            async (collected, reason) => {
                if(reason === 'time') {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Забрать/выдать доступ к комнате пользователю', `Вы **не** успели указать пользователя`).setColor((doc as any).color) ],
                        components: client.storage.components.rowSelectMenuUser('manageRoomCollectorKick', undefined, true)
                    })
                }
            },
            1
        )
    }
)