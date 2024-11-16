<script lang="ts">
	import { cn } from '$lib/utils';
	import { Pause, Play, SpeakerLoud, SpeakerOff } from 'radix-icons-svelte';
	import { onDestroy, onMount } from 'svelte';
	import * as HoverCard from '../ui/hover-card';

	let { url, class: className }: { url: string; class?: string } = $props();

	let video: HTMLVideoElement | undefined = $state();
	let playing = $state(false);
	let muted = $state(true);
	let volume = $state(50);
	let seek = $state(0);

	const audio = new Audio(`${url}/DASH_AUDIO_64.mp4`);

	const onPlayChange = async () => {
		if (!video) return console.error('Cannot play video: video not found.');

		if (playing) {
			video.pause();
			audio.pause();
		} else {
			await video.play();
			if (!muted) {
				await audio.play();
			}
		}
		playing = !playing;
	};

	const toggleAudioMute = async () => {
		if (muted) {
			audio.currentTime = audio.duration * (seek / 100);
			if (playing) {
				await audio.play();
			}
		} else audio.pause();
		muted = !muted;
	};

	const onSeek = () => {
		if (!video) return;
		video.currentTime = video.duration * (seek / 100);
		audio.currentTime = audio.duration * (seek / 100);
	};

	const onVolumeSeek = () => {
		audio.volume = volume / 100;
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

<!-- svelte-ignore a11y_media_has_caption -->
<div class={cn('relative max-h-[600px]', className)}>
	<div class="absolute bottom-0 z-10 flex h-6 w-full items-center gap-2 px-2 py-4">
		<button onclick={onPlayChange}>
			{#if !playing}
				<Play size={20} />
			{:else}
				<Pause size={20} />
			{/if}
		</button>

		<input
			type="range"
			onclick={onSeek}
			bind:value={seek}
			class="video-track h-1.5 w-full rounded-md"
		/>

		<HoverCard.Root openDelay={250} closeDelay={250}>
			<HoverCard.Trigger class="flex items-center">
				<button onclick={toggleAudioMute}>
					{#if !muted}
						<SpeakerLoud size={20} />
					{:else}
						<SpeakerOff size={20} />
					{/if}
				</button>
			</HoverCard.Trigger>
			<HoverCard.Content
				class="h-fit w-fit border-none bg-transparent p-1"
				side="top"
				sideOffset={20}
			>
				<input
					oninput={onVolumeSeek}
					bind:value={volume}
					class="vertical-slider h-[100px]"
					type="range"
				/>
			</HoverCard.Content>
		</HoverCard.Root>
	</div>
	<video
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
