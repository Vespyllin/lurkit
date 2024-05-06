<script lang="ts">
	import { cleanText } from '$lib';

	let { post }: { post: Listing } = $props();
</script>

<div class="flex">
	<div class="mx-auto">
		{@html cleanText(post.secure_media_embed.content)
			.replace('height="200"', 'height="300"')
			.replace('width="356"', 'width="534"')}
	</div>
</div>
