<script lang="ts">
	import { run } from 'svelte/legacy';

	import { writable } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import { type CarouselAPI, type CarouselProps, setEmblaContex } from './context.js';
	import { cn } from '$lib/utils.js';

	type $$Props = CarouselProps;

	interface Props {
		opts?: any;
		plugins?: NonNullable<$$Props['plugins']>;
		api?: $$Props['api'];
		orientation?: NonNullable<$$Props['orientation']>;
		class?: $$Props['class'];
		children?: import('svelte').Snippet;
		[key: string]: any;
	}

	let {
		opts = {} as any,
		plugins = [],
		api = $bindable(undefined),
		orientation = 'horizontal',
		class: className = undefined,
		children,
		...rest
	}: Props = $props();

	const apiStore = writable<CarouselAPI | undefined>(undefined);
	const orientationStore = writable(orientation);
	const canScrollPrev = writable(false);
	const canScrollNext = writable(false);
	const optionsStore = writable(opts);
	const pluginStore = writable(plugins);

	const scrollPrev = () => {
		api?.scrollPrev();
	};
	const scrollNext = () => {
		api?.scrollNext();
	};

	const onInit = (event: CustomEvent<CarouselAPI>) => {
		api = event.detail;
		apiStore.set(api);
	};

	const onSelect = (api: CarouselAPI) => {
		if (!api) return;
		canScrollPrev.set(api.canScrollPrev());
		canScrollNext.set(api.canScrollNext());
	};

	$effect(() => {
		orientationStore.set(orientation);
		pluginStore.set(plugins);
		optionsStore.set(opts);

		if (api) {
			onSelect(api);
			api.on('select', onSelect);
			api.on('reInit', onSelect);
		}
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			scrollPrev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			scrollNext();
		}
	};

	setEmblaContex({
		api: apiStore,
		scrollPrev,
		scrollNext,
		orientation: orientationStore,
		canScrollNext,
		canScrollPrev,
		handleKeyDown,
		options: optionsStore,
		plugins: pluginStore,
		onInit
	});

	onDestroy(() => {
		api?.off('select', onSelect);
	});
</script>

<div class={cn('relative', className)} role="region" aria-roledescription="carousel" {...rest}>
	{@render children?.()}
</div>
