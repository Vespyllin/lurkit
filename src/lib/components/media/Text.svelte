<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'clsx';
	import { Markdown } from '../ui/markdown';

	let {
		text,
		clamp,
		class: className
	}: { text: string; clamp?: boolean; class?: ClassValue } = $props();
</script>

<div
	class={cn(
		'flex flex-col gap-5 whitespace-pre text-wrap text-base [&_*]:text-zinc-200',
		clamp && '[&>div>*:not(:first-child)]:hidden [&_p]:line-clamp-6',
		className
	)}
>
	<Markdown text={cleanText(text, !!clamp)} />
</div>
