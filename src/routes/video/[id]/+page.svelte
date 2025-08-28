<script lang="ts">
	import type { PageData } from './$types';
	import type { Format, Video } from '$lib/types';

	import { onMount } from 'svelte';
	import thumbnailPlaceholder from '$lib/assets/thumbnail-placeholder.jpg';
	import Player from '$lib/components/player.svelte';
	import VideoDetail from '$lib/components/VideoDetail.svelte';
	import VideoListings from '$lib/components/VideoListings.svelte';

	export let data: PageData;

	const videoSrc = data.format?.url;
	const audioSrc = data.audioFormat?.url;
	const videoHeight = data.format?.height;
	const videoWidth = data.format?.width;
	const poster = data.video?.thumbnail ?? thumbnailPlaceholder;
	const duration = data.video?.duration_in_seconds ?? 0;
	const videoTitle = data.video?.title ?? 'Video Title';
	const viewCount = data.video?.view_count;

	const formats: Format[] = [];

	const videos: Video[] = Array.from({ length: 8 }, (_, i) => ({
		id: `vid-${i}`, // unique key
		title: videoTitle,
		url: 'https://youtube.com',
		thumbnail: poster,
		duration_in_seconds: 600,
		formats: formats,
		view_count: viewCount ?? 0
	}));

	let showPlayer = false;

	onMount(() => {
		showPlayer = true;
	});
</script>

<div class="mt-4 flex h-screen w-full">
	<section class="flex w-2/3 flex-col items-start justify-start">
		<div class="p-4 sm:p-6 lg:p-8">
			{#if showPlayer}
				<Player {videoSrc} {audioSrc} {videoHeight} {videoWidth} {poster} {duration} />
			{/if}
			<VideoDetail {videoTitle} {viewCount} />
		</div>
	</section>
	<aside class="mt-7.75 flex w-1/3 flex-col gap-5">
		<VideoListings {videos} />
	</aside>
</div>
