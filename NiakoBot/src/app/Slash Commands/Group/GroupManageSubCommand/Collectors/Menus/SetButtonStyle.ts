import { StringSelectMenuInteraction, CommandInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    await menu.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.group.get(interaction.guildId)

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    const config = doc.buttons.find((b) => b.customId === menu.customId.split('.')[1])!

    config.style = Number(menu.values[0].split('.')[1])
    doc.markModified('buttons')
    await client.db.modules.group.save(doc)

    await client.db.modules.group.sendNewMessageInGroupChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.groupManageButton(interaction.member, config) ],
        components: client.storage.components.groupManageButton(config)
    })

    return menu.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Стиль кнопки',
                'Вы **установили** стиль кнопки', true
            )
        ],
    })
}