<script lang="ts">
	import { cn } from '$lib/utils';

	let { url }: { url: string } = $props();
	let expanded = $state(false);
	const handleExpand = () => {
		expanded = !expanded;
		const body = document.querySelector('body');
		if (!body) return;

		if (expanded) {
			console.log('hiding');
			body.style.overflow = 'hidden';
		} else {
			console.log('showing');
			body.style.overflow = 'auto';
		}
	};
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.code == 'Escape' && expanded) handleExpand();
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
		onclick={handleExpand}
	/>
</div>
