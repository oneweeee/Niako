import { ModalSubmitInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'modalBackupCreate' },
    async (client: WindClient, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
        const name = (modal.fields.getTextInputValue('name') || modal.guild.name)
        const doc = await client.db.backups.create(modal.member, name).catch(() => null)
        if(doc) {
            return modal.reply({
                content: `${modal.user.toString()}, вы **создали** бэкап для сервера \`${modal.guild.name}\``
            })
        } else {
            return modal.reply({ content: `${modal.user.toString()}, ошибка с билдингом данных сервера...` })
        }
    }
)