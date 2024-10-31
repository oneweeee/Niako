import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    CommandInteraction,
    ModalBuilder,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    const value = menu.values[0]

    if(value === 'Default') {
        return menu.showModal(
            new ModalBuilder()
            .setCustomId('modalWindowAddDefaultText')
            .setTitle('Добавить текст')
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('text')
                    .setLabel('Текст')
                    .setMaxLength(32)
                    .setPlaceholder('Niako лучший бот')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short)
                )
            )
        )
    }

    const doc = await client.db.modules.banner.get(interaction.guildId)

    const res = client.db.boosts.getMaxCountTextsOnBanner(interaction.guildId)
    if(doc.items.filter((t) => t.type === 'Text').length >= res.count) {
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
            text: value,
            disabled: false,
            type: 'Text',
            textType: value as any,

            color: '#ffffff',
            align: 'left',
            baseline: 'top',
            style: 'regular',
            length: 'None',
            font: 'Montserrat',
            size: 20,
            width: 'None',
            timezone: value === 'Time' ? doc.timezone : 'None',
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
                `Вы добавили текст **${client.constants.get(value, lang)}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang)
    })
}