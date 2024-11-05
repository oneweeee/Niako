import { ButtonInteraction, ChannelSelectMenuInteraction, ModalSubmitInteraction, StringSelectMenuInteraction, ModalMessageModalSubmitInteraction, UserSelectMenuInteraction } from "discord.js";
import RuslanClient from "../client/Client";

export type TButtonInteractionRun = (client: RuslanClient, interaction: ButtonInteraction<'cached'>, lang: string) => Promise<any>
export type TModalInteractionRun = (client: RuslanClient, interaction: (ModalSubmitInteraction<'cached'>), lang: string) => Promise<any>
export type TMessageModalInteractionRun = (client: RuslanClient, interaction: (ModalMessageModalSubmitInteraction<'cached'>), lang: string) => Promise<any>
export type TChannelSelectInteractionRun = (client: RuslanClient, interaction: ChannelSelectMenuInteraction<'cached'>, lang: string) => Promise<any>
export type TStringSelectInteractionRun = (client: RuslanClient, interaction: StringSelectMenuInteraction<'cached'>, lang: string) => Promise<any>
export type TUserSelectInteractionRun = (client: RuslanClient, interaction: UserSelectMenuInteraction<'cached'>, lang: string) => Promise<any>

export default class BaseInteraction {
    constructor(
        readonly name: string,
        public run: (TButtonInteractionRun | TModalInteractionRun | TMessageModalInteractionRun | TChannelSelectInteractionRun | TStringSelectInteractionRun | TUserSelectInteractionRun),
        readonly options: { onlyOwner?: boolean } = {}
    ) {}
}