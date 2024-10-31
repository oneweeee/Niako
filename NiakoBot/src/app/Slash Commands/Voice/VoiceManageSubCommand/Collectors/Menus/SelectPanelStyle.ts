import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    await menu.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.voice.get(interaction.guildId)
    /*if(doc.type === 'Custom') {
        return menu.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Стиль панели', `Вы не можете изменить стиль панели, пока у Вас кастомный тип приватных комнат`, true) ],
        })
    }*/

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    await client.db.modules.voice.resolveEditRoomStyle(doc, menu.values[0] as any)

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.manageRoomConfig(interaction.member) ],
        components: client.storage.components.manageRoomConfig(doc)
    })

    return menu.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Стиль панели',
                `Вы **изменили** стиль **панели управления** на **${menu.values[0] === 'None' ? 'нет' : menu.values[0]}**`, true
            )
        ],
    })
}