import type { Video } from '$lib/types';

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
