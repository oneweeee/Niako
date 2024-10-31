import { NiakoClient } from "../client/NiakoClient";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Guild,
    GuildMember,
    OverwriteType,
    PermissionFlagsBits,
    PermissionOverwrites,
    VoiceState
} from "discord.js";

export default class VoiceManager {
    private cacheOnline: Collection<string, NodeJS.Timer> = new Collection()

    constructor(
        private client: NiakoClient
    ) {}

    async join(state: VoiceState) {
        const { member, guild, channel } = state
        if(!member || !channel) return

        if(!member.user.bot) {
            this.startOnline(member)
        }

        this.client.db.modules.banner.addUpdateGuild(state.guild.id)

        const doc = await this.client.db.modules.voice.get(guild.id)
        if(doc.voiceChannelId === channel.id) {
            if(!doc.state) return this.client.util.disconnect(member)

            if(member.user.bot) {
                return this.client.util.disconnect(member)
            }

            const room = await this.client.db.rooms.get(`${guild.id}.${member.id}`)

            if(doc.noDeleteCreatedChannel) {
                const id = room.channels.find((id) => guild.channels.cache.get(id))
                if(id) {
                    return member.voice.setChannel(id)
                    .catch(async () => await this.client.util.disconnect(member))
                }
            }

            if(room.joinCooldown > Date.now()) {
                return this.client.util.disconnect(member)
            }

            if(room.stateCreated) {
                room.name = doc.default.roomName
                room.limit = doc.default.roomLimit
            }

            if(room.name.length > 100) {
                room.name = room.name.substring(0, 100)
            }

            let perms: PermissionOverwrites[] = []

            if(channel?.parent) {
                perms = channel.parent.permissionOverwrites.cache.map((p) => p)
            }

            return guild.channels.create(
                {
                    name: this.client.util.replaceVariable(doc.default.roomName, { member }),
                    userLimit: doc.default.roomLimit,
                    type: ChannelType.GuildVoice,
                    parent: channel.parentId,
                    permissionOverwrites: [
                        ...perms,
                        ...doc.defaultBlockRoles.map((id) => ({
                            id, type: OverwriteType.Role,
                            allow: [ PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect ]
                        })),
                        {
                            id: member.id,
                            ...this.permissionsRoomOwner,
                            type: OverwriteType.Member
                        }
                    ],
                }
            ).then(async channel => {
                this.client.db.rooms.pushChannel(channel.id, member.id)
                await member.voice.setChannel(channel.id).then(async () => {
                    if(room.stateCreated) {
                        room.stateCreated = false
                    }
                    
                    room.channels.push(channel.id)
                    room.created = Date.now()
                    await this.client.db.rooms.save(room)
                    if(doc.sendMessageInRoom) {
                        await this.client.db.modules.voice.sendRoomMessage(channel, doc)
                    }
                    if(channel.members.size === 0) {
                        room.joinCooldown = Date.now() + 5 * 1000
                        room.channels.splice(room.channels.indexOf(channel.id), 1)
                        await this.client.db.rooms.save(room)
                        return channel.delete('ddos').catch(() => {})
                    }
                }).catch(async () => await channel.delete('ddos').catch(() => {}))
            }).catch(async () => await this.client.util.disconnect(member).catch(() => {}))
        }
    }

