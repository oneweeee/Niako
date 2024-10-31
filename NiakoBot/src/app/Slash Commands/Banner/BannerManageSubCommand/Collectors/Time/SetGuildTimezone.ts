import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const doc = await client.db.modules.banner.get(interaction.guildId)
    
    doc.timezone = menu.values[0]
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка таймзоны',
                `Вы **установили** таймзону баннера на **${menu.values[0]}**`
            )
        ],
        components: client.storage.components.leaveBack(`setBannerTimezone`, lang, true)
    })
}