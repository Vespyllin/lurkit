<script lang="ts">
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { CaretLeft } from 'radix-icons-svelte';

	// type $$Props = Props;
	type $$Props = any;

	let className: $$Props['class'] = undefined;
	let customClick: $$Props['customClick'] = undefined;
	export { className as class, customClick };

	const { canScrollPrev, scrollPrev, handleKeyDown } = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
	variant="ghost"
	size="icon"
	class={cn(
		'absolute -left-12 top-1/2 h-full w-12 -translate-y-1/2 cursor-pointer touch-manipulation rounded-none hover:bg-opacity-25',
		className
	)}
	disabled={!$canScrollPrev}
	on:click={() => {
		scrollPrev();
		customClick();
	}}
	on:keydown={handleKeyDown}
	{...$$restProps}
>
	<CaretLeft class="h-12 w-12" />
	<span class="sr-only">Previous slide</span>
</Button>
