import { ApplicationCommandOptionType } from "discord.js"
import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'playlist',
        description: 'Просмотр своих плейлистов',
        descriptionLocalizations: {
            'ru': 'Просмотр своих плейлистов',
            'en-US': 'View my playlists'
        },
        category: 'music',
        options: [
            {
                name: 'пользователь',
                nameLocalizations: {
                    'ru': 'пользователь',
                    'en-US': 'user'
                },
                description: 'Пользователь',
                descriptionLocalizations: {
                    'ru': 'Пользователь',
                    'en-US': 'User'
                },
                type: ApplicationCommandOptionType.User
            }
        ]
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply({ ephemeral: false })

        let member = interaction.options.getMember('пользователь') ?? interaction.member
        if(member.user.bot) { member = interaction.member }

        await client.db.playlists.checkLoveTracks(member.id)
        
        const get = await client.db.playlists.get(member.id)

        const message = await interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Плейлисты', locale,
                'Какой **плейлист** Вы хотите **посмотреть**?', { target: member, indicateTitle: true }
            )
        ],
            components: client.storage.components.playlists(get, interaction.guild, interaction.user.id === member.id)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                const playlistsCheck = await client.db.playlists.get(member.id)

                if(int.isButton()) {
                    switch(int.customId) {
                        case 'leavetochoose':
                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), 'Плейлисты', locale,
                                    'Какой **плейлист** Вы хотите **посмотреть**?', { target: member, indicateTitle: true }
                                )
                            ],
                                components: client.storage.components.playlists(playlistsCheck, interaction.guild, interaction.user.id === member.id)
                            })
                        case 'createNewPlaylist':
                            return (await import('./Collectors/Other/PlaylistCreate')).default(client, interaction, int, playlistsCheck, locale)
                        default:
                            if(int.customId.split('').includes('.')) {
                                switch(int.customId.split('.')[0]) {
                                    case 'info':
                                        return (await import('./Collectors/Other/PlaylistInfo')).default(client, interaction, int, playlistsCheck, int.customId.split('.')[1], locale)
                                    case 'loveplaylist':
                                        return (await import('./Collectors/Other/PlaylistLike')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'edittype':
                                        return (await import('./Collectors/Track/PlaylistType')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'setName':
                                        return (await import('./Collectors/Track/PlaylistName')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'setImage':
                                        return (await import('./Collectors/Track/PlaylistImage')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'infotracks':
                                        return (await import('./Collectors/Track List/TracklListOpen')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'leftPlaylist':
                                        return (await import('./Collectors/Track List/TrackListLeft')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'rightPlaylist':
                                        return (await import('./Collectors/Track List/TrackListRight')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'play':
                                        return (await import('./Collectors/Track/PlaylistPlay')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'delete':
                                        return (await import('./Collectors/Other/PlaylistDelete')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'agreeDelete':
                                        return (await import('./Collectors/Other/AgreeDeletePlaylist')).default(client, interaction, int, playlistsCheck, locale)
                                }
                            }
                    }
                } else if(int.isStringSelectMenu()) {
                    switch(int.customId) {
                        case 'playlists':
                            return (await import('./Collectors/Other/PlaylistInfo')).default(client, interaction, int, playlistsCheck, int.values[0], locale)
                        default:
                            if(int.customId.split('').includes('.')) {
                                switch(int.customId.split('.')[0]) {
                                    case 'selectTrackDelete':
                                        return (await import('./Collectors/Track List/DeleteTrackInPlaylist')).default(client, interaction, int, playlistsCheck, locale)
                                }
                            }
                    }
                } else if(int.isModalSubmit()) {
                    switch(int.customId) {
                        case 'createPlaylist':
                            return (await import('./Collectors/Other/AgreeCreateNewPlaylist')).default(client, interaction, int, playlistsCheck, locale)
                        default:
                            if(int.customId.split('').includes('.')) {
                                switch(int.customId.split('.')[0]) {
                                    case 'setName':
                                        return (await import('./Collectors/Track/AgreeSetPlaylistName')).default(client, interaction, int, playlistsCheck, locale)
                                    case 'setImage':
                                        return (await import('./Collectors/Track/AgreeSetPlaylistImage')).default(client, interaction, int, playlistsCheck, locale)
                                }
                            }
                    }
                }
            }
        )
    }
)