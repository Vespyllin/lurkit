<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'clsx';
	import { Markdown } from '../ui/markdown';

	let {
		text,
		clamp,
		class: className
	}: { text: string; clamp?: boolean; class?: string } = $props();
</script>

<Markdown
	class={cn(clamp && '[&>div>*:not(:first-child)]:hidden [&_p]:line-clamp-6', className)}
	text={cleanText(text, !!clamp)}
/>
