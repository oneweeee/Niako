import {
    GuildMember,
    CommandInteraction,
    ButtonInteraction,
    Locale
} from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, target: GuildMember, button: ButtonInteraction<'cached'>, locale: Locale) => {
    const crash = await client.db.crashs.get(interaction.guildId)
    if(!interaction.guild.roles.cache.has(crash.banId)) {
        return button.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
    }

    if(!target.roles.cache.has(crash.banId)) {
        return button.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
    }

    const res = await client.db.guildMembers.get(target)

    await target.roles.remove(crash.banId)
    .then(async () => {
        const get = res.actions.find((p) => p.active && p.type === 'Lockdown')
        if(get) {
            get.active = false
        }
        res.markModified('actions')
        await client.db.guildMembers.save(res)
        await client.db.audits.sendCustomModLogger('GuildBanRemove', interaction.member, target, {}, interaction.guildLocale)

        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                    locale, `Вы **успешно** сняли **карантин** с ${target.toString()}`,
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
                    locale, `Произошла ошибка! Я **не** смог **снять** карантин с ${target.toString()}`,
                    { indicateTitle: true, target }
                )
            ],
            components: [ client.storage.components.leaveCustom(locale) ]
        })
    })
}