    async loggerStateJoin(state: VoiceState) {
        const { member, guild, channel } = state
        if(!member || !channel) return

        const doc = await this.client.db.modules.audit.get(guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'voiceStateJoin')
            if(getConfig && getConfig.state) {
                const logger = member.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = this.client.storage.embeds.loggerGreen()
                    .setAuthor(
                        {
                            name: `${this.client.db.modules.audit.getMemberName(guild, member.user)} зашёл в голосовой канал`,
                            iconURL: this.client.config.icons['VoiceState']['Green']
                        }
                    )
                    .addFields(
                        {
                            name: 'Канал',
                            inline: true,
                            value: `${channel.toString()} | \`${channel.name}\``
                        },
                        {
                            name: this.client.db.modules.audit.getMemberName(guild, member.user),
                            inline: true,
                            value: `${member.toString()} | \`${member.user.tag}\``
                        }
                    )
                    .setFooter({ text: `Id канала: ${channel.id}`})
                    .setTimestamp()

                    return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }

    async loggerStateUpdate(oldState: VoiceState, newState: VoiceState) {
        const doc = await this.client.db.modules.audit.get(oldState.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'voiceStateUpdate')
            if(getConfig && getConfig.state) {
                const channel = oldState.member!.guild.channels.cache.get(getConfig.channelId)
                if(channel && channel.type === ChannelType.GuildText) {
                    const embed = this.client.storage.embeds.loggerYellow()
                    .setAuthor(
                        {
                            name: `${this.client.db.modules.audit.getMemberName(oldState.guild, oldState.member!.user)} переместился в другой канал`,
                            iconURL: this.client.config.icons['VoiceState']['Yellow']
                        }
                    )
                    .addFields(
                        {
                            name: 'Канал',
                            inline: true,
                            value: `${oldState?.channel?.name || 'unknown'} ➞ ${newState?.channel?.name || 'unknown'}`
                        },
                        {
                            name: this.client.db.modules.audit.getMemberName(oldState.guild, oldState.member!.user),
                            inline: true,
                            value: `${oldState.member!.toString()} | \`${oldState.member!.user.tag}\``
                        }
                    )
                    .setFooter({ text: `Из: ${oldState.channelId}, В: ${newState.channelId}`})
                    .setTimestamp()

                    const action = (await oldState.member!.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberMove)
                    if(action && action?.executor && action?.target && action?.targetId === oldState.member!.id) {
                        embed.addFields(
                            {
                                name: 'Переместил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    return channel.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }

    async loggerStateLeave(state: VoiceState) {
        const { member, guild, channel } = state
        if(!member || !channel) return

        const doc = await this.client.db.modules.audit.get(guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'voiceStateLeave')
            if(getConfig && getConfig.state) {
                const logger = member.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = this.client.storage.embeds.loggerRed()
                    .setAuthor(
                        {
                            name: `${this.client.db.modules.audit.getMemberName(guild, member.user)} вышел из голосового канала`,
                            iconURL: this.client.config.icons['VoiceState']['Red']
                        }
                    )
                    .addFields(
                        {
                            name: 'Канал',
                            inline: true,
                            value: `${channel.toString()} | \`${channel.name}\``
                        },
                        {
                            name: this.client.db.modules.audit.getMemberName(guild, member.user),
                            inline: true,
                            value: `${member.toString()} | \`${member.user.tag}\``
                        }
                    )
                    .setFooter({ text: `Id канала: ${channel.id}`})
                    .setTimestamp()

                    const action = (await guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberDisconnect)
                    if(action && action?.executor && action?.target && action?.targetId === member.id) {
                        embed.addFields(
                            {
                                name: 'Отключил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }

    async leave(state: VoiceState) {
        const { member, guild, channel } = state
        if(!member || !channel) return

        this.client.db.modules.banner.addUpdateGuild(state.guild.id)

        if(channel.members.map((m) => m.id).includes(this.client.user.id)) {
            if(channel.members.size === 1) {
                const queue = await this.client.db.queues.get(guild.id)
                if(queue.textId !== '0') {
                    await this.client.db.queues.destroy(queue, guild, 'В голосвом канале не осталось участников, я вышла...')
                }
            }
        }

        if(member.id === this.client.user.id) {
            const queue = await this.client.db.queues.get(guild.id)
            if(queue.textId !== '0') {
                await this.client.db.queues.destroy(queue, guild, 'Меня выгнали, я закончила воспроизведение...')
            }
        }

        if(!member.user.bot) {
            this.startOnline(member)
        }

        const doc = await this.client.db.modules.voice.get(guild.id)
        const room = await this.client.db.rooms.getChannel(channel.id)

        if(!this.client.db.rooms.hasChannel(channel.id) || doc.noDeleteCreatedChannel || channel.id === doc.voiceChannelId) return

        if(channel.members.size === 0) {
            await channel.delete('Выход из комнаты').catch(() => {})
        } else if(room && room.userId === member.id && doc.transferRoomAtOwnerLeave) {
            const mem = this.client.util.randomElement(channel.members.map((m) => m))
            const doc = await this.client.db.rooms.get(`${guild.id}.${mem.id}`)
            doc.channels.push(channel.id)
            this.client.db.rooms.pushChannel(channel.id, mem.id)
            await this.client.db.rooms.save(doc)
        }

        if(room && room.userId === member.id) {
            room.joinCooldown = Date.now() + 5 * 1000
            if(channel.members.size === 0) {
                if(!doc.transferRoomAtOwnerLeave) this.client.db.rooms.removeChannel(channel.id)
                room.channels.splice(room.channels.indexOf(channel.id), 1)
            }
            await this.client.db.rooms.save(room).catch(() => {})
        }
    }

    startOnline(member: GuildMember) {
        if(this.cacheOnline.has(`${member.guild.id}.${member.id}`)) return

        const timerId = setInterval(async () => {
            if(!member?.voice?.channel) {
                clearInterval(this.cacheOnline.get(`${member.guild.id}.${member.id}`))
                return this.cacheOnline.delete(`${member.guild.id}.${member.id}`)
            }

            if(member?.voice?.mute) {
                return
            }

            const res = await this.client.db.members.get(member.guild.id, member.id)
            res.online.all += 60000
            res.online.banner += 60000
            res.markModified('online')
            await this.client.db.members.save(res)
        }, 60_000)

        this.cacheOnline.set(`${member.guild.id}.${member.id}`, timerId)
    }

    initVoiceMemberOnline() {
        return this.client.guilds.cache.map((guild) => this.initVoiceGuildMemberOnline(guild))
    }

    initVoiceGuildMemberOnline(guild: Guild) {
        return guild.members.cache.filter((member) => Boolean(member.voice?.channelId) && !member.user.bot).map((m) => this.startOnline(m))
    }

    private permissionsRoomOwner = {
        allow: [
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.Stream,
            PermissionFlagsBits.UseVAD,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.PrioritySpeaker,
            PermissionFlagsBits.CreateInstantInvite
        ],
        deny: [
            PermissionFlagsBits.ManageRoles,
            PermissionFlagsBits.ManageWebhooks,
            PermissionFlagsBits.ManageChannels
        ]
    }
}