<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Text, Video, IFrame } from '$lib/components/media';
	import { ArrowDown, ArrowUp, ChatBubble } from 'radix-icons-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ListingHeader from './ListingHeader.svelte';
	import { cn } from '$lib/utils';
	import ListingFooter from './ListingFooter.svelte';

	let { post, expand }: { post: ListingData; expand?: boolean } = $props();
</script>

<div
	class={cn(
		'flex cursor-default flex-col rounded-md p-2',
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
		{#if !expand}
			<a href={post.permalink} draggable="false">
				<h1 class="my-2 text-2xl font-semibold">{cleanText(post.title)}</h1>
			</a>
		{:else}
			<h1 class="my-2 text-2xl font-semibold">{cleanText(post.title)}</h1>
		{/if}

		{#if post.is_video}
			<Video url={post.url} />
		{:else if post.post_hint == 'image' || (expand && post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)/))}
			<Image url={post.url} />
		{:else if post.is_gallery}
			<Gallery {post} />
		{:else if post.post_hint == 'rich:video'}
			<div class="flex w-full items-center justify-center">
				<IFrame {post} />
			</div>
		{:else if post.selftext?.length > 0}
			<Text text={post.selftext} clamp />
		{/if}

		{#if post.selftext?.length > 0 && expand}
			<Text text={post.selftext} />
		{/if}
	{/if}

	<ListingFooter class="mt-2" {post} />
</div>
