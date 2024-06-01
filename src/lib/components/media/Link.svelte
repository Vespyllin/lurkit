<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		title,
		url,
		thumbnail,
		clamp,
		class: className
	}: { title: string; url: string; thumbnail: string; clamp?: boolean; class?: string } = $props();
	const hasThumbnail = thumbnail && thumbnail.indexOf('.') > -1;
</script>

<div class={cn('flex gap-2', className)}>
	<div class="mr-auto">
		<h1 class={cn('text-wrap break-words text-2xl font-semibold', clamp && 'line-clamp-2')}>
			{title}
		</h1>

		<a
			class="inline-block text-ellipsis text-wrap break-all text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
			href={url}
		>
			{url}
		</a>
	</div>

	{#if hasThumbnail}
		<img src={thumbnail} class="h-24 min-h-24 w-32 min-w-32 rounded-xl object-cover" />
	{/if}
</div>
