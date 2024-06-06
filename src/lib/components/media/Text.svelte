<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import { Markdown } from '../ui/markdown';

	let {
		text,
		clamp,
		class: className
	}: { text: string; clamp?: boolean; class?: string } = $props();
</script>

<Markdown
	class={cn(clamp && '[&>*:not(:first-child)]:hidden [&>*]:line-clamp-6', className)}
	text={cleanText(text, !!clamp)}
/>
