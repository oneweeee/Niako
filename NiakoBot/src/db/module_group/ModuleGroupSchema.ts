import { Document, Schema, SchemaTypes, model } from "mongoose";
import { ButtonStyle, ColorResolvable } from "discord.js";
import emojis from "../../settings/emoji";

export interface IModuleGroupButton {
    customId: string,
    style: (ButtonStyle.Primary | ButtonStyle.Secondary | ButtonStyle.Success | ButtonStyle.Danger),
    label?: string,
    emoji?: string
}

export interface IModuleGroup {
    guildId: string,
    
    state: boolean,
    messageId: string,
    parentId: string,
    channelId: string,
    webhook: {
        id: string,
        avatar: string,
        username: string
    },
    color: ColorResolvable,
    embed: string,
    buttons: IModuleGroupButton[]
}

export type TModuleGroup = IModuleGroup & Document

export const ModuleGroupSchema = model<IModuleGroup>(
    'ModuleGroup',
    new Schema<IModuleGroup>(
        {
            guildId: { type: SchemaTypes.String, required: true },

            state: { type: SchemaTypes.Boolean, default: false },
            messageId: { type: SchemaTypes.String, default: '0' },
            parentId: { type: SchemaTypes.String, default: '0' },
            channelId: { type: SchemaTypes.String, default: '0' },
            webhook: {
                type: Object,
                default: ({
                    id: '0',
                    username: 'Niako',
                    avatar: 'avatar'
                })
            },
            color: { type: SchemaTypes.String, default: '#2B2D31' },
            embed: { type: SchemaTypes.String, default: '' },
            buttons: {
                type: Array as any,
                'default': [
                    {
                        customId: 'createGroup',
                        style: ButtonStyle.Secondary,
                        label: 'Создать группу',
                        emoji: emojis.createGroup
                    },
                    {
                        customId: 'goToGroup',
                        style: ButtonStyle.Secondary,
                        label: 'Присоединиться',
                        emoji: emojis.goToGroup
                    }
                ]
            }
        }
    ),
    'module_group'
)