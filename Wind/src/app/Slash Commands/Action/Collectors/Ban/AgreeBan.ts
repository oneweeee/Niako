import {
    GuildMember,
    CommandInteraction,
    ModalSubmitInteraction,
    Locale,
} from "discord.js"
import WindClient from "#client"
import ms from 'ms'

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, target: GuildMember, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
    const reason = modal.fields.getTextInputValue('reason')
    const time = (modal.fields.getTextInputValue('time') || '0')

    const res = await client.db.guildMembers.get(target)

    await target.ban({ reason })
    .then(async () => {
        res.actions.push(
            {
                type: 'Ban',
                executorId: interaction.member.id,
                createdTimestamp: Date.now(),
                active: true,
                time: time === '0' ? 0 : ms(time),
                reason
            }
        )
        await client.db.guildMembers.save(res)
        await client.db.audits.sendCustomModLogger('GuildBanAdd', interaction.member, target, { reason, time }, interaction.guildLocale)
        
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Бан участника`,
                    locale, `Вы **успешно** забанили ${target.toString()} на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`,
                    { indicateTitle: true, target }
                )
            ], components: []
        })
    })
    .catch(() => {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Бан участника`,
                    locale, `Произошла ошибка! Я **не** смог забанить ${target.toString()}`,
                    { indicateTitle: true, target }
                )
            ], components: [ client.storage.components.leaveCustom(locale) ]
        })
    })
}