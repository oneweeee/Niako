import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    const name = modal.fields.getTextInputValue('name')
    const url = modal.fields.getTextInputValue('url')

    const doc = await client.db.modules.banner.get(interaction.guildId)

    const res = client.db.boosts.getMaxCountImagesOnBanner(interaction.guildId)
    if(client.db.modules.banner.itemsFilterImage(doc).length >= res.count && !client.db.badges.partners.has(interaction.guildId)) {
        if(res.needLevel !== 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.needLevel(res.needLevel) ],
                components: client.storage.components.leaveBack('manage', lang, false, true)
            })
        }

        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Добавление изображения',
                    `Вы **не** можете **добавить** больше чем **${res.count}** изображений`
                )
            ],
            components: client.storage.components.leaveBack('manage', lang, false)
        })
    }

    const formates = client.canvas.imageFormates.find((format) => url.endsWith(format))
    if(!formates) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Добавление изображения',
                    `Ссылка **должна** заканчиваться на **один** из этих вариантов: ${client.canvas.imageFormates.map((f) => `**${f}**`).join(', ')}`
                )
            ]
        })
    }

    const state = await client.canvas.loadImageState(url)
    if(!state) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Добавление изображения',
                    `Ссылка **недействительна** или **устарела**`
                )
            ]
        })
    }

    doc.items.push(
        {
            name,
            url,
            disabled: false,
            type: 'Image',

            radius: 100,
            width: 100,
            height: 100,
            shape: false,

            x: 100,
            y: 100,

            createdTimestamp: Date.now()
        }
    )
    
    await modal.deferUpdate().catch(() => {})

    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Добавление изображения',
                `Вы **добавили** изображение с названием **${name}** по [ссылке](${url})`
            )
        ],
        components: client.storage.components.leave('manage', lang)
    })
}