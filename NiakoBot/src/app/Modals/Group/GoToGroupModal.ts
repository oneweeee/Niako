import { ChannelType, ModalSubmitInteraction, TextChannel } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";

export default new BaseInteraction(
    'goToGroupModalWindow',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const res = await client.db.modules.group.get(modal.guildId)

        const code = modal.fields.getTextInputValue('code')
        const group = await client.db.groups.getCode(code, modal.guildId)
        if(!group) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.default(
                        modal.member, 'Войти в группу',
                        `Группа с **таким** кодом **не** была найдена`
                    )
                    .setColor(res.color)
                ]
            })
        }

        const channel = modal.guild.channels.cache.get(group.channelId)
        if(channel && channel.type === ChannelType.PrivateThread) {
            if(channel.guildMembers.has(modal.member.id)) {
                return modal.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            modal.member, 'Войти в группу',
                            `Вы **уже** находитесь в **этой** группе`
                        )
                        .setColor(res.color)
                    ]
                })
            }
            
            await channel.members.add(modal.member)
        }

        if(group.limitUse !== -1) {
            group.limitUse -= 1

            if(group.limitUse === 0) {
                group.limitUse = -1
                group.code = client.util.key(8).toUpperCase()
            }

            await client.db.groups.save(group)
        }

        return modal.editReply({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Войти в группу',
                    `Вы **вошли** в группу **${group.name}**`
                )
                .setColor(res.color)
            ]
        })
    }
)