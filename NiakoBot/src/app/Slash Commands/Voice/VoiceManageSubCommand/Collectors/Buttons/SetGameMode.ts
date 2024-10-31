import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    await button.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.voice.get(interaction.guildId)

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    doc.game = !doc.game

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.manageRoomConfig(interaction.member) ],
        components: client.storage.components.manageRoomConfig(doc)
    })

    return button.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Меню игр',
                `Меню **игр** было **${doc.game?'добавлено':'убрано'}** в панель **управления** приватными комнатами`, true
            )
        ],
    })
}