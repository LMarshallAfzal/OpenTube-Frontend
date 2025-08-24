<script lang="ts">
	import type { VendorDoc, VendorEl } from '$lib/types';

	import { Icon } from 'svelte-icons-pack';
	import { FaSolidPlay, FaSolidPause } from 'svelte-icons-pack/fa';
	import { VscMute, VscUnmute } from 'svelte-icons-pack/vsc';
	import { RiMediaFullscreenLine, RiMediaFullscreenExitFill } from 'svelte-icons-pack/ri';

	export let videoSrc: string = '';
	export let audioSrc: string = '';
	export let poster: string = '';
	export let duration: number = 0;
	export let videoWidth: number | undefined;
	export let videoHeight: number | undefined;

	let paused: boolean = true;
	let muted: boolean = false;
	let currentTime: number = 0;
	let videoContainer: VendorEl | null = null;
	let isFullScreen: boolean = false;
	let progressPlayed: number = 0;

	let videoEl: HTMLVideoElement | null = null;
	let audioEl: HTMLAudioElement | null = null;

	const togglePlay = (): void => {
		paused = !paused;
		console.log('Paused button pressed');
		if (videoEl && audioEl) {
			paused ? videoEl.pause() : videoEl.play();
			paused ? audioEl.pause() : audioEl.play();
		}
	};

	const toggleAudio = (): void => {
		muted = !muted;
	};

	const formatVideoTime = (timeInSeconds: number): string => {
		const hour = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds % 3600) / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(timeInSeconds % 60)
			.toString()
			.padStart(2, '0');

		return `${hour > 0 ? hour.toString().padStart(2, '0') + ':' : ''}${minutes}:${seconds}`;
	};

	const toggleFullScreen = (): void => {
		const doc: VendorDoc = document as VendorDoc;

		if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
			// Exit fullscreen mode

			if (doc.exitFullscreen) {
				doc.exitFullscreen();
			} else if (doc.webkitExitFullscreen) {
				doc.webkitExitFullscreen();
			} else if (doc.msExitFullscreen) {
				doc.msExitFullscreen();
			}

			isFullScreen = false;
		} else {
			// Enter fullscreen mode
			if (!videoContainer) return;

			const el: VendorEl = videoContainer;
			if (el.requestFullscreen) {
				el.requestFullscreen();
			} else if (el.webkitRequestFullscreen) {
				el.webkitRequestFullscreen();
			} else if (el.msRequestFullscreen) {
				el.msRequestFullscreen();
			}

			isFullScreen = true;
		}
	};

	const handleTimeUpdate = (): void => {
		const diff = currentTime - (audioEl?.currentTime ?? 0);
		if (Math.abs(diff) > 0.1) {
			audioEl!.currentTime = currentTime;
		}

		progressPlayed = (currentTime / duration) * 100;
	};

	const onKeyDown = (event: KeyboardEvent): void => {
		if (event.key === 'f' || event.key === 'F') {
			toggleFullScreen();
		}

		if (event.key === ' ') {
			togglePlay();
		}
	};
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="flex flex-col">
	<div class="w-full">
		<!-- Video wrapper -->
		<div
			class="relative w-full overflow-hidden bg-black"
			bind:this={videoContainer}
			style="aspect-ratio: {videoWidth && videoHeight ? `${videoWidth}/${videoHeight}` : '16/9'};"
		>
			<video
				class="h-full w-full rounded-lg object-cover"
				bind:this={videoEl}
				bind:paused
				bind:muted
				bind:currentTime
				bind:duration
				on:timeupdate={handleTimeUpdate}
				{poster}
			>
				<track kind="captions" />
				<source src={videoSrc} type="video/mp4" />
			</video>

			<!-- Audio element (hidden) -->
			<audio bind:this={audioEl} class="hidden" on:timeupdate={handleTimeUpdate}>
				<source src={audioSrc} type="audio/mpeg" />
			</audio>

			<!-- Controls overlay -->
			<div class="absolute inset-x-0 bottom-0 bg-black/60">
				<!-- Progress bar -->
				<div class="px-2 py-1">
					<div class="relative h-1 cursor-pointer overflow-hidden rounded-lg bg-gray-700">
						<div class="h-full bg-white" style="width: {progressPlayed}%"></div>
					</div>
				</div>

				<!-- Control bar -->
				<div class="flex h-12 items-center justify-between px-4 py-1 text-sm">
					<div class="flex items-center space-x-3">
						<button
							on:click={togglePlay}
							class="rounded-full p-1 ring-white hover:bg-gray-600 focus:ring-2 focus:outline-none"
						>
							<Icon src={paused ? FaSolidPlay : FaSolidPause} size="22px" color="white" />
						</button>

						<button
							on:click={toggleAudio}
							class="focus: foucs:ring-2 rounded-full p-1 ring-white outline-none hover:bg-gray-600"
						>
							<Icon src={muted ? VscMute : VscUnmute} size="22px" color="white" />
						</button>

						<p class="test-xs whitespace-nowrap text-white">
							{formatVideoTime(currentTime)} / {formatVideoTime(duration)}
						</p>
					</div>

					<div>
						<button
							on:click={toggleFullScreen}
							class="rounded-full p-1 ring-white hover:bg-gray-600 focus:ring-2 focus:outline-none"
						>
							<Icon
								src={isFullScreen ? RiMediaFullscreenExitFill : RiMediaFullscreenLine}
								size="22px"
								color="white"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
