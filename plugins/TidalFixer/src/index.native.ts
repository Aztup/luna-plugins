import {globalShortcut, app} from 'electron';
export type PlayStates = 'next' | 'previous' | 'pause' | 'playPause' | 'play';

app.whenReady().then(() => {
    globalShortcut.unregisterAll();
    
    const actions = [
        ['MediaNextTrack', 'next'],
        ['MediaPreviousTrack', 'previous'],
        ['MediaStop', 'pause'],
        ['MediaPlayPause', 'playPause'],
    ]
    
    for (const [accelerator, method] of actions) {
        globalShortcut.register(accelerator, () => {
            luna.tidalWindow?.webContents.send('TidalFixer:callMethod', method);
        });
    }
});