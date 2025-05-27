<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import { ExternalLink } from 'radix-icons-svelte';

	let {
		title,
		url,
		thumbnail,
		clamp,
		class: className
	}: { title: string; url: string; thumbnail: string; clamp?: boolean; class?: string } = $props();
	const hasThumbnail = thumbnail && thumbnail.indexOf('.') > -1;
</script>

<div class={cn(hasThumbnail && 'flex h-[5.5rem]', className)}>
	<div>
		<h1 class={cn('text-wrap break-words text-2xl font-medium', clamp && 'line-clamp-2')}>
			{cleanText(title)}
		</h1>

		<a
			class={cn(
				'text-ellipsis break-all text-blue-600 underline visited:text-purple-600 hover:text-blue-800',
				clamp && 'line-clamp-1'
			)}
			href={url}
		>
			{url}
		</a>
	</div>

	{#if hasThumbnail}
		<a href={url} class="ml-auto pl-2">
			<div class="relative size-full overflow-hidden">
				<img
					alt=""
					src={thumbnail}
					class="size-full max-w-36 rounded-md object-cover"
					onerror={(e) => {
						if (e.currentTarget.parentElement) e.currentTarget.parentElement.style.display = 'none';
					}}
				/>
				<div class="absolute bottom-0 right-0 m-1 rounded-sm bg-black p-0.5 opacity-85">
					<ExternalLink size={15} color="#FFF" />
				</div>
			</div>
		</a>
	{/if}
</div>
