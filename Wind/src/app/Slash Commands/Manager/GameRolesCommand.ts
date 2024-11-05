import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'gameroles',
        description: 'On or off auto add game roles',
        descriptionLocalizations: {
            'ru': 'Включить или выключить авто выдачу игровых ролей'
        },
        category: 'settings'
    },
    async (client, interaction, { locale }) => {
        await interaction.deferReply({ ephemeral: true })

        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id)
        ) {
            return interaction.editReply({ content: `${client.services.lang.get("commands.autorole.no_rights", locale)}` })
        }

        if(
            interaction.guild.members.me && !interaction.guild.members.me.permissions.has('ManageRoles')
        ) {
            return interaction.editReply({ content: `${client.services.lang.get("commands.autorole.no_rights_bot", locale)}` })
        }

        const res = await client.db.guilds.get(interaction.guildId, locale)

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.gameRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), res.gameRolePosition, locale) ],
            components: client.storage.components.gameRoles(res, locale)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'state':
                            const doc = await client.db.guilds.get(interaction.guildId, locale)
                            doc.gameEnabled = !doc.gameEnabled
                            await client.db.guilds.save(doc)
                    
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.gameRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), doc.gameRolePosition, locale) ],
                                components: client.storage.components.gameRoles(doc, locale)            
                            })
                        case 'clear':
                            const clearDoc = await client.db.guilds.get(interaction.guildId, locale)
                            clearDoc.gameRolePosition = ''
                            await client.db.guilds.save(clearDoc)
                    
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.gameRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), clearDoc.gameRolePosition, locale) ],
                                components: client.storage.components.gameRoles(clearDoc, locale)            
                            })
                    }
                } else if(int.isRoleSelectMenu()) {
                    const doc = await client.db.guilds.get(interaction.guildId, locale)
                    doc.gameRolePosition = int.roles.first()!.id
                    await client.db.guilds.save(doc)
            
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.gameRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), doc.gameRolePosition, locale) ],
                        components: client.storage.components.gameRoles(doc, locale)            
                    })
                }
            }
        )
    }
)