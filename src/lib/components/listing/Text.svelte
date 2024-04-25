<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import Markdown from 'svelte-exmarkdown';

	let { text, clamp }: { text: string; clamp?: boolean } = $props();
</script>

<div
	class={cn(
		'flex flex-col gap-5 whitespace-pre text-wrap text-lg text-gray-300 ',
		clamp && 'line-clamp-6'
	)}
>
	<Markdown md={cleanText(text, !!clamp)} />
</div>
