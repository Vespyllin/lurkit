<script lang="ts">
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { CaretLeft } from 'radix-icons-svelte';

	type $$Props = Props;

	let className: $$Props['class'] = undefined;
	export { className as class, customClick };

	const { canScrollPrev, scrollPrev, handleKeyDown } = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
	variant="ghost"
	size="icon"
	class={cn(
		'absolute -left-12 top-1/2 h-full w-12 -translate-y-1/2 cursor-pointer touch-manipulation hover:bg-transparent',
		className
	)}
	disabled={!$canScrollPrev}
	on:click={scrollPrev}
	on:keydown={handleKeyDown}
	{...$$restProps}
>
	<CaretLeft class="h-12 w-12 text-zinc-500 hover:brightness-200" />
	<span class="sr-only">Previous slide</span>
</Button>
