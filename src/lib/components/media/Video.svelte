<script lang="ts">
	import {
		EnterFullScreen,
		ExitFullScreen,
		Pause,
		Play,
		SpeakerLoud,
		SpeakerOff
	} from 'radix-icons-svelte';
	import { cn } from '$lib/utils';
	import Spinner from '../layout/Spinner.svelte';
	import { setSiteScrollable } from '$lib';

	let {
		url,
		mediaData,
		class: className
	}: { url: string; mediaData?: any | undefined; class?: string } = $props();

	let video: HTMLVideoElement | undefined = $state();
	let audio: HTMLAudioElement | undefined = $state();
	let container: HTMLDivElement | undefined = $state();

	let hasVideo = $state(false);
	let hasAudio = $state(false);

	let muted = $state(true);
	let fullscreen = $state(false);

	let loading = $state(false);
	let playing = $state(false);
	let seek = $state(0);
	let volume = $state(25);

	let showControls = $state(true);
	let hideControlsTimer: number | undefined = undefined;
	let isHoveringControls = $state(false);

	const fadeTimeoutMs = 1000;

	const toZero = (x: number | undefined) => (!x || typeof x !== 'number' || isNaN(x) ? 0 : x);

	const formatPlaytime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = Math.round(seconds % 60);

		const hrsString = `${String(hours).padStart(2, '0')}`;
		const minString = `${String(minutes).padStart(2, '0')}`;
		const secString = `${String(secs).padStart(2, '0')}`;

		let acc = `${minString}:${secString}`;
		if (hours > 0) acc += `${hrsString}:`;

		return acc;
	};

	const syncAudio = () => {
		if (!audio || !hasAudio || !video) return;
		audio.currentTime = video.currentTime;
	};

	const setPlaying = async (toPlaying: boolean) => {
		if (!audio || !video) return;

		if (toPlaying) {
			if (video.currentTime == video.duration) {
				video.currentTime = 0;
				seek = 0;
			}

			await video.play();
			if (hasAudio) await audio.play();
		} else {
			video.pause();
			if (hasAudio) audio.pause();
			syncAudio();
		}
	};

	const setMuted = (toMuted: boolean) => {
		if (!audio || !video) return;

		muted = toMuted;
		if (toMuted) {
			video.volume = 0;
			audio.volume = 0;
		} else {
			if (volume == 0) volume = 10;
			else {
				audio.volume = volume / 100;
				video.volume = volume / 100;
			}
		}
	};

	const toggleMute = () => {
		muted = !muted;
		setMuted(muted);
	};

	const setVolume = (toValue: number) => {
		if (!audio || !hasAudio) return;
		volume = toValue;
		audio.volume = volume / 100;
		if (volume == 0) setMuted(true);
		else setMuted(false);
	};

	let loadingIntervalId: number | undefined = undefined;

	const onWaiting = () => {
		if (!audio || !video) return;

		if (loadingIntervalId) return;

		loadingIntervalId = setInterval(async () => {
			if (!audio || !video) return;
			let withinBuffer = false;
			for (let i = 0; i < video.buffered.length; i++) {
				const start = video.buffered.start(i);
				const end = video.buffered.end(i);
				const currentTime = video.currentTime;
				if (start <= currentTime && currentTime <= end) withinBuffer = true;
			}

			if (withinBuffer) {
				loading = false;
				clearInterval(loadingIntervalId);
			} else {
				loading = true;
				setPlaying(false);
			}
		}, 500);
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
		if (hasAudio) audio.currentTime = audio.duration * (seek / 100);
	};

	const onTimeUpdate = () => {
		if (!video) return;

		if (audio && video.currentTime < audio.currentTime - 0.25)
			audio.currentTime = video.currentTime;

		seek = (video.currentTime / video.duration) * 100;

		if (video.currentTime == video.duration) {
			playing = false;
		}
	};

	$effect(() => {
		if (!audio || !video) return;
		if (muted) {
			audio.volume = 0;
			video.volume = 0;
		} else {
			audio.volume = volume / 100;
			video.volume = volume / 100;
		}
	});

	const handleFullscreen = () => {
		if (!container) return;
		fullscreen = !fullscreen;

		if (fullscreen) {
			container.requestFullscreen();
		} else {
			document.exitFullscreen();
		}

		setSiteScrollable(!fullscreen);
	};

	const onMouseEnter = () => {
		if (hideControlsTimer) {
			clearTimeout(hideControlsTimer);
			hideControlsTimer = undefined;
		}
		showControls = true;
		startHideControlsTimer();
	};

	const onMouseMove = () => {
		showControls = true;
		startHideControlsTimer();
	};

	const onMouseLeave = () => {
		if (hideControlsTimer) {
			clearTimeout(hideControlsTimer);
		}

		startHideControlsTimer();
	};

	const startHideControlsTimer = () => {
		if (isHoveringControls) return;

		if (hideControlsTimer) {
			clearTimeout(hideControlsTimer);
		}

		hideControlsTimer = setTimeout(() => {
			showControls = false;
		}, fadeTimeoutMs);
	};
</script>

<svelte:document
	onfullscreenchange={() => {
		if (!document.fullscreenElement && fullscreen) handleFullscreen();
	}}
