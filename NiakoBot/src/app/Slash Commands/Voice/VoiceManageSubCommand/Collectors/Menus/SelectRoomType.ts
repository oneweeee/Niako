import { StringSelectMenuInteraction, CommandInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    await menu.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.voice.get(interaction.guildId)

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    doc.type = menu.values[0] as any
    doc.embed = JSON.stringify(client.storage.embeds.manageRoomPanel(doc).data)
    doc.buttons = client.db.modules.voice.createRoomComponents(doc, doc.style)

    doc.markModified('buttons')
    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.manageRoomConfig(interaction.member) ],
        components: client.storage.components.manageRoomConfig(doc)
    })

    return menu.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Тип приватных комнат',
                'Вы **установили** новый **тип** приватных комнат', true
            )
        ],
    })
}