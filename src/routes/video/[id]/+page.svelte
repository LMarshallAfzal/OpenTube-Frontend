<script lang="ts">
	import type { PageData } from './$types';
	import Player from '$lib/components/player.svelte';

	export let data: PageData;

	const videoSrc = data.format?.url;
	const audioSrc = data.audioFormat?.url;
	const videoHeight = data.format?.height;
	const videoWidth = data.format?.width;
	const poster = data.video?.thumbnail ?? '';
	const duration = data.video?.duration_in_seconds ?? 0;
</script>

<div class="flex h-screen w-full">
	<section class="flex w-3/4 items-start justify-start">
		<Player {videoSrc} {audioSrc} {videoHeight} {videoWidth} {poster} {duration} />
	</section>
</div>
