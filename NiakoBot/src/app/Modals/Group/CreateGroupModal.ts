import { ChannelType, ModalSubmitInteraction, TextChannel } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";

export default new BaseInteraction(
    'createGroupModalWindow',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const res = await client.db.modules.group.get(modal.guildId)

        const name = modal.fields.getTextInputValue('name')

        const channel = await (modal.channel as TextChannel).threads.create({ name, type: ChannelType.PrivateThread })

        await channel.members.add(modal.member)
        const message = await channel.send({
            embeds: [ client.storage.embeds.groupManage(modal.member, name).setColor(res.color) ],
            components: client.storage.components.groupManage()
        })

        await message.pin()

        const doc = await client.db.groups.create(modal.guildId, modal.user.id, channel.id)
        doc.name = name
        doc.code = client.util.key(8).toUpperCase()
        doc.messageId = message.id
        doc.createdTimestamp = Date.now()
        await client.db.groups.save(doc)

        return modal.editReply({
            embeds: [
                client.storage.embeds.default(
                    modal.member, 'Создать группу',
                    `Вы **создали** группу **${name}**`
                )
                .setColor(res.color)
            ]
        })
    }
)