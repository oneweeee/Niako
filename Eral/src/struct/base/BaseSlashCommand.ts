import { ChatInputApplicationCommandData, CommandInteraction, AutocompleteInteraction } from "discord.js";
import RuslanClient from "../client/Client";

export type ISlashCommandModule = 'info' | 'util' | 'music' | 'unknown'

export interface ISlashCommandOptions extends ChatInputApplicationCommandData {
    onlyMod?: boolean
}

export type ISlashCommandRun = (client: RuslanClient, interaction: CommandInteraction<'cached'>) => Promise<any>
export type ISlashAutocompleteRun = (client: RuslanClient, interaction: AutocompleteInteraction<'cached'>) => Promise<any>

export default class BaseSlashCommand {
    constructor(
        readonly name: string,
        readonly options: ISlashCommandOptions,
        public run: ISlashCommandRun,
        public autocomplete?: ISlashAutocompleteRun,
    ) {}
}