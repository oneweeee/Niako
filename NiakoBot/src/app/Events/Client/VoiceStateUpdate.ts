import { NiakoClient } from "../../../struct/client/NiakoClient";
import { VoiceState } from "discord.js";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'voiceStateUpdate'
    },
    async (client: NiakoClient, oldState: VoiceState, newState: VoiceState) => {        
        if(!oldState?.channel && newState?.channel) {
            return (await Promise.all([
                client.voiceManager.join(newState),
                client.voiceManager.loggerStateJoin(newState)
            ]))
        } else if(oldState?.channel && !newState?.channel) {            
            return (await Promise.all([
                client.voiceManager.leave(oldState),
                client.voiceManager.loggerStateLeave(oldState)
            ]))
        } else if(oldState?.channel !== newState.channel) {
            return (await Promise.all([
                client.voiceManager.join(newState),
                client.voiceManager.leave(oldState),
                client.voiceManager.loggerStateUpdate(oldState, newState)
            ]))
        }
    }
)