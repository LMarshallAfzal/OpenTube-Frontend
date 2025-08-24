export interface Format {
	format_id: string;
	format_note: string;
	ext: string;
	vcodec: string;
	acodec: string;
	url: string;
	width?: number;
	height?: number;
	fps?: number;
	resolution?: string;
	filesize_in_bytes?: number;
}

export interface Video {
	id: string;
	title: string;
	url: string;
	thumbnail: string;
	duration_in_seconds: number;
	formats: Format[];
}

export async function getVideo(
	id: string,
	fetchFn?: typeof globalThis.fetch
): Promise<Video> {
	const fetcher = fetchFn ?? globalThis.fetch;

	const res = await fetcher(`http://localhost:8000/api/video/${encodeURIComponent(id)}`);

	if (!res.ok) {
		throw new Error(`Could not load video ${id}: ${res.status} ${res.statusText}`);
	}

	return res.json() as Promise<Video>;
}
