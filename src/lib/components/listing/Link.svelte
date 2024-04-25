<script lang="ts">
	let { title, url, thumbnail }: { title: string; url: string; thumbnail: string } = $props();
	const hasThumbnail = thumbnail && thumbnail.indexOf('.') > -1;
</script>

<div class="flex gap-2">
	<div class="mr-auto">
		<h1 class="text-wrap break-words text-2xl font-semibold">
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
		<div class="flex items-center">
			<img src={thumbnail} class="min-h-24 min-w-24 rounded-xl object-cover" />
		</div>
	{/if}
</div>
