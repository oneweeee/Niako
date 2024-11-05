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

    const crash = await client.db.crashs.get(interaction.guildId)
    if(!interaction.guild.roles.cache.has(crash.banId)) {
        return modal.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
    }

    if(target.roles.cache.has(crash.banId)) {
        return modal.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
    }

    const res = await client.db.guildMembers.get(target)

    await target.roles.add(crash.banId)
    .then(async () => {
        res.actions.push(
            {
                type: 'Lockdown',
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
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                    locale, `Вы **успешно** выдали ${target.toString()} карантин на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`,
                    { indicateTitle: true, target }
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leave', true) ]
        })
    })
    .catch(() => {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                    locale, `Произошла ошибка! Я **не** смог **выдать** карантин ${target.toString()}`,
                    { indicateTitle: true, target }
                )
            ],
            components: [ client.storage.components.leaveCustom(locale) ]
        })
    })
}