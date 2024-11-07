<script lang="ts">
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';
	import { Button, type Props } from '$lib/components/ui/button/index.js';
	import { CaretLeft } from 'radix-icons-svelte';

	type $$Props = Props;

	interface Props_1 {
		class?: $$Props['class'];
		[key: string]: any;
	}

	let { class: className = undefined, ...rest }: Props_1 = $props();

	const { canScrollPrev, scrollPrev, handleKeyDown } = getEmblaContext('<Carousel.Previous/>');
</script>

<Button
	variant="ghost"
	size="icon"
	class={cn(
		'absolute -left-12 top-1/2 h-full w-12 -translate-y-1/2 cursor-pointer touch-manipulation text-zinc-500 hover:bg-transparent hover:brightness-200',
		className
	)}
	disabled={!$canScrollPrev}
	on:click={scrollPrev}
	on:keydown={handleKeyDown}
	{...rest}
>
	<CaretLeft class="h-12 w-12" />
	<span class="sr-only">Previous slide</span>
</Button>
