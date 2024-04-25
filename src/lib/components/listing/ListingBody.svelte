<script lang="ts">
	import Link from './parts/Link.svelte';
	import Video from '$lib/components/listing/parts/Video.svelte';
	import Gallery from './parts/Gallery.svelte';
	import Image from './parts/Image.svelte';
	import Text from './parts/Text.svelte';

	let { post, expand }: { post: Listing; expand?: boolean } = $props();

	const getMediaType = (post: Listing, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};
</script>

{#if post.post_hint == 'link'}
	{@const { thumbnail, title, url } = post}
	<Link {thumbnail} {title} {url} />
{:else}
	<h1 class="text-2xl font-semibold">{post.title}</h1>

	{#if post.is_video}
		<Video url={post.url} />
	{:else if post.is_gallery}
		<Gallery {post} />
	{:else if post.post_hint == 'image'}
		<Image url={post.url} />
	{:else if post.post_hint == 'rich:video'}
		<h1 class="text-xl font-semibold text-red-500">TODO: Handle rich:video</h1>
	{/if}

	{#if post.selftext?.length > 0}
		<Text text={post.selftext} clamp={!expand} />
	{/if}
{/if}
