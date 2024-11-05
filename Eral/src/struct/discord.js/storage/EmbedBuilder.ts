import { APIEmbed, EmbedBuilder, EmbedData, GuildMember } from 'discord.js'
import { HistoryTypes, IHistory } from '../../../db/history/HistorySchema';
import Client from '../../client/Client';

export default class extends EmbedBuilder {
    constructor(
        private client: Client
    ) { super({ color: client.config.colors.discord }) }

    copy(data: EmbedData | APIEmbed) {
        return new EmbedBuilder(data)
    }

    loading(premium: boolean = false) {
        return this.color(premium).setDescription('Загрузка...')
    }

    color(eral: boolean = false) {
        return new EmbedBuilder().setColor(eral ? this.client.config.colors.main : this.client.config.colors.discord)
    }

    info(name: string) {
        return this.color().setAuthor({ name, iconURL: this.client.config.meta.iconInfo })
    }

    default(member: GuildMember, title: string, description: string, options?: { target?: GuildMember, color?: boolean, indicateTitle?: boolean }) {
        return this.color(options?.color).setDescription(`${member.toString()}, ${description}`).setThumbnail(this.client.util.getAvatar(member))
        .setTitle(options?.indicateTitle ? `${title} — ${options.target ? options.target.user.tag : member.user.tag}` : title)
    }

    green() {
        return new EmbedBuilder().setColor(this.client.config.colors.green)
    }
    
    red() {
        return new EmbedBuilder().setColor(this.client.config.colors.red)
    }

    history(member: GuildMember, array: IHistory[], page: number = 0) {
        const maxElementForPage = 5
        const max = Math.ceil(array.length/maxElementForPage) === 0 ? 1 : Math.ceil(array.length/maxElementForPage)

        const embed = this.color()
        .setTitle(`История наказаний — ${member.user.tag}`)
        .setThumbnail(this.client.util.getAvatar(member))
        .setFooter({text: `Страница: ${page+1}/${max}`})

        let typeAndDates: string = ''
        let reasons: string = ''
        let moderators: string = ''

        for ( let i = page*maxElementForPage; (i < array.length && i < maxElementForPage*(page+1)) ; i++ ) {
            const res = array[i]
            const author = member.guild.members.cache.get(res.staffId)

            typeAndDates += `${this.client.util.resolveHistoryType(res.type)} [<t:${Math.round(res.createdTimestamp/1000)}:t>|<t:${Math.round(res.createdTimestamp/1000)}:d>]\n`
            reasons += `${res.reason}\n`
            moderators += `${author ? author.toString() : res.staffId}\n`
        }

        if(typeAndDates === '' || reasons === '' || moderators === '') {
            embed.setDescription('Нарушения **отсутствуют**')
        } else {
            const bans = array.filter((p) => p.type === HistoryTypes.Ban).length
            const mutes = array.filter((p) => p.type === HistoryTypes.Mute).length
            const warns = array.filter((p) => p.type === HistoryTypes.Warn).length

            embed.setDescription(`За всё время **${warns}** варнов, **${mutes}** мутов, **${bans}** банов`)
            embed.addFields(
                { name: '> Тип/Дата:', inline: true, value: typeAndDates },
                { name: '> Причина:', inline: true, value: reasons },
                { name: '> Модератор:', inline: true, value: moderators }
            )
        }

        return embed
    }
}