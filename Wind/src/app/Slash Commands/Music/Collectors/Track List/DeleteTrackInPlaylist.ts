import { CommandInteraction, StringSelectMenuInteraction, Locale } from "discord.js"
import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    const playlist = playlists.find(p => menu.customId.split('.')[1] === p.code)
    if(!playlist) {
        return menu.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }

    const index = playlist.tracks.findIndex((t) => t.uri === menu.values[0])
    if(index === -1) {
        return menu.reply(
            { content: 'Трек **не** найден :(', ephemeral: true }
        )
    }

    const track = playlist.tracks[index]
    playlist.tracks.splice(index, 1)
    await client.db.playlists.save(playlist)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Удаление трека из плейлиста', locale, 
                `Вы **успешно** удалили трек **${track.title}** из плейлиста **${playlist.name}**`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, `infotracks.${playlist.code}`, true) ]
    })
}