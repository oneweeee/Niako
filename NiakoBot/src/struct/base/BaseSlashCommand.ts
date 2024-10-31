import { NiakoClient } from "../client/NiakoClient";
import {
    ChatInputApplicationCommandData,
    CommandInteraction,
    ApplicationCommandOptionData,
    PermissionResolvable,
    AutocompleteInteraction
} from "discord.js";

export type ISlashCommandModule = 'info' | 'util' | 'music' | 'unknown'

export type ISlashCommandOptionsData = ApplicationCommandOptionData & { usage?: string, detailedDescription: string }

export interface ISlashCommandOptions extends ChatInputApplicationCommandData {
    disabled?: boolean,
    voice?: boolean,
    onlyOwner?: boolean,
    module: ISlashCommandModule,
    cooldown?: number,
    detailedDescription: string,
    usage?: string,
    examples?: { action: string, description: string }[],
    options?: ISlashCommandOptionsData[],
    needClientPermissions?: PermissionResolvable[]
}


export interface ISlashCommandRunOptions {
    interactionCached: number
}

export type ISlashCommandRun = (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string, options: ISlashCommandRunOptions) => Promise<any>
export type ISlashAutocompleteRun = (client: NiakoClient, interaction: AutocompleteInteraction<'cached'>, lang: string) => Promise<any>

export default class BaseSlashCommand {
    constructor(
        readonly name: string,
        readonly options: ISlashCommandOptions,
        public run: ISlashCommandRun,
        public autocomplete?: ISlashAutocompleteRun,
    ) {}
}