import './index.native';
import { ipcRenderer, PlayState } from "@luna/lib";
import type { LunaUnload } from '@luna/core';
import type { PlayStates } from './index.native';

export const unloads = new Set<LunaUnload>();

ipcRenderer.on(unloads, 'TidalFixer:callMethod', (name: PlayStates) => {
    if (name === 'playPause') {
        name = PlayState.playing ? 'pause' : 'play';
    }

    PlayState[name]();    
});