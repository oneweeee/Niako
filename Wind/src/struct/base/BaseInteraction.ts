import WindClient from "../WindClient"
import {
    ButtonInteraction,
    Locale,
    ModalSubmitInteraction,
    StringSelectMenuInteraction
} from "discord.js"

export type InteractionButtonRun = (client: WindClient, interaction: ButtonInteraction<'cached'>, locale: Locale) => Promise<any>
export type InteractionModalRun = (client: WindClient, interaction: ModalSubmitInteraction<'cached'>, locale: Locale) => Promise<any>
export type InteractionStringMenuRun = (client: WindClient, interaction: StringSelectMenuInteraction<'cached'>, locale: Locale) => Promise<any>

export default class BaseInteraction {
    constructor(
        public readonly options: { name: string, disabled?: boolean },
        public exec: InteractionButtonRun | InteractionModalRun | InteractionStringMenuRun
    ) {}
}