import { AuditLogEvent, VoiceState } from "discord.js"
import WindClient from "../WindClient"

export default class VoiceManager {
    constructor(
        private client: WindClient
    ) {}

    async loggerStateJoin(state: VoiceState) {
        const { member, guild, channel } = state
        if(!member || !channel) return

        const auditChannel = await this.client.db.audits.resolveChannel(guild, 'VoiceStateJoin')
        if(!auditChannel) return

        const embed = this.client.storage.embeds.green()
        .setAuthor(
            {
                name: `${this.client.db.audits.getMemberName(guild, member.user)} зашёл в голосовой канал`,
                iconURL: this.client.icons['VoiceState']['Green']
            }
        )
        .setImage(this.client.icons['Guild']['Line'])
        .setThumbnail(this.client.util.getAvatar(member.user))

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Канал:',
                inline: true,
                value: `・${channel.toString()}  \n・${channel.name} \n・${channel.id}`
            },
            {
                name: `> ${this.client.db.audits.getMemberName(guild, member.user)}:`,
                inline: true,
                value: `・${member.toString()} \n・${member.user.tag} \n・${member.user.id}`
            }
        )
        
        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }

    async loggerStateUpdate(oldState: VoiceState, newState: VoiceState) {
        const auditChannel = await this.client.db.audits.resolveChannel(oldState.guild, 'VoiceStateUpdate')
        if(!auditChannel) return

        const embed = this.client.storage.embeds.yellow()
        .setAuthor(
            {
                name: `${this.client.db.audits.getMemberName(oldState.guild, oldState.member!.user)} переместился в другой канал`,
                iconURL: this.client.icons['VoiceState']['Yellow']
            }
        )
        .setImage(this.client.icons['Guild']['Line'])
        .setThumbnail(this.client.util.getAvatar(oldState.member!.user))

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: `> ${this.client.db.audits.getMemberName(oldState.guild, oldState.member!.user)}:`,
                inline: true,
                value: `・${oldState.member!.toString()} \n・${oldState.member!.user.tag} \n・${oldState.member!.user.id}`
            },
            {
                name: '> Канал:',
                inline: true,
                value: `Из: \`${oldState?.channel?.name || 'unknown'}\` ➞ В: \`${newState?.channel?.name || 'unknown'}\``
            }
        )

        const action = await this.client.db.audits.getAudit(oldState.guild, AuditLogEvent.MemberMove)
        if(action && action?.executor && action?.target && action?.targetId === oldState.member!.id) {
            embed.addFields(
                {
                    name: '> Переместил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: false
                }
            )
        }

        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }

    leave(state: VoiceState) {
        const { channel, guild, member } = state
        if(!channel || !member) return

        if(channel.members.has(this.client.user.id) && channel.members.size === 1) {       
            const queue = this.client.player.getQueue(guild.id)
            if(!queue || queue?.isDisconnect) return
            
            queue.isDisconnect = true

            return this.client.player.leaveChannel(guild.id, 'Channel', 'Я покинул канал, потом что все вышли')
        }

        if(member.id === this.client.user.id && channel.members.size !== 0) {
            const queue = this.client.player.getQueue(guild.id)
            if(!queue || queue?.isDisconnect) return

            return this.client.player.leaveChannel(guild.id, 'Channel', 'Я покинул канал, потом что все вышли')
        }
    }

    update(state: VoiceState) {
        const { channel, guild, member } = state
        if(!channel || !member) return
        
        if(member.id === this.client.user.id && channel.members.size !== 0) {
            const queue = this.client.player.getQueue(guild.id)
            if(!queue || !queue?.tracks?.length || queue?.isDisconnect) return

            return this.client.player.leaveChannel(guild.id, 'Channel', 'Я покинул канал, потом что все вышли')
        }
    }

    async loggerStateLeave(state: VoiceState) {
        const { member, guild, channel } = state
        if(!member || !channel) return

        const auditChannel = await this.client.db.audits.resolveChannel(guild, 'VoiceStateLeave')
        if(!auditChannel) return

        const embed = this.client.storage.embeds.red()
        .setAuthor(
            {
                name: `${this.client.db.audits.getMemberName(guild, member.user)} вышел из голосового канала`,
                iconURL: this.client.icons['VoiceState']['Red']
            }
        )
        .setImage(this.client.icons['Guild']['Line'])
        .setThumbnail(this.client.util.getAvatar(member.user))

        .addFields(
            {
                name: '> Дата:',
                inline: false,
                value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
            },
            {
                name: '> Канал:',
                inline: true,
                value: `・${channel.toString()} \n・${channel.name} \n・${channel.id}`
            },
            {
                name: `> ${this.client.db.audits.getMemberName(guild, member.user)}:`,
                inline: true,
                value: `・${member.toString()} \n・${member.user.tag} \n・${member.user.id}`
            }
        )

        const action = await this.client.db.audits.getAudit(guild, AuditLogEvent.MemberDisconnect)
        if(action && action?.executor && action?.target && action?.targetId === member.id) {
            embed.addFields(
                {
                    name: '> Отключил:',
                    value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                    inline: false
                }
            )
        }
        
        return auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
    }
}