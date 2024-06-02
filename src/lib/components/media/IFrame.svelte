<script lang="ts">
	import { cleanText } from '$lib';

	let { post }: { post: ListingData } = $props();
</script>

<div class="mx-auto flex w-full bg-red-500">
	{@html cleanText(post.secure_media_embed.content).replace(/style="[^"]*"/gi, '')}
</div>
