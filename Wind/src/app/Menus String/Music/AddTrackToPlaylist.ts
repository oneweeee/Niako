import { StringSelectMenuInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'addPlaylists' },
    async (client: WindClient, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
        const playlist = await client.db.playlists.getByCode(menu.values[0])
        if(!playlist) {
            return menu.reply({ content: `${menu.user.toString()}, плейлист не был найден`, ephemeral: true })
        }

        const queue = client.player.getQueue(menu.guild.id)
        if(!queue || !queue.tracks.length) {
            return menu.reply({ content: `${menu.user.toString()}, пустая очередь`, ephemeral: true })
        }

        const track = [...queue.tracks, ...Object.values(queue.lastTracks)].find(t => t.info.uri === menu.customId.split('[]')[1])

        if(!track) {
            return menu.reply({ content: `${menu.user.toString()}, трек не был найден`, ephemeral: true })
        }

        if(playlist.tracks.find(t => t.uri === track.info.uri)) {
            return menu.reply({ content: `${menu.user.toString()}, у вас уже есть этот трек в плейлисте`, ephemeral: true })
        }

        client.db.playlists.pushTrack(playlist, track)
        await client.db.playlists.save(playlist)

        return menu.update({ content: `${menu.user.toString()}, вы добавили трек "${track.info.title}" в плейлист "${playlist.name}"`, embeds: [], components: [] })
    }
)