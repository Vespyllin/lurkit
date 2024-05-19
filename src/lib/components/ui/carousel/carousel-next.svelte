<script lang="ts">
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { CaretRight } from 'radix-icons-svelte';

	type $$Props = Props;

	let className: $$Props['class'] = undefined;
	export { className as class, customClick };

	const { canScrollNext, scrollNext, handleKeyDown } = getEmblaContext('<Carousel.Next/>');
</script>

<Button
	variant="ghost"
	size="icon"
	class={cn(
		'absolute -right-12 top-1/2 h-full w-12 -translate-y-1/2 cursor-pointer touch-manipulation rounded-none hover:bg-black hover:bg-opacity-15',
		className
	)}
	disabled={!$canScrollNext}
	on:click={scrollNext}
	on:keydown={handleKeyDown}
	{...$$restProps}
>
	<CaretRight class="h-12 w-12" />
	<span class="sr-only">Previous slide</span>
</Button>
