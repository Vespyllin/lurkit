<script lang="ts">
	import { Cross2 } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';

	let { url, onClick }: { url: string; onClick?: () => void } = $props();

	let zoomed = $state(false);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn(
		'fixed left-0 top-0 z-20 flex h-lvh w-lvw justify-center overflow-auto bg-background p-0.5',
		!zoomed ? 'cursor-zoom-in items-center' : 'cursor-zoom-out items-baseline'
	)}
	onclick={(e) => {
		e.preventDefault();
		e.stopPropagation();
		zoomed = !zoomed;
	}}
>
	<div
		class="fixed left-4 top-4 cursor-pointer rounded-full border-2 border-white bg-zinc-900 p-2.5 opacity-25 hover:opacity-85 hover:brightness-110"
		onclick={onClick}
	>
		<Cross2 size={25} />
	</div>

	<img
		alt=""
		class={cn('my-auto object-contain', zoomed ? 'min-h-full' : 'max-h-full lg:max-w-[85%]')}
		loading="lazy"
		src={url}
	/>
</div>
