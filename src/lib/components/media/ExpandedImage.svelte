<script lang="ts">
	import { Cross2 } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';

	let { url, onClick }: { url: string; onClick?: () => void } = $props();

	let zoomed = $state(false);
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class={cn(
		'fixed left-0 top-0 z-20 flex h-lvh w-lvw  justify-center overflow-auto bg-background',
		!zoomed ? 'cursor-zoom-in items-center' : 'cursor-zoom-out items-baseline'
	)}
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		zoomed = !zoomed;
	}}
>
	<div
		class="fixed left-3 top-3 cursor-pointer rounded-full border-2 border-white bg-zinc-900 p-2.5 opacity-25 hover:opacity-85 hover:brightness-110"
		onclick={onClick}
	>
		<Cross2 size={25} />
	</div>
	<img
		class={cn('min-h-full max-w-full object-contain', !zoomed ? 'max-h-full' : 'max-h-none')}
		loading="lazy"
		src={url}
	/>
</div>
