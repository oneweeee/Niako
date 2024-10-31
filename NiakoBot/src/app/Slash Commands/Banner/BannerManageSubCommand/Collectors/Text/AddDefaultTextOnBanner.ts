import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    const text = modal.fields.getTextInputValue('text')
    const doc = await client.db.modules.banner.get(interaction.guildId)

    const res = client.db.boosts.getMaxCountTextsOnBanner(interaction.guildId)
    if(doc.items.filter((t) => t.type === 'Text').length >= res.count && !client.db.badges.partners.has(interaction.guildId)) {
        if(res.needLevel !== 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.needLevel(res.needLevel) ],
                components: client.storage.components.leaveBack('manage', lang, false, true)
            })
        }

        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Добавление текста',
                    `Вы **не** можете **добавить** больше чем **${res.count}** текстов`
                )
            ],
            components: client.storage.components.leaveBack('manage', lang, false)
        })
    }

    doc.items.push(
        {
            text,
            disabled: false,
            type: 'Text',
            textType: 'Default',

            color: '#ffffff',
            align: 'left',
            baseline: 'top',
            style: 'regular',
            length: 'None',
            font: 'Montserrat',
            size: 20,
            width: 'None',
            timezone: 'None',
            angle: 'None',

            x: 100,
            y: 100,

            createdTimestamp: Date.now()
        }
    )

    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Добавление текста',
                `Вы добавили текст **${text}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang)
    })
}