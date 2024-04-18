<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';
	import SyncedAv from '$lib/components/listing/SyncedAV.svelte';
	import { cn } from '$lib/utils';

	let { post }: { post: Listing } = $props();

	const getMediaType = (post: Listing, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};
</script>

<div>
	{#if post.post_hint == 'link'}
		{@const hasThumbnail = post.thumbnail && post.thumbnail.indexOf('.') > -1}
		<div class="flex gap-2">
			<div class={cn('mr-auto', hasThumbnail && 'w-[calc(100%-9.5rem)]')}>
				<h1 class="break-words text-2xl font-semibold">
					{post.title}
				</h1>
				<a
					class="block overflow-hidden truncate text-ellipsis break-words text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
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
		<Carousel.Root class="flex h-[550px] justify-center">
			<Carousel.Content>
				{#each post?.gallery_data?.items ?? [] as gallery_picture}
					<Carousel.Item class="rounded-2xl">
						<div class="-p-4 flex justify-center rounded-2xl bg-black">
							<img
								class="max-h-[550px] object-contain"
								src={`https://i.redd.it/${gallery_picture.media_id}.${getMediaType(post, gallery_picture.media_id)}`}
							/>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous class="translate-x-16" />
			<Carousel.Next class="-translate-x-16" />
		</Carousel.Root>
	{:else if post.post_hint == 'image'}
		<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
		<img src={post.url} class="max-h-[550px] w-full rounded-2xl bg-black object-contain" />
	{:else if post.post_hint == 'rich:video'}
		<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
		<h1 class="text-xl font-semibold text-red-500">TODO: Handle rich:video</h1>
	{:else if post.selftext?.length > 0}
		<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
		<p
			class="max-h-[200px] truncate text-ellipsis whitespace-pre text-wrap break-words rounded-lg text-lg text-gray-300"
		>
			{post.selftext.replaceAll('\n', ' ')}
		</p>
	{:else}
		<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>
	{/if}
</div>
