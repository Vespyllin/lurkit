<script lang="ts">
	import type { WithoutChildren } from 'bits-ui';
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { CaretRight } from 'radix-icons-svelte';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'ghost',
		size = 'icon',
		disabled,
		...restProps
	}: WithoutChildren<Props> = $props();

	const emblaCtx = getEmblaContext('<Carousel.Next/>');
</script>

<Button
	{variant}
	{size}
	class={cn(
		'absolute cursor-pointer touch-manipulation rounded-none text-zinc-500 mix-blend-exclusion hover:bg-transparent hover:text-white focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
		emblaCtx.orientation === 'horizontal'
			? '-right-12 top-1/2 h-full w-12 -translate-y-1/2 '
			: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
		className
	)}
	disabled={!emblaCtx.canScrollNext || disabled}
	onclick={emblaCtx.scrollNext}
	onkeydown={emblaCtx.handleKeyDown}
	bind:ref
	{...restProps}
>
	<div class="size-fit scale-[295%]">
		<CaretRight size={50} />
	</div>
	<span class="sr-only">Next slide</span>
</Button>
