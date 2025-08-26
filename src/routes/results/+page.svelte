<script lang="ts">
	import type { PageData } from './$types';
	import VideoResult from '$lib/components/VideoResult.svelte';

	export let data: PageData;

	const videos = data.result ?? [];
	console.log(videos);
</script>

<div class="container mx-auto w-3/4 px-4 py-8">
	{#each videos as video (video.id)}
		<div class="mb-6 flex justify-center">
			<VideoResult
				poster={video.thumbnail}
				title={video.title}
				uploadedAt={new Date(Date.now()).toISOString()}
				viewCount={video.view_count}
				description="Lorem ipsum"
			/>
		</div>
	{/each}
</div>
