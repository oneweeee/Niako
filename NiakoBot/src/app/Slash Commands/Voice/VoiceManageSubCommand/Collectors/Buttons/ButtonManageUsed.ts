import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.voice.get(interaction.guildId)
    const config = client.db.modules.voice.getButtonConfig(doc, button.customId.split('.')[1] as any)

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    config.position = client.db.modules.voice.resolveButtonPosition(doc)
    config.used = !config.used
    doc.type = 'Custom'
    doc.markModified('buttons')
    await client.db.modules.voice.save(doc)

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    return interaction.editReply({
        embeds: [ client.storage.embeds.roomManageButton(interaction.member, config) ],
        components: client.storage.components.manageRoomButton(config)
    })
}