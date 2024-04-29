<script lang="ts">
	import { cn } from '$lib/utils';

	let { url }: { url: string } = $props();
	let expanded = $state(false);
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.code == 'Escape') expanded = false;
	}}
/>

<div class="flex items-center justify-center">
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<img
		src={url}
		class={cn(
			'cursor-pointer object-contain',
			!expanded ? 'max-h-[600px]' : 'fixed left-0 top-0 z-50 h-screen w-screen bg-background '
		)}
		onclick={() => (expanded = !expanded)}
	/>
</div>
