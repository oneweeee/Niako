import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    'ban',
    {
        name: 'ban',
        description: 'Заблокировать участника',
        onlyMod: true,
        options: [
            {
                name: 'member',
                description: 'Пользователь, которого хотите Заблокировать',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'time',
                description: 'Время на которое хотите Заблокировать',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'reason',
                description: 'Причина заглушения пользователя',
                type: ApplicationCommandOptionType.String
            }
        ]
    },
    async (client, interaction) => {
        const member = interaction.options.getMember('member')!

        if(member.roles.cache.has(client.config.meta.banId)) {
            return interaction.reply({
                content: 'Участник и так заблокирован',
                ephemeral: true
            })
        }

        if(member.user.bot) {
            return interaction.reply({
                content: 'Бота **нельзя** заблокировать',
                ephemeral: true
            })
        }

        if(member.id === interaction.member.id) {
            return interaction.reply({
                content: 'Зачем ты, такая **милаха**, на себя используешь?',
                ephemeral: true
            })
        }

        const reason = interaction.options.get('reason')?.value as string || 'Без причины'
        const time = interaction.options.get('time', true)?.value as string

        const resolveTime = ms(time)

        if(isNaN(resolveTime)) {
            return interaction.reply({
                content: 'Время формат `1y`/`1w`/`1d`/`1h`/`1m`/`1s`',
                ephemeral: true
            })
        }

        await interaction.deferReply()

        return member.roles.add(client.config.meta.banId)
        .then(async () => {
            await client.db.history.create(interaction.guildId, member.id, interaction.member.id, 2, reason, time)
            
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.green().setDescription(`${interaction.member.toString()}, Вы **заблокировали** ${member.toString()} на **${time}**`)
                    .addFields({ name: 'Причина', value: reason })
                ]
            })
        }).catch(() => {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.red().setDescription(`${interaction.member.toString()}, У **меня** недостаточно **прав**, чтобы заблокировать ${member.toString()}`)
                ]
            })
        })
    }
)