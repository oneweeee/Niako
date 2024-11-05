import { CommandInteraction, Locale, ModalSubmitInteraction } from "discord.js"
import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    await modal.deferUpdate().catch(() => {})

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(locale, client.db.guilds.getColor(interaction.guildId), 'Создаю плейлист') ],
        components: []
    })

    const name = modal.fields.getTextInputValue('name')

    if(!name) {
        return interaction.editReply({
            embeds: [ client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Создание плейлиста', locale, `Вы **не** указали **название** плейлиста...`) ],
            components: [ client.storage.components.leaveCustom(locale, 'leavetochoose', false) ]
        })
    }

    const doc = await client.db.playlists.create(interaction.member.id, name)
    return interaction.editReply({
        embeds: [ client.storage.embeds.default(interaction.member, client.db.guilds.getColor(interaction.guildId), 'Создание плейлиста', locale, `Вы **создали** плейлист "**${doc.name}**"`)],
        components: [ client.storage.components.leaveCustom(locale, 'leavetochoose', true) ]
    })
}