<script lang="ts">
	import { cn } from '$lib/utils';

	let { url, class: className }: { url: string; class?: string } = $props();

	let video: HTMLVideoElement | undefined = $state();

	const audio = new Audio(`${url}/DASH_AUDIO_64.mp4`);
</script>

<video
	onpause={() => {
		audio.pause();
	}}
	onplay={async () => {
		audio.currentTime = video?.currentTime ?? 0;
		audio.volume = 0.1;
		await audio.play();
	}}
	bind:this={video}
	class={cn('max-h-[600px] w-full rounded-2xl bg-black object-contain', className)}
	controls
>
	<source src={`${url}/DASH_1080.mp4`} type="video/mp4" />
	<source src={`${url}/DASH_720.mp4`} type="video/mp4" />
	<source src={`${url}/DASH_480.mp4`} type="video/mp4" />
	<source src={`${url}/DASH_270.mp4`} type="video/mp4" />

	<track kind="captions" />
</video>
