<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Pause, Play, SpeakerLoud, SpeakerOff, Underline, Video } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';
	import { volumeLocalStorage } from '$lib/store/globalStores';
	import Spinner from '../layout/Spinner.svelte';

	let {
		url,
		mediaData,
		class: className
	}: { url: string; mediaData?: any | undefined; class?: string } = $props();

	let video: HTMLVideoElement | undefined = $state();
	let audio: HTMLAudioElement | undefined = $state();

	let hasVideo = $state(false);
	let hasAudio = $state(false);

	let audioLoading = $state(false);
	let videoLoading = $state(false);

	let playing = $state(false);
	let seek = $state(0);
	let muted = $state(false);

	const toZero = (x: number | undefined) => (!x || typeof x !== 'number' || isNaN(x) ? 0 : x);

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

	const syncAudio = () => {
		if (!audio) return;
		console.log('Before Sync', audio.currentTime);
		audio.currentTime = audio.duration * (seek / 100);
		console.log('After Sync', audio.currentTime);
	};

	const setPlaying = async (toPlaying: boolean) => {
		if (!audio || !video) return;

		if (toPlaying) {
			await video.play();
			if (hasAudio && !muted) await audio.play();
		} else {
			video.pause();
			if (hasAudio) audio.pause();
			syncAudio();
		}
	};

	const toggleMute = () => {
		if (!audio) return;

		if (muted) {
			if ($volumeLocalStorage == 0) $volumeLocalStorage = 10;
			else audio.volume = $volumeLocalStorage / 100;
		} else {
			audio.volume = 0;
		}
		muted = !muted;
	};

	let loadingIntervalId: number | undefined = undefined;
	let lastRightBound = 0;
	const bufferPadding = 3;
	const initLoadingLoop = () => {
		if (!audio || !video) return;
		if (toZero(seek * 100) < 1 || toZero(seek) > 99) return;
		if (loadingIntervalId) return;

		setPlaying(false);

		loadingIntervalId = setInterval(async () => {
			if (!audio || !video) return;

			for (let i = 0; i < video.buffered.length; i++) {
				const start = video.buffered.start(i);
				const end = video.buffered.end(i);
				const currentTime = video.currentTime;

				if (start < currentTime && (currentTime < end || end == video.duration)) {
					const timeDataString = `${start}-${end} : ${currentTime}/${video.duration}`;

					if (lastRightBound == end || currentTime < end - bufferPadding) {
						console.log('✔️', timeDataString);

						videoLoading = false;
						clearInterval(loadingIntervalId);
						loadingIntervalId = undefined;

						setPlaying(playing);
					} else {
						console.log('✖️', timeDataString);
						videoLoading = true;
					}
					lastRightBound = end;
				}
			}
		}, 500);
	};

	const onWaiting = () => {
		if (!audio || !video) return;

		initLoadingLoop();
	};

	const onPlayChange = () => {
		if (!hasVideo) return;
		playing = !playing;
		return setPlaying(playing);
	};

	const onSeek = () => {
		if (!audio || !video) return;
		if (isNaN(video.currentTime)) return;

		video.currentTime = video.duration * (seek / 100);
		audio.currentTime = audio.duration * (seek / 100);
	};

	const onTimeUpdate = () => {
		if (!video) return;
		seek = (video.currentTime / video.duration) * 100;
	};

	$effect(() => {
		if (!audio || !video) return;

		audio.volume = $volumeLocalStorage / 100;
		muted = $volumeLocalStorage == 0;
	});

	onDestroy(() => {
		if (!audio || !video) return;

		video.pause();
		audio.pause();
	});
</script>

<div class={cn('group relative', className)}>
	{#if !hasVideo || videoLoading}
		<div class="pointer-events-none absolute bottom-0 z-10 flex h-full w-full items-center">
			<Spinner class="mx-auto size-20" />
		</div>
	{/if}

	{#if hasVideo}
		<div
			class={cn(
				'pointer-events-none absolute bottom-0 z-10 flex w-full items-end gap-2 px-2 pb-[3px] opacity-100 transition-all duration-500 ease-out group-hover:opacity-100 [&_*]:pointer-events-auto',
				(playing || !videoLoading) && 'opacity-0'
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
							bind:value={$volumeLocalStorage}
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

			{#key seek}
				<div class="flex gap-2 text-sm">
					<span class="flex h-7 items-center gap-1">
						<Video />

						{formatPlaytime(toZero(video?.currentTime ?? 0))}/{formatPlaytime(
							toZero(mediaData?.duration ?? video?.duration ?? 0)
						)}
					</span>

					{#if hasAudio}
						<span class="flex h-7 items-center gap-1">
							<SpeakerLoud />
							{formatPlaytime(toZero(audio?.currentTime ?? 0))}/{formatPlaytime(
								toZero(audio?.duration ?? 0)
							)}
						</span>
					{/if}
				</div>
			{/key}

			<div class="h-6 w-full content-center">
				<input
					step="0.5"
					min="0"
					max="100"
					type="range"
					oninput={onSeek}
					bind:value={seek}
					class="w-full rounded-md"
				/>
			</div>
		</div>
	{/if}

	<audio
		bind:this={audio}
		onwaiting={() => {
			console.log('Awaiting audio');
			onWaiting();
		}}
		onloadeddata={() => (hasAudio = true)}
		class="hidden"
	>
		<source src={`${url}/DASH_AUDIO_128.mp4`} type="audio/mp4" />
		<source src={`${url}/DASH_AUDIO_64.mp4`} type="audio/mp4" />
		<source src={`${url}/DASH_AUDIO_32.mp4`} type="audio/mp4" />
		<source src={`${url}/DASH_AUDIO_16.mp4`} type="audio/mp4" />
	</audio>

	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		onloadeddata={() => {
			seek = 0;
			hasVideo = true;
		}}
		onwaiting={() => {
			console.log('Awaiting video');
			onWaiting();
		}}
		onended={() => (playing = false)}
		onclick={onPlayChange}
		ontimeupdate={onTimeUpdate}
		bind:this={video}
		class="max-h-[600px] w-full bg-black object-contain"
	>
		<source src={`${url}/DASH_1080.mp4`} type="video/mp4" />
		<source src={`${url}/DASH_720.mp4`} type="video/mp4" />
		<source src={`${url}/DASH_480.mp4`} type="video/mp4" />
		<source src={`${url}/DASH_270.mp4`} type="video/mp4" />
	</video>
</div>
