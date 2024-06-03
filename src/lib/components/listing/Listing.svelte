<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Text, Video, IFrame } from '$lib/components/media';
	import { ArrowDown, ArrowUp, ChatBubble } from 'radix-icons-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ListingHeader from './ListingHeader.svelte';
	import { cn } from '$lib/utils';

	let { post, expand }: { post: ListingData; expand?: boolean } = $props();
</script>

<div
	class={cn(
		'flex cursor-default flex-col gap-2 rounded-md p-2',
		!expand && 'hover:bg-[hsl(220,14.3,7.1)]'
	)}
>
	<ListingHeader
		author={post.author}
		created_utc={post.created_utc}
		over_18={post.over_18}
		subreddit={post.subreddit}
	/>
	{#if post.post_hint == 'link'}
		{@const { thumbnail, title, url } = post}

		<Link {thumbnail} title={cleanText(title)} {url} clamp={!expand} />
	{:else}
		<h1 class="text-2xl font-semibold">{cleanText(post.title)}</h1>

		<div onclick={(e) => e.preventDefault()}>
			{#if post.is_video}
				<Video url={post.url} />
			{:else if post.post_hint == 'image' || (expand && post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)/))}
				<Image url={post.url} />
			{:else if post.is_gallery}
				<Gallery {post} />
			{:else if post.post_hint == 'rich:video'}
				<div class="flex w-full items-center justify-center">
					<!-- <IFrame {post} /> -->
				</div>
			{/if}
		</div>

		{#if post.selftext?.length > 0 && !expand && post.post_hint !== 'rich:video' && !post.is_gallery && post.post_hint !== 'image' && !expand && post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)/) && !post.is_video}
			<!-- <div class="hidden lg:block"> -->
			<Text text={post.selftext} clamp />
			<!-- </div> -->

			<!-- !BUGFIX: 	Provided fixed width to prevent the markdown from overflowing on mobile -->
			<!-- ! 			89lvw was chosen manually as the most natural width -->
			<!-- <div class="block w-[89lvw] lg:hidden">
				<Text text={post.selftext} clamp />
			</div> -->
		{/if}

		{#if post.selftext?.length > 0 && expand}
			<Text text={post.selftext} />
		{/if}
	{/if}

	<div class="flex gap-10 text-lg font-semibold text-zinc-200">
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

			<span>{Math.round(post.upvote_ratio * 100).toLocaleString()}%</span>
		</div>

		<div class="inline-flex items-center gap-1">
			<ChatBubble size={20} />
			<span class="ml-1">{post.num_comments.toLocaleString()}</span>
		</div>

		<div class="hidden w-full items-center lg:flex">
			<Separator class="h-0.5 bg-zinc-600" />
		</div>
	</div>
</div>
