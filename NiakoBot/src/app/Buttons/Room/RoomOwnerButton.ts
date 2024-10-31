import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomCrown',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true, fetchReply: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const voice = button.member.voice?.channel
        if(!voice) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ]
            })
        }

        const res = await client.db.rooms.getChannel(voice.id)
        if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ]
            })
        }

        const message = await button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `укажите **пользователя**, которому Вы хотите **передать** ${voice.toString()}`).setColor(doc.color) ],
            components: client.storage.components.rowSelectMenuUser('manageRoomCollectorCrown')
        })

        return client.storage.collectors.interaction(
            button,
            message,
            async (i) => {
                const doc = await client.db.modules.voice.get(button.guildId)
                
                const voice = i.member.voice?.channel
                if(!voice) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ],
                        components: []
                    })
                }
        
                const res = await client.db.rooms.getChannel(voice.id)
                if(!res || res.channels.length === 0 || res.userId !== button.member.id) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** находитесь в **своей** приватной комнате`).setColor(doc.color) ],
                        components: []
                    })
                }

                if(i.isUserSelectMenu()) {
                    const member = i.members.first()!

                    if(member.user.bot) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** можете **передать** ${voice.toString()} боту`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    if(member.id === button.user.id) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** можете **передать** ${voice.toString()} самому себе`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    const channelId = member.voice.channelId!
                    if(!res.channels.includes(channelId) && channelId !== voice.id) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `${member.toString()} **не** находится в ${voice.toString()}`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    const room = await client.db.rooms.get(`${button.guildId}.${member.id}`)
                    if(room.channels.length > 0 && button.guild.channels.cache.has(room.channels[0])) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `у ${member.toString()} **уже** есть своя **приватная комната**`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    await voice.permissionOverwrites.delete(button.member.id)
                    await voice.permissionOverwrites.create(
                        member.id,
                        {
                            Speak: true, Stream: true, UseVAD: true, Connect: true, ViewChannel: true, PrioritySpeaker: true, CreateInstantInvite: true,
                            MoveMembers: false, ManageRoles: false, ManageWebhooks: false, ManageChannels: false
                        }
                    )

                    room.channels.push(voice.id)
                    res.channels.splice(res.channels.indexOf(voice.id), 1)
                    client.db.rooms.pushChannel(voice.id, room.userId)
                    await client.db.rooms.save(room)
                    await client.db.rooms.save(res)

                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы успешно **передали** ${voice.toString()} пользователя ${member.toString()}. Ваши **права** в ${voice.toString()} были **сброшены**`).setColor(doc.color) ],
                        components: []
                    })
                }
            },
            30_000,
            async (collected, reason) => {
                if(reason === 'time') {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Сделать пользователя новым владельцем', `Вы **не** успели указать пользователя`).setColor((doc as any).color) ],
                        components: client.storage.components.rowSelectMenuUser('manageRoomCollectorKick', undefined, true)
                    })
                }
            },
            1
        )
    }
)