import { ApplicationCommandOptionType, BaseGuildVoiceChannel } from "discord.js"
import BaseSlashCommand from "#base/BaseSlashCommand"
import { LoadType } from "shoukaku"

export default new BaseSlashCommand(
    {
        name: 'play',
        description: 'Воспроизвести любимую песню через бота',
        descriptionLocalizations: {
            'ru': 'Воспроизвести любимую песню через бота',
            'en-US': 'Play your favorite song via bot'
        },
        category: 'music',
        options: [
            {
                name: 'поиск',
                nameLocalizations: {
                    'ru': 'поиск',
                    'en-US': 'serach'
                },
                description: 'Названия трека или url на плейлист или трек',
                descriptionLocalizations: {
                    'ru': 'Названия трека или url на плейлист или трек',
                    'en-US': 'Track name or url to playlist or track'
                },
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true
            }
        ]
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply({ ephemeral: true })
        
        const voiceChannel = interaction.member.voice.channel
        if(!voiceChannel) {
            return interaction.editReply({ content: `${client.services.lang.get("commands.music.contents.error_use", locale)}` })
        }

        const me = await interaction.guild.members.fetchMe().catch(() => null)
        if(!me || !me.permissions.has('Administrator')) {
            if(voiceChannel.permissionsFor(client.user.id)?.missing(['Connect', 'ViewChannel'])) {
                return interaction.editReply({ content: `${client.services.lang.get(`${interaction.member.toString()}, у меня недостаточно прав что-бы зайти в данный голосовой канал`, locale)}` })
            }
    
            if(interaction.channel!.permissionsFor(client.user.id)?.missing(['SendMessages', 'ViewChannel'])) {
                return interaction.editReply({ content: `${client.services.lang.get(`${interaction.member.toString()}, у меня недостаточно прав что-бы отправить сообщение в данный текстовый канал`, locale)}` })
            }
        }

        const trackUri = interaction.options.get('поиск')?.value as string | undefined || client.util.getSpotify(interaction.member)
        if(!trackUri) {
            return interaction.editReply({ content: `${client.services.lang.get("commands.music.contents.no_fiend", locale)}` })
        }

        const res = await client.player.isTrack(trackUri)
        if(!res || [LoadType.EMPTY, LoadType.ERROR].includes(res?.loadType)) {
            return interaction.editReply({ content: `${client.services.lang.get("commands.music.contents.no_fiend", locale)}` })
        }

        await client.player.loadTracks(res, voiceChannel as BaseGuildVoiceChannel, interaction.channelId, interaction.user)
        await client.player.playTrack(voiceChannel as BaseGuildVoiceChannel, interaction.channelId)

        const queue = client.player.getQueue(interaction.guildId)!

        if(res.loadType !== LoadType.PLAYLIST) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.track(queue, client.db.guilds.getColor(interaction.guildId)) ]
            })
        } else {
            return interaction.editReply({
                embeds: [ client.storage.embeds.playlist(res, client.db.guilds.getColor(interaction.guildId), locale) ]
            })
        }
    },

    async (client, autocomplete) => {
        const search = autocomplete.options.getFocused()
        const spotify = client.util.getSpotify(autocomplete.member)
        if(!search && !spotify) {
            return autocomplete.respond([])
        }

        const respond = await client.player.getTracks((search || spotify) as string, 'sp', true)
        if(!respond) {
            return autocomplete.respond([])
        }
        
        return autocomplete.respond(
            respond.data.filter(t => t?.info?.uri?.length && 100 > t.info.uri.length).map((t) => ({ name: `${t.info.author} — ${t.info.title}`, value: t.info.uri! }))
        )
    }
)