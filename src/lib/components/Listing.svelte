<script lang="ts">
	import { Link, Gallery, Image, Text, Video, IFrame } from './media';
	import { ArrowDown, ArrowUp, ChatBubble, ExclamationTriangle } from 'radix-icons-svelte';
	import { cleanText, getTimeAgo } from '$lib';
	import SubredditPopover from './SubredditPopover.svelte';
	import Separator from './ui/separator/separator.svelte';

	let { post, expand }: { post: ListingData; expand?: boolean } = $props();
</script>

<div class="flex flex-col gap-2">
	<div class="flex h-5 items-center gap-2">
		<SubredditPopover subreddit={post.subreddit} />
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
				<div class="rounded-full text-zinc-400">
					<ExclamationTriangle />
				</div>
				<span class="text-zinc-400"> 18+ </span>
			</div>
		{/if}
	</div>

	{#if post.post_hint == 'link'}
		{@const { thumbnail, title, url } = post}
		<Link {thumbnail} title={cleanText(title)} {url} />
	{:else}
		<h1 class="text-2xl font-semibold">{cleanText(post.title)}</h1>

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
		{:else if expand && post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)/)}
			<Image url={post.url} />
		{/if}

		{#if post.selftext?.length > 0 && expand}
			<Text text={post.selftext} />
		{/if}
	{/if}

	<a href={post.permalink}>
		<div class="flex gap-10 pr-5 text-lg font-semibold text-zinc-200">
			<div class="inline-flex items-center gap-1">
				<ArrowUp size={20} />
				<span>
					{post.score.toLocaleString()}
				</span>
			</div>

			<div class="inline-flex items-center gap-1">
				<div class="flex">
					<ArrowUp size={20} />
					<div class="-ml-2 mt-auto">
						<ArrowDown size={14} />
					</div>
				</div>

				<span>{post.upvote_ratio * 100}%</span>
			</div>

			<div class="inline-flex items-center gap-1">
				<ChatBubble size={20} />
				<span class="ml-1">{post.num_comments.toLocaleString()}</span>
			</div>

			<div class="flex w-full items-center">
				<Separator class="h-0.5 bg-zinc-600" />
			</div>
		</div>
	</a>
</div>
