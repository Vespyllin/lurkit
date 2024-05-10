<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'clsx';
	import Markdown from '../Markdown.svelte';

	let {
		text,
		clamp,
		class: className
	}: { text: string; clamp?: boolean; class?: ClassValue } = $props();
</script>

<div
	class={cn(
		'flex flex-col gap-5 whitespace-pre text-wrap text-lg text-gray-300 ',
		clamp && '[&>div>*:not(:first-child)]:hidden [&_p]:line-clamp-6',
		className
	)}
>
	<Markdown text={cleanText(text, !!clamp)} />
</div>
