import { VoiceState } from "discord.js";
import BaseListener from "#base/BaseListener";

export default new BaseListener(
    { name: 'voiceStateUpdate' },
    async (client, oldState: VoiceState, newState: VoiceState) => {
        if(!oldState?.channel && newState?.channel) {
            return client.managers.voice.loggerStateJoin(newState)
        } else if(oldState?.channel && !newState?.channel) {       
            client.managers.voice.leave(oldState)     
            return client.managers.voice.loggerStateLeave(oldState)
        } else if(oldState?.channel !== newState.channel) {
            client.managers.voice.update(oldState)     
            return client.managers.voice.loggerStateUpdate(oldState, newState)
        }
    }
)