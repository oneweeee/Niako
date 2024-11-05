import { ColorResolvable, Locale, Snowflake } from "discord.js"
import { Schema, Document, model } from "mongoose"

interface IGuildMute {
    roleId?: string,
    enabled: boolean
}

export interface IGuild {
    guildId: string,

    locale: Locale,
    color?: ColorResolvable,
    autoRoles: Snowflake[],
    banId: string,
    mutes: {
        text: IGuildMute,
        voice: IGuildMute,
        general: IGuildMute,
        timeout: { enabled: boolean }
    },
    accessActionRoles: Snowflake[],
    gameRolePosition: string,
    gameRoles: { id: string, name: string, enabled: boolean }[],
    gameEnabled: boolean
}

export type TGuild = IGuild & Document

export default model<IGuild>(
    'Guild',
    new Schema(
        {
            guildId: { type: String, required: true },
            locale: { type: String, default: Locale.Russian },
            color: { type: String, default: '' },
            autoRoles: { type: [], default: [] },
            mutes: {
                type: Object,
                default: ({
                    text: {
                        enabled: false
                    },
                    voice: {
                        enabled: false
                    },
                    general: {
                        enabled: false
                    },
                    timeout: {
                        enabled: false
                    }
                })
            },
            accessActionRoles: { type: [], default: [] },
            gameRolePosition: { type: String, default: '' },
            gameRoles: { type: [], default: [] },
            gameEnabled: { type: Boolean, default: false }
        }
    ),
    'guild'
)