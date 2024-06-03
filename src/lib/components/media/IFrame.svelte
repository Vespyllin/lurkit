<script lang="ts">
	import { cleanText } from '$lib';

	let { post }: { post: ListingData } = $props();
</script>

{@html cleanText(post.secure_media_embed.content).replace(/style="[^"]*"/gi, '')}
