import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";

export default new BaseSlashCommand(
    'ping',
    {
        module: 'info',
        name: 'ping',
        description: 'Посмотреть задержку бота',
        detailedDescription: 'Показывает информацию об ответе бота на команды'
    },

    async (client, interaction, lang, { interactionCached }) => {
        await interaction.deferReply({ ephemeral: true })

        return interaction.editReply({
            content: (
                `Кластер: **${client.cluster.id+1}** (${client.cluster.id+1}/${client.cluster.count})` + '\n'
                + `Сегменты: [ ${[...client.cluster.ids.keys()].map((n) => Number(n) + 1).join(', ')} ]` + '\n'
                + `${client.config.emojis.space}・Задержка: **${client.ws.ping}**ms` + '\n'
                + `${client.config.emojis.space}・Обработка команд: **${Date.now()-interactionCached}**ms` + '\n'
                + `${client.config.emojis.space}・База данных: **${client.db.ping}**ms`
            )
        })
        
        /*const json = await client.request.getStats()
        if(!json) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Пинг', 'Сервис в данный момент не доступен') ]
            })
        }

        return interaction.editReply({
            embeds: [
                client.storage.embeds.color()
                .setTitle('Пинг')
                .setThumbnail(client.util.getAvatar(client.user))
                .addFields(
                    { name: `Shard: ${getShard?.shardId}`, value: (`**Пинг:** ${client.ws.ping}\n**Состояние:** ${getShard?.state}`), inline: true }
                ).setFooter({ text: `Ответ на сообщение: ${Math.round(interactionCached - interaction.createdTimestamp)}ms` })
            ]
        })*/
    }
)