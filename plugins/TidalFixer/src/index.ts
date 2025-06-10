import './index.native';
import { ipcRenderer, PlayState, unloads } from "@luna/lib";
import type { PlayStates } from './index.native';

ipcRenderer.on(unloads, 'TidalFixer:callMethod', (name: PlayStates) => {
    if (name === 'playPause') {
        name = PlayState.playing ? 'pause' : 'play';
    }

    PlayState[name]();    
});