/>

<div
	bind:this={container}
	onmouseenter={onMouseEnter}
	onmousemove={onMouseMove}
	onmouseleave={onMouseLeave}
	class={cn(
		!showControls && playing && 'cursor-none',
		fullscreen ? 'fixed left-0 top-0 z-50 h-lvh w-[100lvw] bg-black' : 'relative',
		!fullscreen && className
	)}
>
	{#if !hasVideo || loading}
		<div class="pointer-events-none absolute bottom-0 z-10 flex h-full w-full items-center">
			<Spinner class="mx-auto size-20" />
		</div>
	{/if}

	{#if hasVideo}
		<div
			onclick={(e) => e.preventDefault()}
			onmouseenter={() => {
				isHoveringControls = true;
				if (hideControlsTimer) {
					clearTimeout(hideControlsTimer);
					hideControlsTimer = undefined;
				}
			}}
			onmouseleave={() => {
				isHoveringControls = false;
				startHideControlsTimer();
			}}
			class={cn(
				'absolute bottom-0 w-full select-none px-2 transition-opacity duration-500 [&_*]:pointer-events-auto',
				fullscreen ? 'pb-2 text-lg' : 'pb-1',
				!showControls && seek != 0 && seek != 100
					? 'pointer-events-none opacity-0 ease-in'
					: 'ease-out'
			)}
		>
			<div
				class="z-10 mx-auto flex h-10 w-full max-w-[75rem] items-end gap-2.5 rounded-full bg-black/75 px-2.5 py-1"
			>
				<button class="h-8 opacity-80 hover:opacity-100" onclick={onPlayChange}>
					{#if !playing}
						<Play size={22} />
					{:else}
						<Pause size={22} />
					{/if}
				</button>

				{#if hasAudio}
					<div class="group/overlay flex flex-col opacity-80 hover:opacity-100">
						<div
							class="pointer-events-none flex h-32 py-1 align-middle opacity-0 group-hover/overlay:pointer-events-auto group-hover/overlay:opacity-100"
						>
							<input
								oninput={(e) => setVolume(+(e.currentTarget.value ?? 0))}
								bind:value={volume}
								class="slider"
								type="range"
								style="writing-mode: vertical-lr; direction: rtl; height: 7rem; width: 0.5rem; margin-left: 0.5rem;"
							/>
						</div>
						<button class="h-8" onclick={toggleMute}>
							{#if !muted}
								<SpeakerLoud size={22} />
							{:else}
								<SpeakerOff size={22} />
							{/if}
						</button>
					</div>
				{/if}

				{#key seek}
					<div class="flex h-8 w-fit items-center font-mono text-sm opacity-90">
						<span>
							{formatPlaytime(toZero(video?.currentTime ?? 0))}/{formatPlaytime(
								toZero(video?.duration ?? mediaData?.duration ?? 0)
							)}
						</span>
					</div>
				{/key}

				<div class="h-[2.2rem] w-full content-center opacity-80 hover:opacity-100">
					<input
						step="0.5"
						min="0"
						max="100"
						type="range"
						oninput={onSeek}
						bind:value={seek}
						class="slider"
					/>
				</div>

				<button class="h-8 opacity-80 hover:opacity-100" onclick={handleFullscreen}>
					{#if !fullscreen}
						<EnterFullScreen size={25} />
					{:else}
						<ExitFullScreen size={25} />
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<audio
		bind:this={audio}
		onwaiting={() => {
			onWaiting();
		}}
		onloadeddata={() => (hasAudio = true)}
		class="hidden"
	>
		{#each [128, 64, 32] as res}
			<source src={`${url}/CMAF_AUDIO_${res}.mp4`} type="audio/mp4" />
			<source src={`${url}/DASH_AUDIO_${res}.mp4`} type="audio/mp4" />
		{/each}
	</audio>

	<video
		onloadeddata={(e) => {
			seek = 0;
			hasVideo = true;
		}}
		onwaiting={onWaiting}
		onclick={onPlayChange}
		ontimeupdate={onTimeUpdate}
		bind:this={video}
		class={cn(
			fullscreen ? 'inset-0 h-lvh w-lvw' : 'max-h-[600px] w-full rounded-md bg-black object-contain'
		)}
	>
		{#each [1080, 720, 480, 270] as res}
			<source src={`${url}/CMAF_${res}.mp4`} type="video/mp4" />
			<source src={`${url}/DASH_${res}.mp4`} type="video/mp4" />
		{/each}
	</video>
</div>

<style>
	.slider {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		border-radius: 1rem;
		width: 100%;
		height: 0.5rem;
		background: #c0c0c0f0;
		outline: none;
		opacity: 0.8;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
	}

	.slider:hover {
		opacity: 1;
	}

	.slider::-webkit-slider-thumb {
		border-radius: 100%;
		-webkit-appearance: none;
		appearance: none;
		width: 1rem;
		height: 1rem;
		background: #ff0033;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		border-radius: 100%;
		border: none;
		width: 1rem;
		height: 1rem;
		background: #ff0033;
		cursor: pointer;
	}

	.slider::-moz-range-track {
		background: transparent;
		border: none;
	}
</style>
