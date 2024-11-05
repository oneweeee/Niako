import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"
import {
    ButtonInteraction,
    CommandInteraction,
    StringSelectMenuInteraction,
    Locale
} from "discord.js"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: ButtonInteraction<'cached'> | StringSelectMenuInteraction<'cached'>, playlists: TPlaylist[], code: string, locale: Locale) => {
    const find = playlists.find(p => code === p.code)
    if(!find) {
        return menu.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }

    if(find.type === 'Private' && menu.user.id !== find.userId) {
        return menu.reply(
            { content: 'Вы **не** можете смотреть **приватные** плейлисты', ephemeral: true }
        )
    }

    return interaction.editReply({
        embeds: [ client.storage.embeds.playlistInfo(menu.guild, client.db.guilds.getColor(interaction.guildId), find) ],
        components: client.storage.components.managePlaylist(find, locale, interaction.member.id)
    })
}