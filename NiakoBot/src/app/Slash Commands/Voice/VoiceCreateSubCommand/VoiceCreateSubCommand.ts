import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction, ChannelType } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.voice.get(interaction.guildId)

    if(doc.state) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Создание приватных комнат',
                    `У Вас **уже** создана система **приватных комнат**`, true
                )
            ]
        })
    }

    const type = interaction.options.get('type', true)?.value as any

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })

    const parent = await interaction.guild.channels.create(
        {
            name: 'Приватные Комнаты', type: ChannelType.GuildCategory,
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
        { name: 'управление', type: ChannelType.GuildText, parent: parent.id }
    )

    const voice = await interaction.guild.channels.create(
        { name: '[+] Комната', type: ChannelType.GuildVoice, parent: parent.id }
    )

    const webhook = await text.createWebhook(
        { name: client.user!.username, avatar: `${__dirname}/../../../../../assets/images/Logo.png`}
    ).catch(() => null)

    if(!webhook) {
        await text.delete().catch(() => {})
        await voice.delete().catch(() => {})
        await parent.delete().catch(() => {})
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Создание приватных комнат',
                    `Мне **не** удалось создать вебхук`, true
                )
            ]
        })
    }

    doc.state = true
    doc.type = type
    doc.messageId = '0'
    doc.webhook.id = webhook.id
    doc.webhook.username = 'Niako'
    doc.webhook.avatar = `${__dirname}/../../../../../assets/images/Logo.png`
    doc.voiceChannelId = voice.id
    doc.textChannelId = text.id
    doc.parentId = parent.id
    doc.color = '#2b2d31'
    doc.style = 'Default'
    doc.line = type === 'Default' ? client.config.meta.line : 'None'
    doc.game = false
    doc.default.roomLimit = 0
    doc.default.roomName = '$username'
    doc.default.roleId = interaction.guildId
    doc.buttons = client.db.modules.voice.createRoomComponents(doc, 'Default')

    const embed = client.storage.embeds.manageRoomPanel(doc)

    doc.embed = JSON.stringify(embed.data)

    const message = await webhook.send({
        embeds: [ JSON.parse(client.util.replaceVariable(doc.embed, { moduleVoice: doc, guild: interaction.guild })) ],
        components: client.storage.components.settingPrivateRoom(doc)
    })
    
    doc.messageId = message.id
    doc.markModified('default')
    doc.markModified('webhook')
    await client.db.modules.voice.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Создание приватных комнат',
                `Вы создали **${doc.type === 'Default' ? 'обычную' : doc.type === 'Full' ? 'полную' : doc.type === 'Compact' ? 'компактную' : '**полный обычный**'}** систему **приватных комнат**`, true
            )
        ]
    })
}