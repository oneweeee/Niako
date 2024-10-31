import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const updateBanner = menu.values[0]

    const res = client.db.boosts.getMaxTimeUpdateBanner(interaction.guildId)
    if(!res.availables.includes(updateBanner) && !client.db.badges.partners.has(interaction.guildId)) {
        return interaction.editReply({
            embeds: [ client.storage.embeds.needLevel(res.needLevel) ],
            components: client.storage.components.leaveBack('manage', lang, false, true)
        })
    }

    const doc = await client.db.modules.banner.get(interaction.guildId)
    if(updateBanner === '1m' && doc.background.endsWith('.gif')) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка обновления баннера',
                    `Вы **не** можете установить **минуту** на **анимированый** баннер\n> Минимально Вы **можете** установить **2** минуты`
                )
            ],
            components: client.storage.components.leaveBack(`updateTime`, lang, false)
        })
    }
    
    doc.updated = updateBanner
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка обновления баннера',
                `Вы **установили** обновление баннера на **${updateBanner}**`
            )
        ],
        components: client.storage.components.leaveBack(`updateTime`, lang, true)
    })
}