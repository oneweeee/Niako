import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const guildLevel = client.db.boosts.getGuildLevelById(interaction.guildId)
    
    const url = modal.fields.getTextInputValue('url')

    const times = modal.customId.split('.')[1].split('-')

    if(!url) {
        if(doc.backgrounds) {
            for ( let i = 0; times.length > i; i++ ) {
                const time = `${times[i]}:00`
                if(doc.backgrounds[time]) {
                    delete doc.backgrounds[time]
                }
            }

            doc.markModified('backgrounds')
            await client.db.modules.banner.save(doc)
        }

        await modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member,  'Установка временных фонов',
                    `Вы **сбросили** фоны для ${times.map((s) => `\`${s}:00\``).join(', ')}`
                )
            ]
        })

        return interaction.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member,  'Установка временных фонов',
                    `Вы **сбросили** фоны для ${times.map((s) => `\`${s}:00\``).join(', ')}`
                )
            ],
            components: client.storage.components.leaveBack('setAlarmBackground', lang, true)
        })
    } else {
        if(!doc.backgrounds) doc.backgrounds = {}

        const formates = client.canvas.imageFormates.find((format) => url.endsWith(format))
        if(!formates) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Установка фона',
                        `Ссылка **должна** заканчиваться на **один** из этих вариантов: ${client.canvas.imageFormates.map((f) => `**${f}**`).join(', ')}`
                    )
                ]
            })
        }
    
        if(formates === 'gif' && 2 > guildLevel) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.needLevel(2) ],
                components: client.storage.components.leaveBack('manage', lang, false, true)
            })
        }

        const state = await client.canvas.loadImageState(url)
        if(!state) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Установка фона',
                        `Ссылка **недействительна** или **устарела**`
                    )
                ]
            })
        }

        for ( let i = 0; times.length > i; i++ ) {
            const time = `${times[i]}:00`
            doc.backgrounds[time] = url
        }

        doc.markModified('backgrounds')
        await client.db.modules.banner.save(doc)

        await modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member,  'Установка временных фонов',
                    `Вы **установили** фон [перейти](${url}) для ${times.map((s) => `\`${s}:00\``).join(', ')}`
                )
            ]
        })

        return interaction.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member,  'Установка временных фонов',
                    `Вы **установили** фон [перейти](${url}) для ${times.map((s) => `\`${s}:00\``).join(', ')}`
                )
            ],
            components: client.storage.components.leaveBack('setAlarmBackground', lang, true)
        })
    }
}