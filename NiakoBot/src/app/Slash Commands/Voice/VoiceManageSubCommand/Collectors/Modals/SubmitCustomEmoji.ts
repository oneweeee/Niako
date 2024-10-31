import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })

    const key = modal.customId.split('.')[1]
    
    const doc = await client.db.modules.voice.get(interaction.guildId)

    const emoji = modal.fields.getTextInputValue('emoji')
    if(!interaction.guild.emojis.cache.some((e) => `<:${e.name}:${e.id}>` === emoji)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(interaction.member,
                    'Изменить эмодзи', 'Я **не** нашла **эмодзи** на сервере...'
                )
            ],
        })
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    doc.buttons[key].emoji = emoji

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Установка эмодзи',
                `Выберите **в меню** эмодзи, для **его** изменения`
            )
        ],
        components: client.storage.components.selectCustomRoomEmoji(doc, interaction.guild)
    })

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Изменить эмодзи',
                `Вы **изменили** эмодзи **${key}** на **${emoji}**`, true
            )
        ],
    })
}