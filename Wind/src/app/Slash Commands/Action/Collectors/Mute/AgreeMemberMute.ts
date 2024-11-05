import {
    GuildMember,
    CommandInteraction,
    ModalSubmitInteraction,
    Locale,
} from "discord.js"
import WindClient from "#client"
import ms from 'ms'

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, target: GuildMember, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
    const doc = await client.db.guilds.get(interaction.guildId, locale)

    const reason = modal.fields.getTextInputValue('reason')
    const time = (modal.fields.getTextInputValue('time') || '0')

    let mute = modal.customId.split('.')[0]
    let type: any = 'Timeout'

    switch(mute) {
        case 'general':
            type = 'GMute'
            if(doc.mutes.general?.roleId) {
                await target.roles.add(doc.mutes.general.roleId).catch(() => {})
            }
            break
        case 'voice':
            type = 'VMute'
            if(doc.mutes.voice?.roleId) {
                await target.roles.add(doc.mutes.voice.roleId).catch(() => {})
            }
            break
        case 'text':
            type = 'TMute'
            if(doc.mutes.text?.roleId) {
                await target.roles.add(doc.mutes.text.roleId).catch(() => {})
            }
            break
        default:
            await target.timeout(ms(time), reason).catch(() => {})
    }

    const res = await client.db.guildMembers.get(target)
    res.actions.push(
        {
            type,
            executorId: interaction.member.id,
            createdTimestamp: Date.now(),
            active: true,
            time: time === '0' ? 0 : ms(time),
            reason
        }
    )
    await client.db.guildMembers.save(res)
    await client.db.audits.sendCustomModLogger('GuildMuteAdd', interaction.member, target, { reason, time }, interaction.guildLocale)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                locale, `Вы **успешно** заглушили ${target.toString()} на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`,
                { indicateTitle: true, target }
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leave', true) ]
    })
}