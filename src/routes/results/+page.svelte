<script lang="ts">
	import VideoResult from '$lib/components/VideoResult.svelte';

	const fakeResults = Array.from({ length: 8 }, (_, i) => ({
		id: `${i}`,
		poster: `https://picsum.photos/seed/${i + 1}/300/200`,
		title: `Sample video ${i + 1}`,
		uploadedAt: new Date(Date.now() - i * 86400000).toISOString(),
		channelName: 'Channel Name',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
	}));
</script>

<div class="container mx-auto w-3/4 px-4 py-8">
	{#each fakeResults as result (result.id)}
		<div class="mb-6 flex justify-center">
			<VideoResult
				poster={result.poster}
				title={result.title}
				uploadedAt={result.uploadedAt}
				description={result.description}
			/>
		</div>
	{/each}
</div>
