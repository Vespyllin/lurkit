<script lang="ts">
	import { audioLocalStorage } from '$lib/store/localStorage';
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
	let seek = $state(0);

	let hasAudio = $state(true);
	let muted = $state(false);

	const volume = audioLocalStorage();

	const toZero = (x: number | undefined) => {
		if (!x || (typeof x !== 'number' && !isNaN(x))) return 0;
		else return x;
	};

	const formatPlaytime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		const hrsString = `${String(hours).padStart(2, '0')}`;
		const minString = `${String(minutes).padStart(2, '0')}`;
		const secString = `${String(secs).padStart(2, '0')}`;

		let acc = `${minString}:${secString}`;
		if (hours > 0) acc += `${hrsString}:`;

		return acc;
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
			if ($volume == 0) $volume = 10;
			audio.volume = $volume / 100;
		} else {
			audio.volume = 0;
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
		audio.volume = $volume / 100;
		if (muted || $volume == 0) toggleMute();
	};

	onMount(() => {
		const sleep = async (ms: number) => new Promise((x) => setTimeout(x, ms));
		sleep(50).then(() => {
			$volume = $volume;
			seek = 0;
		});
	});

	onDestroy(() => {
		video?.pause();
		audio.pause();
	});
</script>

<div class={cn('group relative max-h-[600px] ', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={cn(
			'pointer-events-none absolute bottom-0 z-10 flex w-full items-end gap-2 px-2 pb-[3px] transition-all duration-500 ease-out group-hover:opacity-100 [&_*]:pointer-events-auto',
			seek !== 0 && 'opacity-0 '
		)}
	>
		<button class="h-7" onclick={onPlayChange}>
			{#if !playing}
				<Play size={20} />
			{:else}
				<Pause size={20} />
			{/if}
		</button>

		{#if hasAudio}
			<div class="group/overlay flex flex-col">
				<div
					class="pointer-events-none flex h-32 py-1 align-middle opacity-0 group-hover/overlay:pointer-events-auto group-hover/overlay:opacity-100"
				>
					<input
						oninput={onVolumeSeek}
						bind:value={$volume}
						class="mx-auto h-28"
						type="range"
						style="writing-mode: vertical-lr; direction: rtl;"
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
			{formatPlaytime(toZero(((video?.duration ?? 0) * seek) / 100))}/{formatPlaytime(
				toZero(mediaData?.duration ?? video?.duration ?? 0)
			)}
		</span>

		<div class="h-6 w-full content-center">
			<input step="0.5" type="range" oninput={onSeek} bind:value={seek} class="w-full rounded-md" />
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
