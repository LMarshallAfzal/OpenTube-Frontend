import type { PageLoad } from './$types';
import type { Video, Format } from '$lib/types';
import { getVideo } from '$lib/api/video';

function pickBestFormat(formats: Format[]): Format | undefined {
	const candidates = formats.filter(
		f => f.ext === 'mp4' && f.acodec === 'none'
	);

	if (!candidates.length) return undefined;

	candidates.sort((a, b) => {
		const aRes = (a.width ?? 0) * (a.height ?? 1);
		const bRes = (b.width ?? 0) * (b.height ?? 1);
		return bRes - aRes;
	});

	return candidates[0];
}

export const load: PageLoad = async ({ params }) => {
	try {
		const video: Video = await getVideo(params.id);

		const audioFormat = video.formats.find(f => f.vcodec === 'none' && f.ext.startsWith('m') && f.format_note.toLowerCase().includes('english'));

		return {
			video,
			format: pickBestFormat(video.formats),
			audioFormat
		};
	} catch (error) {
		return { error: error instanceof Error ? error.message : 'Unknown error' };
	}
};
