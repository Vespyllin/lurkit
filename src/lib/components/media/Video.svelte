<script lang="ts">
	import { cn } from '$lib/utils';
	import { Pause, Play, SpeakerLoud, SpeakerOff } from 'radix-icons-svelte';
	import { onDestroy, onMount } from 'svelte';
	// import * as HoverCard from '../ui/hover-card';

	let {
		url,
		mediaData,
		class: className
	}: { url: string; mediaData?: any | undefined; class?: string } = $props();

	let video: HTMLVideoElement | undefined = $state();
	let playing = $state(false);
	let hasAudio = $state(true);
	let muted = $state(false);
	let volume = $state(50);
	let seek = $state(0);

	const NaNtoZero = (x: number | undefined) => {
		if (!x) return 0;
		if (isNaN(x)) return 0;
		else return x;
	};

	const formatPlaytime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);
		return hours > 0
			? `${String(hours).padStart(1, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
			: `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	};

	const audio = new Audio(`${url}/DASH_AUDIO_64.mp4`);

	const onPlayChange = async () => {
		if (!video) return console.error('Cannot play video: video not found.');

		if (playing) {
			video.pause();
			audio.pause();
		} else {
			await video.play();
			if (!muted) await audio.play();
		}
		playing = !playing;
	};

	const toggleMute = async () => {
		if (muted) {
			audio.volume = volume / 100;
			if (playing) await audio.play();
		} else {
			audio.volume = 0;
			audio.pause();
		}
		muted = !muted;
	};

	const onSeek = () => {
		if (!video) return;
		if (isNaN(video.currentTime)) return;
		video.currentTime = video.duration * (seek / 100);
		audio.currentTime = audio.duration * (seek / 100);
	};

	const handleNetworkStop = () => {
		if (audio.currentTime < audio.duration * (seek / 100))
			audio.currentTime = audio.duration * (seek / 100);
	};

	const handleNetworkStart = () => {
		if ((video?.readyState ?? 0) > 2 && audio.currentTime < audio.duration * (seek / 100))
			audio.currentTime = audio.duration * (seek / 100);
	};

	audio.onwaiting = handleNetworkStop;
	audio.oncanplay = handleNetworkStart;
	audio.onerror = () => (hasAudio = false);

	const onVolumeSeek = () => {
		audio.volume = volume / 100;
		if (muted) toggleMute();
	};

	onMount(() => {
		const sleep = async (ms: number) => new Promise((x) => setTimeout(x, ms));
		sleep(50).then(() => {
			volume = volume;
			seek = 0;
		});
	});

	onDestroy(() => {
		video?.pause();
		audio.pause();
	});
</script>

<div class={cn('relative max-h-[600px]', className)}>
	<div class="absolute bottom-0 z-10 flex w-full items-end gap-2 px-2 pb-1">
		<button class="h-7" onclick={onPlayChange}>
			{#if !playing}
				<Play size={20} />
			{:else}
				<Pause size={20} />
			{/if}
		</button>

		{#if hasAudio}
			<div class="group flex flex-col">
				<div class="group-hover hidden h-32 py-1 align-middle group-hover:flex">
					<input
						oninput={onVolumeSeek}
						bind:value={volume}
						class="vertical-slider mx-auto h-28"
						type="range"
					/>
				</div>
				<button class="h-7" onclick={toggleMute}>
					{#if !muted}
						<SpeakerLoud size={20} />
					{:else}
						<SpeakerOff size={20} />
					{/if}
				</button>
			</div>
		{/if}

		<span class="flex h-7 items-center">
			{formatPlaytime((NaNtoZero(video?.duration) * seek) / 100)}/{formatPlaytime(
				NaNtoZero(mediaData?.duration ?? video?.duration ?? 0)
			)}
		</span>

		<div class="h-6 w-full content-center">
			<input
				type="range"
				oninput={onSeek}
				bind:value={seek}
				class="video-track w-full rounded-md"
			/>
		</div>
	</div>

	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		onended={() => (playing = false)}
		onwaiting={handleNetworkStop}
		oncanplay={handleNetworkStart}
		onclick={onPlayChange}
		ontimeupdate={() => {
			if (!video) return;
			seek = (video.currentTime / video.duration) * 100;
		}}
		bind:this={video}
		class="max-h-[600px] w-full bg-black object-contain"
	>
		<source src={`${url}/DASH_1080.mp4`} type="video/mp4" />
		<source src={`${url}/DASH_720.mp4`} type="video/mp4" />
		<source src={`${url}/DASH_480.mp4`} type="video/mp4" />
		<source src={`${url}/DASH_270.mp4`} type="video/mp4" />
	</video>
</div>

<style>
	.vertical-slider {
		writing-mode: vertical-lr;
		direction: rtl;
		vertical-align: middle;
	}
</style>
