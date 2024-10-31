import { ButtonInteraction, ChannelType } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'manageRoomInfo',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true, fetchReply: true })

        const doc = await client.db.modules.voice.get(button.guildId)
        
        const message = await button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Информация о комнате', `выберите **приватную комнату**`).setColor(doc.color) ],
            components: client.storage.components.roomInfo()
        })

        return client.storage.collectors.interaction(
            button,
            message,
            async (i) => {
                const doc = await client.db.modules.voice.get(button.guildId)
                
                const voice = i.member.voice?.channel
                if(!voice) {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Информация о комнате', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ],
                        components: []
                    })
                }

                if(i.isChannelSelectMenu()) {
                    const channel = i.channels.first()!

                    const res = await client.db.rooms.getChannel(channel.id)
                    if(!res || channel.type !== ChannelType.GuildVoice) {
                        return button.editReply({
                            embeds: [ client.storage.embeds.default(button.member, 'Информация о комнате', `**выбранный** голосовой канал **не** найден или **не** является **приватной комнатой**`).setColor(doc.color) ],
                            components: []
                        })
                    }

                    return button.editReply({
                        embeds: [ client.storage.embeds.manageRoomInfo(button.member, channel, doc, res) ],
                        components: client.storage.components.roomInfoPerms(channel.id)
                    })
                } else if(i.isButton()) {
                    if(i.customId === 'manageRoomCollectorInfoButton') {
                        const channel = i.member.voice?.channel
                        if(!channel) {
                            return button.editReply({
                                embeds: [ client.storage.embeds.default(button.member, 'Информация о комнате', `Вы **не** находитесь в **голосовом** канале`).setColor(doc.color) ],
                                components: []
                            })
                        }

                        const res = await client.db.rooms.getChannel(channel.id)
                        if(!res || channel.type !== ChannelType.GuildVoice) {
                            return button.editReply({
                                embeds: [ client.storage.embeds.default(button.member, 'Информация о комнате', `**выбранный** голосовой канал **не** найден или **не** является **приватной комнатой**`).setColor(doc.color) ],
                                components: []
                            })
                        }
    
                        return button.editReply({
                            embeds: [ client.storage.embeds.manageRoomInfo(button.member, channel, doc, res) ],
                            components: client.storage.components.roomInfoPerms(channel.id)
                        })
                    } else {
                        const channel = i.guild.channels.cache.get(i.customId.split('.')[1])
                        if(!channel || channel.type !== ChannelType.GuildVoice) {
                            return button.editReply({
                                embeds: [ client.storage.embeds.default(button.member, 'Права пользователей приватной комнаты', `этой **комнаты** больше **нет**`).setColor(doc.color) ],
                                components: []
                            })
                        }

                        const res = await client.db.rooms.getChannel(channel.id)
                        if(!res) {
                            return button.editReply({
                                embeds: [ client.storage.embeds.default(button.member, 'Права пользователей приватной комнаты', `этой **комнаты** больше **нет**`).setColor(doc.color) ],
                                components: []
                            })
                        }

                        const array = channel.permissionOverwrites.cache
                        .filter(p => channel.guild.members.cache.has(p.id))
                        .map(p => p)

                        switch(i.customId.split('.')[0]) {
                            case 'leaveToInfoRoom':
                                return button.editReply({
                                    embeds: [ client.storage.embeds.manageRoomInfo(button.member, channel, doc, res) ],
                                    components: client.storage.components.roomInfoPerms(channel.id)
                                })
                            case 'checkMembersPermission':
                                return button.editReply({
                                    embeds: [ client.storage.embeds.manageRoomPermissions(button.member, channel, lang).setColor(doc.color) ],
                                    components: client.storage.components.paginator(array, lang, 0, 5, true,false, false, `leaveToInfoRoom.${channel.id}`, channel.id)
                                })
                            case 'left':
                                const leftPage = Number((i.message.embeds[0]?.footer?.text || '').split('/')[0].split(': ')[1])-2
                                
                                return button.editReply({
                                    embeds: [ client.storage.embeds.manageRoomPermissions(button.member, channel, lang, leftPage).setColor(doc.color) ],
                                    components: client.storage.components.paginator(array, lang, leftPage, 5, true, false, false, `leaveToInfoRoom.${channel.id}`, channel.id)
                                })
                            case 'right':
                                const rightPage = Number((i.message.embeds[0]?.footer?.text || '').split('/')[0].split(': ')[1])
                                
                                return button.editReply({
                                    embeds: [ client.storage.embeds.manageRoomPermissions(button.member, channel, lang, rightPage).setColor(doc.color) ],
                                    components: client.storage.components.paginator(array, lang, rightPage, 5, true, false, false, `leaveToInfoRoom.${channel.id}`, channel.id)
                                })
                        }
                    }
                }
            },
            30_000,
            async (collected, reason) => {
                if(reason === 'time') {
                    return button.editReply({
                        embeds: [ client.storage.embeds.default(button.member, 'Информация о комнате', `Время на **ответ** вышло`).setColor((doc as any).color) ],
                        components: []
                    })
                }
            }
        )
    }
)