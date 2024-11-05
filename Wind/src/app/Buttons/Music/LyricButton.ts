import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'getTrackLyric' },
    async (client: WindClient, button: ButtonInteraction<'cached'>, locale: Locale) => {
        await button.deferReply({ ephemeral: true })

        const me = await button.guild.members.fetchMe().catch(() => null)
        if(!me || !me.voice?.channelId) {
            return button.editReply({ content: `${button.user.toString()}, меня нету в голосовом канале с вами` })
        }

        if(!button.member.voice?.channelId) {
            return button.editReply({ content: `${button.user.toString()}, что-бы послушать музыку зайдите в голосовой канал <#${me.voice.channelId}>` })
        }

        if(me.voice.channelId !== button.member.voice.channelId) {
            return button.editReply({ content: `${button.user.toString()}, вы не находитесь со мной в голосовом канале, на данный момент я нахожусь в голосовом канале <#${me.voice.channelId}>` })
        }

        const queue = client.player.getQueue(button.guildId)
        if(!queue || !queue.tracks.length) {
            return button.editReply({ content: `${button.user.toString()}, пустая очередь` })
        }

        const lyrics = (await client.player.getLyrics(queue.tracks[0].info.author, queue.tracks[0].info.title).catch(() => null)) as string | null
        if(!lyrics) {
            return button.editReply({ content: `${button.user.toString()}, текст трека не был найден` })
        }

        if(1024 >= lyrics.length) {
            return button.editReply({
                embeds: [
                    client.storage.embeds.color(client.db.guilds.getColor(button.guild.id))
                    .setTitle(queue.tracks[0].info.title || 'Названия данного трека не найдено')
                    .setDescription(lyrics.length > 4000 ? lyrics.substring(0, 4000) + '...' : lyrics)
                ]
            })
        }

        const array = client.player.getLyricArray(lyrics)

        const message = await button.editReply({
            embeds: [ client.storage.embeds.lyric(queue.tracks[0].info.title, client.db.guilds.getColor(button.guild.id), array) ],
            components: client.storage.components.paginator(array, { count: 1, page: 0 })
        })

        return client.storage.collectors.interaction(
            button, message, async (int) => {
                if(!int.isButton()) return
    
                switch(int.customId) {
                    case 'left':
                        const left = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                        return button.editReply({
                            embeds: [ client.storage.embeds.lyric(queue.tracks[0].info.title, client.db.guilds.getColor(button.guild.id), array, left) ],
                            components: client.storage.components.paginator(array, { count: 1, page: left })
                        })
                    case 'right':
                        const right = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                        return button.editReply({
                            embeds: [ client.storage.embeds.lyric(queue.tracks[0].info.title, client.db.guilds.getColor(button.guild.id), array, right) ],
                            components: client.storage.components.paginator(array, { count: 1, page: right })
                        })
                }
            }
        )    
    }
)