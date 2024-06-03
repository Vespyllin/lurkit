<script lang="ts">
	let { url } = $props();

	let video: HTMLVideoElement | undefined = $state();

	$effect(() => {
		if (!video) return;

		const audio = new Audio();
		audio.src = `${url}/DASH_AUDIO_64.mp4`;

		video.addEventListener('pause', () => {
			audio.pause();
		});

		video.addEventListener('play', async () => {
			audio.currentTime = video?.currentTime ?? 0;
			audio.volume = 0.1;
			await audio.play();
		});

		video.onmousedown = async () => {
			if (!video) return;
			video.paused ? await video.play() : video.pause();
		};
	});
</script>

<video bind:this={video} class="max-h-[600px] w-full rounded-2xl bg-black object-contain" controls>
	<source src={`${url}/DASH_1080.mp4`} type="video/mp4" />
	<source src={`${url}/DASH_720.mp4`} type="video/mp4" />
	<source src={`${url}/DASH_480.mp4`} type="video/mp4" />
	<source src={`${url}/DASH_270.mp4`} type="video/mp4" />

	<track kind="captions" />
</video>
