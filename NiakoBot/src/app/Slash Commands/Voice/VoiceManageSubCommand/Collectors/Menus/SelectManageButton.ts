import { StringSelectMenuInteraction, CommandInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    await menu.deferUpdate()

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })
    
    const doc = await client.db.modules.voice.get(interaction.guildId)
    const config = client.db.modules.voice.getButtonConfig(doc, menu.values[0] as any)

    return interaction.editReply({
        embeds: [ client.storage.embeds.roomManageButton(interaction.member, config) ],
        components: client.storage.components.manageRoomButton(config)
    })
}