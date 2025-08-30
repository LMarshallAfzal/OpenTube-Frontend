import type { PageLoad } from './$types';
import type { Video, Format } from '$lib/types';
import { getVideo } from '$lib/api/video';


const PREFERRED_VIDEO_ITAGS = [
	'264',	// 1440p MP4 AVC
	'137',	// 1080p MP4 AVC
	'136',	// 720p MP4 AVC
	'135',	// 480p MP4 AVC
	'400',	// 1440p MP4 AV1
	'399',	// 1080p MP4 AV1
	'398',	// 720p MP4 AV1
	'397',	// 480p MP4 AV1
	'271',	// 1440p webm VP9
	'248',	// 1080p webm VP9
	'247',	// 720p webm VP9
	'246',	// 480p webm VP9
] as const;

const PREFERRED_AUDIO_ITAGS = [
	'139',	// m4a 48kbps
	'140',	// m4a 128kbps
	'141',	// m4a 256kbps
	'249',	// webm 50kbps
	'250',	// webm 70kbps
	'251',	// webm 160kbps

] as const;

function getBaseItag(formatId: string): string {
	const dash = formatId.indexOf('-');
	return dash === -1 ? formatId : formatId.slice(0, dash);
};

function pickByFormatId<T extends Format>(
	formats: T[],
	priorityList: readonly string[]
): T | undefined {
	for (const itag of priorityList) {
		const match = formats.find(f => getBaseItag(f.format_id) === itag);
		if (match) return match;
	}
};

function bestVideoFormat(formats: Format[]): Format | undefined {
	const candidate = pickByFormatId(formats, PREFERRED_VIDEO_ITAGS);
	if (candidate && candidate.acodec === 'none') return candidate;

	const fallback = formats.filter(f => f.ext === 'mp4' && f.vcodec?.startsWith('av') && !f.acodec);
	if (!fallback.length) return undefined;
	fallback.sort((a, b) => (b.width ?? 0) * (b.height ?? 1) - (a.width ?? 0) * (a.height ?? 1));
	return fallback[0];
};

function bestAudioFormat(formats: Format[]): Format | undefined {
	const english = formats.filter(f =>
		f.format_note?.toLowerCase().includes('english') ||
		f.format_note?.toLowerCase().includes('eng')
	);

	if (english.length) {
		const audio = pickByFormatId(english, PREFERRED_AUDIO_ITAGS);
		return audio;
	}

	return pickByFormatId(formats, PREFERRED_AUDIO_ITAGS);
};


export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const video: Video = await getVideo(params.id, fetch);

		return {
			video,
			videoFormat: bestVideoFormat(video.formats),
			audioFormat: bestAudioFormat(video.formats),
		};
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'Unknown error' };
	}
};
