import { TPlaylist } from "#db/playlists/PlaylistSchema"
import { LoadType } from "shoukaku"
import WindClient from "#client"
import {
    CommandInteraction,
    ButtonInteraction,
    BaseGuildVoiceChannel,
    Locale
} from "discord.js"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    const playlist = playlists.find(p => button.customId.split('.')[1] === p.code)
    if(!playlist) {
        return button.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }
    
    if(!playlist.tracks.length) {
        return button.reply(
            { content: 'В плейлисте **нет** треков', ephemeral: true }
        )
    }

    const voice = button.member?.voice?.channel as BaseGuildVoiceChannel
    if(!voice) {
        return button.reply(
            { content: 'Вы **должны** находиться в **голосвом** канале', ephemeral: true }
        )
    }

    if(button.guild.members?.me?.voice?.channelId && button.guild.members?.me?.voice?.channelId !== voice.id) {
        return button.reply(
            { content: 'Я **уже** играю музыку **в** другом голосовом канале', ephemeral: true }
        )
    }

    const queue = client.player.getQueue(interaction.guildId)
    const tracks = playlist.tracks.map((t) => {
        return {
            user: interaction.user,
            startPlaying: 0,
            encoded: t.encoded,
            info: {
                ...t,
                sourceName: 'spotify'
            },
            pluginInfo: null,
            thumbnail: null
        }
    })
    if(queue) {
        queue.tracks = tracks
        queue.tracks.unshift(tracks[0])
        queue.player.stopTrack()
    } else {
        await client.player.loadTracks({ loadType: LoadType.SEARCH, data: tracks }, voice, interaction.channelId, interaction.user)
        client.player.playTrack(interaction.member.voice.channel!, interaction.channelId, true)
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Проигрывание плейлиста', locale,
                `Вы **начали** проигрывание плейлиста **${playlist.name}** от <@!${playlist.userId}>`
            )
        ],
        components: client.storage.components.leaveManagePlaylist(playlist, locale)
    })
}