import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })

    const key = modal.customId.split('.')[1] as any
    
    const doc = await client.db.modules.voice.get(interaction.guildId)
    const config = client.db.modules.voice.getButtonConfig(doc, key)

    const emoji = modal.fields.getTextInputValue('emoji')

    if(!config.label && !emoji) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member, 'Эмодзи кнопки',
                    `Вы **не** можете убрать **эмодзи**, когда не установлено **этикетка**`, true
                )
            ],
        })
    }

    if(emoji && !interaction.guild.emojis.cache.some((e) => `<:${e.name}:${e.id}>` === emoji)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Эмодзи кнопки',
                    'Я **не** нашла **эмодзи** на сервере...'
                )
            ],
        })
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    config.emoji = emoji ? emoji : undefined
    doc.markModified('buttons')
    await client.db.modules.voice.save(doc)

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.roomManageButton(interaction.member, config) ],
        components: client.storage.components.manageRoomButton(config)
    })

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Эмодзи кнопки',
                emoji ? `Вы **изменили** эмодзи **${emoji}** на **${key}**` : `Вы **сбросили** эмодзи на **${key}**`, true
            )
        ],
    })
}