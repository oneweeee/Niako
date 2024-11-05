import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";

export default new BaseSlashCommand(
    'unmute',
    {
        name: 'unmute',
        description: 'Разглушить участника',
        onlyMod: true,
        options: [
            {
                name: 'member',
                description: 'Пользователь, которого хотите разглушить',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    async (client, interaction) => {
        const member = interaction.options.getMember('member')!

        if(!member.isCommunicationDisabled()) {
            return interaction.reply({
                content: 'Участник не заглушен',
                ephemeral: true
            })
        }

        await interaction.deferReply()

        return member.timeout(null)
        .then(async () => {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.green().setDescription(`${interaction.member.toString()}, Вы **разглушили** ${member.toString()}`)
                ]
            })
        }).catch(() => {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.red().setDescription(`${interaction.member.toString()}, У **меня** недостаточно **прав**, чтобы разглушить ${member.toString()}`)
                ]
            })
        })
    }
)