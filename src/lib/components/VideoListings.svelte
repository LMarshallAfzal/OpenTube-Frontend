<script lang="ts">
	import type { Video } from '$lib/types';

	export let videos: Video[] = [];

	const formatViewCount = (viewCount: number): string => {
		const formatter = Intl.NumberFormat('en-US');
		return formatter.format(viewCount);
	};
</script>

<div class="flex w-full flex-col gap-4 px-6">
	{#each videos as video (video.id)}
		<div class="flex items-start sm:flex-row sm:gap-4" style="aspect-ratio: 16/9;">
			<img src={video.thumbnail} alt="Thumbnail" class="rounded-md object-cover" />
		</div>
		<div class="mb-3 flex flex-col gap-1">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{video.title}</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">Glitch</p>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{formatViewCount(video.view_count)} views
			</p>
		</div>
	{/each}
</div>
