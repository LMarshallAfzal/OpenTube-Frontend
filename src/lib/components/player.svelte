<script lang="ts">
	import type { VendorDoc, VendorEl } from '$lib/types';

	import { Icon } from 'svelte-icons-pack';
	import { FaSolidPlay, FaSolidPause } from 'svelte-icons-pack/fa';
	import { VscMute, VscUnmute } from 'svelte-icons-pack/vsc';
	import { RiMediaFullscreenLine, RiMediaFullscreenExitFill } from 'svelte-icons-pack/ri';

	export let videoSrc: string = '';
	export let audioSrc: string = '';
	export let poster: string = '';
	export let duration: number | undefined;
	export let videoWidth: number | undefined;
	export let videoHeight: number | undefined;

	let paused: boolean = true;
	let muted: boolean = false;
	let currentTime: number = 0;
	let isFullScreen: boolean = false;
	let progressPlayed: number = 0;

	let videoEl: HTMLVideoElement | null = null;
	let audioEl: HTMLAudioElement | null = null;
	let videoContainer: VendorEl | null = null;

	const togglePlay = (): void => {
		if (!videoEl) return;
		paused = !paused;

		if (paused) {
			videoEl.pause();
			audioEl?.pause();
		} else {
			videoEl.play();
			audioEl?.play();
		}
		// paused ? videoEl.pause() : videoEl.play();
		// paused ? audioEl.pause() : audioEl.play();
	};

	const toggleAudio = (): void => {
		muted = !muted;
		if (audioEl) audioEl.muted = muted;
	};

	const formatVideoTime = (t: number): string => {
		const hour = Math.floor(t / 3600);
		const minutes = Math.floor((t % 3600) / 60)
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor(t % 60)
			.toString()
			.padStart(2, '0');
		return `${hour > 0 ? hour.toString().padStart(2, '0') + ':' : ''}${minutes}:${seconds}`;
	};

	const toggleFullScreen = (): void => {
		const doc: VendorDoc = document as VendorDoc;

		if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
			doc.exitFullscreen?.() ?? doc.webkitFullscreenElement?.() ?? doc.msExitFullscreen?.();
			isFullScreen = false;
			return;
		}

		if (videoContainer) return;

		const el: VendorEl = videoContainer as VendorEl;
		el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.() ?? el.msRequestFullscreen?.();
		isFullScreen = true;
	};

	const syncAudioToVideo = (): void => {
		if (!audioEl || !videoEl) return;

		// if the audio is out of sync by > 0.1s, jump it
		if (Math.abs(audioEl.currentTime - videoEl.currentTime) > 0.1) {
			audioEl.currentTime = videoEl.currentTime;
		}
	};

	const handleTimeUpdate = (): void => {
		currentTime = videoEl?.currentTime ?? 0;
		syncAudioToVideo();
		progressPlayed = (duration ? currentTime / duration : 0) * 100;
	};

	const onKeyDown = (e: KeyboardEvent): void => {
		if (['f', 'F'].includes(e.key)) toggleFullScreen();
		if (e.key === 'f' || e.key === 'F') {
			e.preventDefault();
			toggleFullScreen();
		}
	};

	let progressRef: HTMLDivElement | null = null;

	const seekTo = (ratio: number): void => {
		if (!videoEl || !duration) return;
		videoEl.currentTime = ratio * duration;
	};

	const onProgressClick = (e: MouseEvent): void => {
		if (!progressRef) return;
		const rect = progressRef.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
		seekTo(ratio);
	};

	let isDragging = false;

	function onDragStart(e: MouseEvent) {
		isDragging = true;
		onProgressClick(e);
		document.addEventListener('mousemove', onDragMove);
		document.addEventListener('mouseup', onDragEnd);
	}

	function onDragMove(e: MouseEvent) {
		if (!isDragging) return;
		onProgressClick(e);
	}

	function onDragEnd() {
		isDragging = false;
		document.removeEventListener('mousemove', onDragMove);
		document.removeEventListener('mouseup', onDragEnd);
	}
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
				preload="auto"
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
					<div
						class="relative h-1 cursor-pointer overflow-hidden rounded-lg bg-gray-700"
						role="progressbar"
						bind:this={progressRef}
						on:mousedown={onDragStart}
						on:click={onProgressClick}
					>
						<div class="h-full bg-white" style="width: {progressPlayed}%"></div>
						<div
							class="left-[calc(var(--played, 0%)-10px)] absolute -top-1 h-4 w-4 rounded-full bg-white shadow-md"
							style="--played:{progressPlayed}%"
						></div>
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
							{formatVideoTime(currentTime)} / {formatVideoTime(duration ?? 0)}
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
