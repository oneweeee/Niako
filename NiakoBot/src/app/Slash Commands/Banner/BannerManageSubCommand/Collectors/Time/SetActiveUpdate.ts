import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const activeUpdate = menu.values[0]

    const doc = await client.db.modules.banner.get(interaction.guildId)
    
    doc.activeUserUpdated = activeUpdate
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка обновления активного',
                `Вы **установили** обновление активного участника на **${activeUpdate}**`
            )
        ],
        components: client.storage.components.leaveBack(`updateTime`, lang, true)
    })
}