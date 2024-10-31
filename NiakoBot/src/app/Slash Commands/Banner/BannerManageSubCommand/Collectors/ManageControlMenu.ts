import { AttachmentBuilder, ButtonInteraction, CommandInteraction } from "discord.js";
import { NiakoClient } from "../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, int: ButtonInteraction<'cached'>, lang: string) => {
    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: [],
        files: []
    })

    /*await int.deferUpdate().catch(() => {})

    const doc = await client.db.modules.banner.get(interaction.guildId)

    const res = await client.canvas.drawStaticBanner(interaction.guild, doc, client.canvas.checkBackground(doc))
    const att = new AttachmentBuilder(res.buffer, { name: 'Banner.png' })

    return interaction.editReply({
        embeds: [
            client.storage.embeds.color()
            .setImage(`attachment://${att.name}`)
        ],
        components: client.storage.components.manageBanner(interaction.member, doc, lang),
        files: [ att ]
    })*/
}