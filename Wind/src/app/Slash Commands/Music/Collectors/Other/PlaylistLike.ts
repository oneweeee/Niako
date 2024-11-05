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

    if(!playlist.likes.includes(button.user.id)) {
        const checkPlaylists = await client.db.playlists.get(button.user.id)
        if(checkPlaylists.length >= 15) {
            return button.reply(
                { content: 'Вы **не** можете иметь больше **15** плейлистов', ephemeral: true }
            )
        }

        playlist.likes.push(button.user.id)
        await client.db.playlists.save(playlist)

        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), 'Добавление в понравившиеся', locale,
                    `Вы **добавили** плейлист "**${playlist.name}**" в **понравившиеся** плейлисты`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leavetochoose', true) ]
        })
    } else {
        playlist.likes.splice(playlist.likes.indexOf(button.user.id), 1)
        await client.db.playlists.save(playlist)

        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), 'Удаление из понравившихся', locale,
                    `Вы **удалили** плейлист "**${playlist.name}**" из **понравившихся** плейлистов`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leavetochoose', true) ]
        })
    }
}