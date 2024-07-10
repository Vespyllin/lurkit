<script lang="ts">
	import { Cross2 } from 'radix-icons-svelte';
	import { cn } from '$lib/utils';

	let { url, onClick }: { url: string; onClick?: () => void } = $props();

	let zoomed = $state(false);
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="fixed left-0 top-0 z-20 m-0 flex h-[100lvh] w-[100lvw] items-center overflow-auto bg-background"
	onclick={onClick}
>
	<div
		class="fixed left-3 top-3 cursor-pointer rounded-full bg-zinc-900 p-2.5 opacity-25 hover:opacity-85 hover:brightness-110"
	>
		<Cross2 size={25} />
	</div>
	<img
		class={cn(
			'm-auto object-contain',
			!zoomed
				? 'max-h-full max-w-[65%] cursor-zoom-in '
				: 'h-fit min-h-[75%] w-fit min-w-[75%] cursor-zoom-out object-contain'
		)}
		src={url}
		onclick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			zoomed = !zoomed;
		}}
	/>
</div>
