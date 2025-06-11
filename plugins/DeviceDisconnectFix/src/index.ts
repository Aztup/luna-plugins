import { LunaUnload } from "@luna/core";
import { redux, ipcRenderer } from "@luna/lib";

const unloads = new Set<LunaUnload>();

ipcRenderer.on(unloads, 'client.playback.playersignal', (args)=>{
    if ('devices' in args){ // New devices have been added, probably should listen for the other thing though...
        redux.actions['activePlayer/SET_ACTIVE_PLAYER']('PLAYER_SDK' as any);
    }
})