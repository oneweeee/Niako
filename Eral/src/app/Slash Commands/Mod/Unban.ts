import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";

export default new BaseSlashCommand(
    'unban',
    {
        name: 'unban',
        description: 'Разблокировать участника',
        onlyMod: true,
        options: [
            {
                name: 'member',
                description: 'Пользователь, которого хотите разблокировать',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    async (client, interaction) => {
        const member = interaction.options.getMember('member')!

        if(!member.roles.cache.has(client.config.meta.banId)) {
            return interaction.reply({
                content: 'Участник не заблокирован',
                ephemeral: true
            })
        }

        await interaction.deferReply()

        return member.roles.remove(client.config.meta.banId)
        .then(async () => {            
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.green().setDescription(`${interaction.member.toString()}, Вы **разблокировали** ${member.toString()}`)
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