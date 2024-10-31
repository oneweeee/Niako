import { NiakoClient } from "../client/NiakoClient";
import {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    ModalMessageModalSubmitInteraction,
    UserSelectMenuInteraction
} from "discord.js";

export type TButtonInteractionRun = (client: NiakoClient, interaction: ButtonInteraction<'cached'>, lang: string) => Promise<any>
export type TModalInteractionRun = (client: NiakoClient, interaction: (ModalSubmitInteraction<'cached'>), lang: string) => Promise<any>
export type TMessageModalInteractionRun = (client: NiakoClient, interaction: (ModalMessageModalSubmitInteraction<'cached'>), lang: string) => Promise<any>
export type TChannelSelectInteractionRun = (client: NiakoClient, interaction: ChannelSelectMenuInteraction<'cached'>, lang: string) => Promise<any>
export type TStringSelectInteractionRun = (client: NiakoClient, interaction: StringSelectMenuInteraction<'cached'>, lang: string) => Promise<any>
export type TUserSelectInteractionRun = (client: NiakoClient, interaction: UserSelectMenuInteraction<'cached'>, lang: string) => Promise<any>

export default class BaseInteraction {
    constructor(
        readonly name: string,
        public run: (TButtonInteractionRun | TModalInteractionRun | TMessageModalInteractionRun | TChannelSelectInteractionRun | TStringSelectInteractionRun | TUserSelectInteractionRun),
        readonly options: { onlyOwner?: boolean } = {}
    ) {}
}