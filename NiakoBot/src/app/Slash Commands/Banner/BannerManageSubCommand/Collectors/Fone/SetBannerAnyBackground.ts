import { AttachmentBuilder, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    /*const url = modal.fields.getTextInputValue('url')
    const doc = await client.db.modules.banner.get(interaction.guildId)
    const guildLevel = client.db.boosts.getGuildLevelById(interaction.guildId)

    if(url === doc.background) {
        return modal.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Установка фона', 'У Вас уже **установлена** такая ссылка') ]
        })
    }

    const formates = client.canvas.imageFormates.find((format) => url.endsWith(format))
    if(!formates) {
        return modal.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Установка фона', `Ссылка **должна** заканчиваться на **один** из этих вариантов: ${client.canvas.imageFormates.map((f) => `**${f}**`).join(', ')}`) ]
        })
    }

    if(formates === 'gif' && 2 > guildLevel && !client.db.badges.partners.has(interaction.guildId)) {
        return interaction.editReply({
            embeds: [ client.storage.embeds.needLevel(2) ],
            components: client.storage.components.leaveBack('manage', lang, false, true)
        })
    }

    const state = await client.canvas.loadImageState(url)
    if(!state) {
        return modal.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Установка фона', `Ссылка **недействительна** или **устарела**`) ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    if(formates === 'gif' && doc.type !== 'Compressed') {
        doc.type = 'Compressed'
        doc.items = client.db.modules.banner.resolveItems(doc.items)
    }

    if(formates === 'gif' && doc.updated === '1m') {
        doc.updated = '2m'
    }

    doc.background = url
    await client.db.modules.banner.save(doc)

    const res = await client.canvas.drawStaticBanner(interaction.guild, doc, doc.background)
    const att = new AttachmentBuilder(res.buffer, { name: `Banner.${res.gif?'gif':'png'}` })

    await interaction.editReply({
        embeds: [ client.storage.embeds.color().setImage(`attachment://${att.name}`) ],
        components: client.storage.components.manageBanner(interaction.member, doc, lang),
        files: [ att ]
    })*/

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка фона',
                `Вы установили **фон** баннера`
            )
        ]
    })
}