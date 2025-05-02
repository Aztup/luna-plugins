import { Tracer, type LunaUnload } from "@luna/core";
import { redux } from "@luna/lib";
import { MediaItem, PlayState } from "@luna/unstable";

export const { trace, errSignal } = Tracer("[last.fm]");

import { LastFM, ScrobbleOpts } from "./LastFM";

redux.actions["lastFm/DISCONNECT"]();

const delUndefined = <O extends Record<any, any>>(obj: O) => {
	for (const key in obj) if (obj[key] === undefined) delete obj[key];
};

const makeScrobbleOpts = async (mediaItem: MediaItem): Promise<ScrobbleOpts> => {
	const album = await mediaItem.album();
	const scrobbleOpts: Partial<ScrobbleOpts> = {
		track: await mediaItem.title(),
		artist: (await mediaItem.artist())?.name,
		album: await album?.title(),
		albumArtist: (await album?.artist())?.name,
		trackNumber: mediaItem.trackNumber?.toString(),
		mbid: await mediaItem.brainzId(),
		timestamp: (Date.now() / 1000).toFixed(0),
	};
	delUndefined(scrobbleOpts);
	return scrobbleOpts as ScrobbleOpts;
};

export { Settings } from "./Settings";

export const unloads = new Set<LunaUnload>();
unloads.add(
	MediaItem.onMediaTransition(unloads, (mediaItem) => {
		makeScrobbleOpts(mediaItem).then(LastFM.updateNowPlaying).catch(trace.msg.err.withContext(`Failed to updateNowPlaying!`));
	})
);
unloads.add(
	PlayState.onScrobble(unloads, async (mediaItem) => {
		const scrobbleOpts = await makeScrobbleOpts(mediaItem);
		LastFM.scrobble(scrobbleOpts)
			.catch(trace.msg.err.withContext(`Failed to scrobble!`))
			.then((res) => {
				if (res?.scrobbles) trace.log("Scrobbled", scrobbleOpts, res?.scrobbles["@attr"], res.scrobbles.scrobble);
			});
	})
);
