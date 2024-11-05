import { Collection } from "discord.js";
import RuslanClient from "../client/Client";

export default class VoiceManager {
    private cacheOnline: Collection<string, NodeJS.Timer> = new Collection()

    constructor(
        private client: RuslanClient
    ) {}
}