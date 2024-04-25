<script lang="ts">
	import Link from './parts/Link.svelte';
	import Video from '$lib/components/listing/parts/Video.svelte';
	import Gallery from './parts/Gallery.svelte';
	import Image from './parts/Image.svelte';
	import Text from './parts/Text.svelte';
	import { ArrowUp, ChatBubble } from 'radix-icons-svelte';
	import { getTimeAgo } from '$lib';

	let { post, expand }: { post: Listing; expand?: boolean } = $props();

	const icon_url = post?.subreddit?.community_icon?.split('?')[0] ?? post.subreddit.icon_img;
</script>

{JSON.stringify(post)}

<div class="space-y-2">
	<div class="flex h-5 items-center gap-2">
		{#if icon_url}
			<img src={icon_url} class="my-auto h-5 rounded-full object-contain" />
		{/if}
		<span class="text-zinc-200">
			{post.subreddit.display_name}
		</span>
		•
		<span class="text-zinc-400">
			{post.author}
		</span>
		•
		<span class="text-zinc-400">
			{getTimeAgo(post.created_utc)}
		</span>
	</div>

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

	<div class="pt-1 font-semibold">
		<div class="inline-flex items-center gap-1 rounded-3xl bg-black p-2 px-5">
			<div class="-ml-1">
				<ArrowUp size={20} />
			</div>
			<span>
				{post.score.toLocaleString()}
			</span>
			<span style="color:hsl({120 * post.upvote_ratio}, 85%, 50%);">
				({post.upvote_ratio.toLocaleString(undefined, { minimumFractionDigits: 2 })})
			</span>
		</div>
		<a href={`${post.permalink}`}>
			<div class="inline-flex items-center gap-1 rounded-3xl bg-black p-2 px-5">
				<ChatBubble size={20} />
				<span class="ml-1">
					{post.num_comments.toLocaleString()}
				</span>
			</div>
		</a>
	</div>
</div>
