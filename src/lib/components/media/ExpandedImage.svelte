<script lang="ts">
	import { Cross2 } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';

	let { url, onClick }: { url: string; onClick: () => void } = $props();

	let zoomed = $state(false);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn(
		'fixed left-0 top-0 z-20 flex h-lvh w-lvw justify-center overflow-auto bg-background',
		!zoomed ? 'items-center' : 'items-baseline'
	)}
	onclick={() => {
		onClick();
	}}
>
	<div
		class="fixed left-4 top-4 z-30 cursor-pointer rounded-full border-2 border-white bg-zinc-900 p-2.5 opacity-25 hover:opacity-85 hover:brightness-110"
		onclick={(e) => {
			e.stopPropagation();
			onClick();
		}}
	>
		<Cross2 size={25} />
	</div>

	<img
		onclick={(e) => {
			e.stopPropagation();
			zoomed = !zoomed;
		}}
		alt=""
		class={cn(
			'my-auto object-contain',
			zoomed ? 'min-h-full cursor-zoom-out' : 'max-h-full cursor-zoom-in lg:max-w-[85%]'
		)}
		src={url}
	/>
</div>
