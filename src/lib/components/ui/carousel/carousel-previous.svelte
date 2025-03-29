<script lang="ts">
	import type { WithoutChildren } from 'bits-ui';
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { CaretLeft } from 'radix-icons-svelte';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'ghost',
		size = 'icon',
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
	{variant}
	{size}
	class={cn(
		'absolute size-8 touch-manipulation rounded-full focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
		emblaCtx.orientation === 'horizontal'
			? '-left-12 top-1/2 h-full w-12 -translate-y-1/2 cursor-pointer touch-manipulation text-zinc-500 hover:bg-transparent hover:brightness-200'
			: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
		className
	)}
	disabled={!emblaCtx.canScrollPrev}
	onclick={emblaCtx.scrollPrev}
	onkeydown={emblaCtx.handleKeyDown}
	{...restProps}
	bind:ref
>
	<div class="size-fit scale-[295%]">
		<CaretLeft />
	</div>
	<span class="sr-only">Previous slide</span>
</Button>
