<script lang="ts">
	import { cleanText } from '$lib';

	let { post }: { post: ListingData } = $props();
</script>

<div class="aspect-video w-full [&_iframe]:h-full [&_iframe]:w-full">
	{@html cleanText(post.secure_media_embed.content)
		.replace(/style="[^"]*"/gi, '')
		.replace(/width="[^"]*"/gi, '')
		.replace(/height="[^"]*"/gi, '')}
</div>
