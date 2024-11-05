import { ChannelType, ModalSubmitInteraction } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";

export default new BaseInteraction(
    'showModalWindowAppeal',
    async (client: RuslanClient, modal: ModalSubmitInteraction<'cached'>) => {
        await modal.deferReply({ ephemeral: true })

        const channel = modal.guild.channels.cache.get(client.config.block.loggerId)
        if(channel && channel.type === ChannelType.GuildText) {
            await channel.send({
                embeds: [
                    client.storage.embeds.color()
                    .setAuthor({ name: `Новая аппеляция`, })
                    .addFields(
                        { name: '> Пользователь:', value: `・${modal.user.toString()}\n・${modal.user.tag}\n・${modal.user.id}` },
                        { name: '> Причина:', value: client.util.toCode(modal.fields.getTextInputValue('reason'), 'fix') }
                    ).setTimestamp().setThumbnail(client.util.getAvatar(modal.user))
                ]
            })
        }

        client.db.appeal.add(modal.user.id)

        return modal.editReply({ content: `Вы заполнили **аппеляцию** на разблокировку` })
    }
)