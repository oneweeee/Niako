import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction, ChannelType } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'disconnectTrack.',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        const resolveBot = client.player.resolveProvider(button.member)

        if(!resolveBot || resolveBot.id !== button.customId.split('.')[1]) {
            return button.editReply({
                embeds: [ client.storage.embeds.music('Это не Ваш плеер!') ]
            })
        }

        const player = client.player.players.get(button.guildId)
        const queue = await client.db.queues.get(button.guildId)

        if(!player) {
            await button.message.delete().catch(() => {})
            return button.editReply({
                embeds: [ client.storage.embeds.music('Я не нашла плеер...') ]
            })
        }

        const text = button.guild.channels.cache.get(queue.textId)
        if(text && text.type === ChannelType.GuildText) {
            await text.send({
                embeds: [ client.storage.embeds.music(`${client.user.username} был отключен по желанию ${button.member.user.tag}...`) ]
            }).catch(() => {})
        }

        queue.tracks = []
        queue.lasts = {}
        queue.played = false
        queue.paused = false
        queue.pausedTimestamp = 0
        queue.filter = ''
        queue.volume = 0.5
        queue.voiceId = '0'
        queue.textId = '0'
        queue.repeat = 'None'

        await client.db.queues.save(queue)

        player.stopTrack()

        const member = button.guild.members.me
        if(member) await member.voice.disconnect().catch(() => {})

        return button.editReply({
            embeds: [ client.storage.embeds.music(`Вы отключили ${client.user.username} от голосового канала`) ]
        })
    }
)