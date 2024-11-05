import WindClient from "../WindClient"
import {
    AutocompleteInteraction,
    ChatInputApplicationCommandData,
    CommandInteraction,
    Locale
} from "discord.js"

export interface SlashCommandData extends ChatInputApplicationCommandData {
    disabled?: boolean,
    category: 'info' | 'settings' | 'mod' | 'music'
}

export default class BaseSlashCommand {
    constructor(
        public readonly options: SlashCommandData,
        public exec: (client: WindClient, interaction: CommandInteraction<'cached'>, options: { interactionCached: number, locale: Locale }) => Promise<any>,
        public autoComplete?: (client: WindClient, interaction: AutocompleteInteraction<'cached'>) => Promise<any>
    ) {}
}