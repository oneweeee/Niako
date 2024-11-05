import {
    GuildMember,
    CommandInteraction,
    ButtonInteraction,
    Locale,
} from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, target: GuildMember, button: ButtonInteraction<'cached'>, locale: Locale) => {
    const doc = await client.db.guilds.get(interaction.guildId, locale)

    if(doc.mutes.general?.roleId && target.roles.cache.has(doc.mutes.general?.roleId)) {
        await target.roles.remove(doc.mutes.general.roleId).catch(() => {})
    }
    
    if(doc.mutes.text?.roleId && target.roles.cache.has(doc.mutes.text?.roleId)) {
        await target.roles.remove(doc.mutes.text.roleId).catch(() => {})
    }

    if(doc.mutes.voice?.roleId && target.roles.cache.has(doc.mutes.voice?.roleId)) {
        await target.roles.remove(doc.mutes.voice.roleId).catch(() => {})
    }

    if((target?.communicationDisabledUntilTimestamp ?? 0) > Date.now()) {
        await target.disableCommunicationUntil(null).catch(() => {})
    }

    const res = await client.db.guildMembers.get(target)
    const get = res.actions.find((p) => p.active && !['Ban', 'Lockdown'].includes(p.type))
    if(get) {
        get.active = false
    }
    res.markModified('actions')
    await client.db.guildMembers.save(res)
    await client.db.audits.sendCustomModLogger('GuildMuteRemove', interaction.member, target, {}, interaction.guildLocale)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `Размут участника`,
                locale, `Вы **успешно** разглушили ${target.toString()}`,
                { indicateTitle: true, target }
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leave', true) ]
    })
}