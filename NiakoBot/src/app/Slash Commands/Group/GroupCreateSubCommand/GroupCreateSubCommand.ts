import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction, ChannelType } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.group.get(interaction.guildId)

    if(doc.state) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Создание групп',
                    `У Вас **уже** создана система **групп**`, true
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })

    const parent = await interaction.guild.channels.create(
        {
            name: 'Приватное общение', type: ChannelType.GuildCategory,
            permissionOverwrites: [
                {
                    id: interaction.guildId,
                    deny: [
                        'ViewChannel',
                        'MentionEveryone',
                        'CreatePrivateThreads',
                        'CreatePrivateThreads',
                        'UseApplicationCommands',
                        'UseEmbeddedActivities',
                        'AddReactions',
                        'EmbedLinks',
                        'SendMessages'
                    ]
                }
            ]
        }
    )

    const text = await interaction.guild.channels.create(
        { name: '👤・группа', type: ChannelType.GuildText, parent: parent.id }
    )

    const webhook = await text.createWebhook(
        { name: client.user.username, avatar: `${__dirname}/../../../../../assets/images/Logo.png`}
    ).catch(() => null)

    if(!webhook) {
        await text.delete().catch(() => {})
        await parent.delete().catch(() => {})
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Создание приватных групп',
                    `Мне **не** удалось создать вебхук`, true
                )
            ]
        })
    }

    const message = await webhook.send({
        embeds: [ client.storage.embeds.groupMessage() ],
        components: client.storage.components.groupMessage(doc)
    })

    doc.embed = JSON.stringify(client.storage.embeds.groupMessage())
    doc.webhook.id = webhook.id
    doc.webhook.username = client.user.username
    doc.webhook.avatar = `${__dirname}/../../../../../assets/images/Logo.png`
    doc.messageId = message.id
    doc.parentId = parent.id
    doc.channelId = text.id
    doc.state = true
    doc.markModified('webhook')
    await client.db.modules.group.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Создание групп',
                `Вы создали **систему** приватных **групп**`, true
            )
        ]
    })
}
