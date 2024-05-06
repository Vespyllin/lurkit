<script lang="ts">
	import Link from './Link.svelte';
	import Gallery from './Gallery.svelte';
	import Image from './Image.svelte';
	import Text from './Text.svelte';
	import Video from './Video.svelte';
	import { ArrowUp, ChatBubble, ExclamationTriangle } from 'radix-icons-svelte';
	import { getTimeAgo } from '$lib';
	import IFrame from './IFrame.svelte';
	import SubredditLink from './SubredditLink.svelte';

	let { post, expand }: { post: Listing; expand?: boolean } = $props();
</script>

<div>
	<div class="mb-2 flex h-5 items-center gap-2">
		<SubredditLink subreddit={post.subreddit} />
		•
		<span class="text-zinc-400">
			{post.author}
		</span>
		•
		<span class="text-zinc-400">
			{getTimeAgo(post.created_utc)}
		</span>
		{#if post.over_18}
			•
			<div class="flex h-5 items-center gap-1">
				<div class="mt-1 rounded-full text-zinc-400">
					<ExclamationTriangle />
				</div>
				<span class="text-zinc-400"> 18+ </span>
			</div>
		{/if}
	</div>

	{#if post.post_hint == 'link'}
		{@const { thumbnail, title, url } = post}
		<Link {thumbnail} {title} {url} />
	{:else}
		<h1 class="mb-2 text-2xl font-semibold">{post.title}</h1>

		{#if post.is_video}
			<Video url={post.url} />
		{:else if post.post_hint == 'image'}
			<Image url={post.url} />
		{:else if post.is_gallery}
			<Gallery {post} />
		{:else if post.post_hint == 'rich:video'}
			<IFrame {post} />
		{:else if post.selftext?.length > 0 && !expand}
			<Text text={post.selftext} clamp />
		{/if}

		{#if post.selftext?.length > 0 && expand}
			<Text class="mt-2" text={post.selftext} />
		{/if}
	{/if}

	<div class="mt-2 font-semibold">
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
