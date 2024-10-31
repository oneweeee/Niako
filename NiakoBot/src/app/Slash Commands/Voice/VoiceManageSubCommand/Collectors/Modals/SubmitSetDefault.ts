import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.voice.get(interaction.guildId)

    const name = (modal.fields.getTextInputValue('name') || '$username')
    const limit = (modal.fields.getTextInputValue('limit') || '0')
    const roleId = (modal.fields.getTextInputValue('roleId') || interaction.guildId)

    if(client.util.isNumber(limit, { minChecked: 0, maxChecked: 99 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Настройки по умолчанию',
                    '**Количество** слотов должно быть **положительным** числом от **0** до **99**'
                )
            ],
        })
    }
    
    if(roleId !== interaction.guildId && !interaction.guild.roles.cache.get(roleId)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Настройки по умолчанию',
                    'Я **не** нашла указанную **роль** на сервере'
                )
            ],
        })
    }

    doc.default.roomName = name
    doc.default.roomLimit = Number(limit)
    doc.default.roleId = roleId
    doc.markModified('default')
    await client.db.modules.voice.save(doc)

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Настройки по умолчанию',
                `Вы **установили** настройки названия **${name}** и лимита **${limit}**`, true
            )
        ],
    })
}