import { Quality, type MediaItem } from "@luna/lib";

export const setQualityTags = (trackRow: Element, mediaItem: MediaItem) => {
	const trackTitle = trackRow.querySelector<HTMLElement>(`[data-test="table-row-title"]`);
	if (trackTitle === null) return;

	const { qualityTags, bestQuality } = mediaItem;
	const id = String(mediaItem.id);
	if (qualityTags.length === 0) return;

	if (qualityTags.length === 1 && qualityTags[0] === Quality.High && bestQuality === Quality.High) return;

	const span = trackTitle.querySelector(".quality-tag-container") ?? document.createElement("span");
	if (span.getAttribute("track-id") === id) return;

	span.className = "quality-tag-container";
	span.setAttribute("track-id", id);

	if (bestQuality < Quality.High) {
		const tagElement = document.createElement("span");
		tagElement.className = "quality-tag";
		tagElement.textContent = bestQuality.name;
		tagElement.style.color = bestQuality.color;
		span.appendChild(tagElement);
	}

	for (const quality of qualityTags) {
		if (quality === Quality.High) continue;

		const tagElement = document.createElement("span");
		tagElement.className = "quality-tag";
		tagElement.textContent = quality.name;
		tagElement.style.color = quality.color;
		span.appendChild(tagElement);
	}

	trackTitle.appendChild(span);
};
