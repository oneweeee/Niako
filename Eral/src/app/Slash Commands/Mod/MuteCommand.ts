import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    'mute',
    {
        name: 'mute',
        description: 'Заглушить участника',
        onlyMod: true,
        options: [
            {
                name: 'member',
                description: 'Пользователь, которого хотите заглушить',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'time',
                description: 'Время на которое хотите заглушить',
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

        if(member.isCommunicationDisabled()) {
            return interaction.reply({
                content: 'Участник и так заглушен',
                ephemeral: true
            })
        }

        if(member.user.bot) {
            return interaction.reply({
                content: 'Бота **нельзя** заглушить',
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

        return member.timeout(resolveTime, reason)
        .then(async () => {
            await client.db.history.create(interaction.guildId, member.id, interaction.member.id, 1, reason, time)

            return interaction.editReply({
                embeds: [
                    client.storage.embeds.green().setDescription(`${interaction.member.toString()}, Вы **заглушили** ${member.toString()} на **${time}**`)
                    .addFields({ name: 'Причина', value: reason })
                ]
            })
        }).catch(() => {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.red().setDescription(`${interaction.member.toString()}, У **меня** недостаточно **прав**, чтобы заглушить ${member.toString()}`)
                ]
            })
        })
    }
)