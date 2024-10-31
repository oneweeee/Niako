import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'play',
    {
        disabled: true,
        voice: true,
        module: 'music',
        name: 'play',
        description: 'Начать играть трек',
        detailedDescription: 'Niako заходит к Вам в голосовой канал и играет указаный трек',

        options: [
            {
                name: 'трек',
                description: 'Напишите, какой трек Вы хотите запустить',
                detailedDescription: 'Название или ссылка на трек, который Вы хотите запустить',
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true
            },

            {
                name: 'приоритет',
                description: 'Изменить приоритет найденого трека',
                detailedDescription: 'Изменяет приоритет запрошенного трека на указанный Вами',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'сейчас',
                        value: 'now'
                    },
                    { 
                        name: 'очередь',
                        value: 'queue'
                    }
                ]
            },

            {
                name: 'перемешать',
                description: 'Перемешать треки после добавления трека',
                detailedDescription: 'Перемешивает всю очередь после добавленного трека в неё',
                type: ApplicationCommandOptionType.Boolean
            }
        ]
    },

    async (client, interaction, lang) => {
        /*const guildLevel = client.db.boosts.getGuildLevelById(interaction.guildId)
        if(guildLevel !== 3 && !client.db.badges.partners.has(interaction.guildId)) {
            return interaction.reply({
                embeds: [ client.storage.embeds.needLevel(3) ],
                ephemeral: true
            })
        }

        await interaction.deferReply()

        const voiceId = interaction.member.voice.channelId!

        const track = interaction.options.get('трек', true).value as string
        const startTrackType = (interaction.options.get('приоритет')?.value || 'queue')
        const shuffleQueueType = (interaction.options.get('перемешать')?.value || false)

        const search = await client.util.getSongs(track)
        if(!search?.tracks?.length) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.music('Я не нашла ничего по Вашему запросы') ]
            })
        }

        if(!['PLAYLIST_LOADED', 'SEARCH_RESULT', 'TRACK_LOADED'].includes(search?.loadType || '')) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.music('Я не нашла ничего по Вашему запросы') ]
            })
        }

        await interaction.editReply({
            embeds: [ client.storage.embeds.music('Выполняется поиск трека...') ]
        })

        const queue = await client.db.queues.get(interaction.guildId)

        if(search.loadType === 'PLAYLIST_LOADED') {
            const streamed = search.tracks.find((t) => t.info.isStream)
            if(streamed) {
                return interaction.editReply({
                    embeds: [ client.storage.embeds.music('В плейлисте есть видео стрим') ]
                })
            }

            if(startTrackType === 'queue') {
                for ( let i = 0; search.tracks.length > i; i++ ) {
                    const song = {
                        requster: {
                            username: interaction.member.user.username,
                            avatar: client.util.getAvatar(interaction.member)
                        },
                        ...search.tracks[i],
                        start: Date.now()
                    }

                    queue.tracks.push(song)
                }
            } else {
                for ( let i = search.tracks.length-1; i >= 0; i-- ) {
                    const song = {
                        requster: {
                            username: interaction.member.user.username,
                            avatar: client.util.getAvatar(interaction.member)
                        },
                        ...search.tracks[i],
                        start: Date.now()
                    }

                    queue.tracks.unshift(song)
                }
            }
        } else {
            if(search.tracks[0].info.isStream) {
                return interaction.editReply({
                    embeds: [ client.storage.embeds.music('Вы не можете включить стрим') ]
                })
            }

            const song = {
                requster: {
                    username: interaction.member.user.username,
                    avatar: client.util.getAvatar(interaction.member)
                },
                ...search.tracks[0],
                start: Date.now()
            }

            if(startTrackType === 'queue') {
                queue.tracks.push(song)
            } else {
                queue.tracks.unshift(song)
            }
        }

        let player = search.node.players.get(interaction.guildId)
        if(!player || !interaction.guild.members?.me?.voice?.channelId) {
            player = await search.node.joinChannel({
                guildId: interaction.guildId,
                channelId: voiceId,
                shardId: client.ws.shards.first()!.id
            })

            player.on('start', async (data) => {
                return (await import('../../Player Events/TrackStart')).default(client, data)
            })

            player.on('end', async (data) => {
                return (await import('../../Player Events/TrackEnd')).default(client, data)
            })

            queue.played = true
            queue.voiceId = voiceId
            queue.textId = interaction.channelId!
        }

        if(!player?.paused || !player?.track) {            
            if(shuffleQueueType) {
                queue.tracks = client.player.shuffle(queue.tracks, startTrackType === 'now')
                player.playTrack({ track: queue.tracks[0].track, options: { noReplace: false } })
            } else {
                player.playTrack({ track: queue.tracks[0].track, options: { noReplace: false } })
            }
        }

        await client.db.queues.save(queue)

        if(search.loadType === 'PLAYLIST_LOADED') {
            return interaction.editReply({
                embeds: [ client.storage.embeds.music(`Плейлист "${search.playlistInfo?.name}" был успешно добавлен в очередь!`) ]
            })
        } else {
            return interaction.editReply({
                embeds: [ client.storage.embeds.music(`Трек "${search.tracks[0].info.title}" был успешно добавлен в очередь!`) ]
            })
        }*/
    },

    async (client, interaction, lang) => {
        const focusedValue = interaction.options.getFocused()

        if(focusedValue === '' || focusedValue.startsWith('https://')) {
            return interaction.respond([])
        }

        let choices = ((await client.util.getSongs(focusedValue))?.tracks || [])
        
        choices = choices.filter((t) => t.info.uri &&  100 > t.info.uri.length)
        
        if(choices.length === 0) {
            return interaction.respond([]).catch(() => {})
        }

        choices = choices.slice(0, choices.length > 15 ? 15 : choices.length)

        return interaction.respond(
            choices.map((track) => {
                const name = `${track.info.author} - ${track.info.title}`
                return { name: name.length >= 100 ? name.substring(0, 97) + '...' : name, value: track.info.uri }
            })
        ).catch(() => {})
    }
)