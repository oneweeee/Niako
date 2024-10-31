import SlashCommandHandler from "../handlers/SlashCommandHandler";
import InteractionHandler from "../handlers/InteractionHandler";
import CollectorBuilder from "./storage/CollectorBuilder";
import ComponentBuilder from "./storage/ComponentBuilder";
import { NiakoClient } from "../client/NiakoClient";
import EventHandler from "../handlers/EventHandler";
import EmbedBuilder from "./storage/EmbedBuilder";

export default class DiscordStorage {
    public collectors: CollectorBuilder = new CollectorBuilder()
    
    constructor(
        private client: NiakoClient
    ) {
        this.slashCommands = new SlashCommandHandler(client)
        this.events = new EventHandler(client)

        this.buttons = new InteractionHandler(client, 'Buttons')
        this.modals = new InteractionHandler(client, 'Modals')

        this.channelMenus = new InteractionHandler(client, 'Menus Channel')
        this.stringMenus = new InteractionHandler(client, 'Menus String')
        this.userMenus = new InteractionHandler(client, 'Menus User')
        
        this.embeds = new EmbedBuilder(client)
        this.components = new ComponentBuilder(client)
    }

    public slashCommands: SlashCommandHandler
    public events: EventHandler
    
    public buttons: InteractionHandler
    public modals: InteractionHandler

    public channelMenus: InteractionHandler
    public stringMenus: InteractionHandler
    public userMenus: InteractionHandler

    public embeds: EmbedBuilder
    public components: ComponentBuilder
}