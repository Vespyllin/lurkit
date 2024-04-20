<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import SyncedAv from '$lib/components/listing/SyncedAV.svelte';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import { cleanText } from '$lib';

	let { post }: { post: Listing } = $props();

	const getMediaType = (post: Listing, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};
</script>

{#if post.post_hint == 'link'}
	{@const hasThumbnail = post.thumbnail && post.thumbnail.indexOf('.') > -1}
	<div class="flex gap-2">
		<div class="mr-auto">
			<h1 class="text-wrap break-words text-2xl font-semibold">
				{post.title}
			</h1>
			<a
				class="block overflow-hidden truncate text-ellipsis text-wrap break-words text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
				href={post.url}
			>
				{post.url}
			</a>
		</div>

		{#if hasThumbnail}
			<div class="flex items-center">
				<img src={post.thumbnail} class="min-h-24 min-w-24 rounded-xl object-cover" />
			</div>
		{/if}
	</div>
{:else if post.is_video}
	<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
	<SyncedAv url={post.url} />
{:else if post.is_gallery}
	<h1 class="mb-2 text-2xl font-semibold">{post.title} {post.post_hint}</h1>
	<Carousel.Root class="rounded-2xl">
		<Carousel.Content class="pl-4">
			{#each post?.gallery_data?.items ?? [] as gallery_picture}
				<Carousel.Item>
					<img
						class="mx-auto max-h-[600px] w-fit object-contain"
						src={`https://i.redd.it/${gallery_picture.media_id}.${getMediaType(post, gallery_picture.media_id)}`}
					/>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="translate-x-16" />
		<Carousel.Next class="-translate-x-16" />
	</Carousel.Root>
{:else if post.post_hint == 'image'}
	<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
	<img src={post.url} class="max-h-[600px] rounded-2xl object-contain" />
{:else if post.post_hint == 'rich:video'}
	<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
	<h1 class="text-xl font-semibold text-red-500">TODO: Handle rich:video</h1>
{:else if post.selftext?.length > 0}
	<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
	<p class="line-clamp-6 whitespace-pre text-wrap text-lg text-gray-300">
		<Markdown source={cleanText(post.selftext, true)} />
	</p>
{:else}
	<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
{/if}
