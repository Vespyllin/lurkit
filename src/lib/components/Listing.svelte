<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Text, Video, IFrame } from './media';
	import { ArrowDown, ArrowUp, ChatBubble } from 'radix-icons-svelte';
	import Separator from './ui/separator/separator.svelte';
	import ListingHeader from './ListingHeader.svelte';

	let { post, expand }: { post: ListingData; expand?: boolean } = $props();
</script>

<div class="flex flex-col">
	{#if post.post_hint == 'link'}
		{@const { thumbnail, title, url } = post}
		<a href={post.permalink} class="space-y-2">
			<ListingHeader
				author={post.author}
				created_utc={post.created_utc}
				over_18={post.over_18}
				subreddit={post.subreddit}
			/>
			<Link {thumbnail} title={cleanText(title)} {url} />
		</a>
	{:else}
		<a href={post.permalink} class="space-y-2">
			<ListingHeader
				author={post.author}
				created_utc={post.created_utc}
				over_18={post.over_18}
				subreddit={post.subreddit}
			/>
			<h1 class="text-2xl font-semibold">{cleanText(post.title)}</h1>
		</a>

		<div class="mt-2">
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
				<Text class="mt-2" text={post.selftext} />
			{/if}
		</div>
	{/if}

	<a href={post.permalink}>
		<div class="mt-2 flex gap-10 pr-5 text-lg font-semibold text-zinc-200">
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

			<div class="hidden w-full items-center lg:flex">
				<Separator class="h-0.5 bg-zinc-600" />
			</div>
		</div>
	</a>
</div>
