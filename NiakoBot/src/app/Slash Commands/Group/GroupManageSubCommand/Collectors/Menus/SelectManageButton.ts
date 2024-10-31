import { StringSelectMenuInteraction, CommandInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    await menu.deferUpdate()

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })
    
    const doc = await client.db.modules.group.get(interaction.guildId)
    const config = doc.buttons.find((b) => b.customId === menu.values[0])!

    return interaction.editReply({
        embeds: [ client.storage.embeds.groupManageButton(interaction.member, config) ],
        components: client.storage.components.groupManageButton(config)
    })
}