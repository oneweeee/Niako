import { CommandInteraction, ButtonInteraction, Locale } from "discord.js"
import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    const playlist = playlists.find(p => button.customId.split('.')[1] === p.code)
    if(!playlist) {
        return button.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }
    
    const name = playlist.name
    
    await playlist.deleteOne({ code: playlist.code })

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Удаление плейлиста', locale,
                `Вы удалили плейлист "**${name}**" из своего списка`,
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leavetochoose', true) ]
    })
}