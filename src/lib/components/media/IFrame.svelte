<script lang="ts">
	import { cleanText } from '$lib';

	let { post }: { post: ListingData } = $props();
</script>

<div class="mx-auto flex">
	{@html cleanText(post.secure_media_embed.content).replace(/style="[^"]*"/gi, '')}
</div>
