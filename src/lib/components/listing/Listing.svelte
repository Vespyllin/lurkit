<script lang="ts">
	import { cleanText } from '$lib';
	import { cn } from '$lib/utils';
	import { Link, Gallery, Image, Text, Video, IFrame } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';

	let { post, expand }: { post: ListingData; expand?: boolean } = $props();
</script>

<div
	class={cn(
		'flex cursor-default flex-col rounded-md [&_a]:cursor-pointer',
		!expand && 'p-2 hover:bg-[hsl(220,14.3,7.1)]'
	)}
>
	{#if !expand}
		<a href={post.permalink} draggable="false">
			<ListingHeader
				author={post.author}
				created_utc={post.created_utc}
				over_18={post.over_18}
				subreddit={post.subreddit}
			/>
		</a>
	{:else}
		<ListingHeader
			author={post.author}
			created_utc={post.created_utc}
			over_18={post.over_18}
			subreddit={post.subreddit}
		/>
	{/if}

	{#if post.post_hint == 'link'}
		{@const { thumbnail, title, url } = post}

		{#if !expand}
			<a href={post.permalink} draggable="false">
				<Link class="mt-2" {thumbnail} title={cleanText(title)} {url} clamp={!expand} />
			</a>
		{:else}
			<Link class="mt-2" {thumbnail} title={cleanText(title)} {url} clamp={!expand} />
		{/if}
	{:else}
		{#if !expand}
			<a href={post.permalink} draggable="false">
				<h1 class="mt-2 text-2xl">{cleanText(post.title)}</h1>
			</a>
		{:else}
			<h1 class="mt-2 text-2xl">{cleanText(post.title)}</h1>
		{/if}

		{#if post.selftext?.length > 0 && expand}
			<Text class="mt-2" text={post.selftext} />
		{/if}

		{#if post.is_video}
			<Video class="mt-2" url={post.url} />
		{:else if post.post_hint == 'image' || (expand && post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)/))}
			<Image class="mt-2" url={post.url} />
		{:else if post.is_gallery}
			<Gallery class="mt-2" {post} />
		{:else if post.post_hint == 'rich:video'}
			<div class="mt-2 flex w-full items-center justify-center">
				<IFrame {post} />
			</div>
		{:else if post.selftext?.length > 0 && !expand}
			{#if !expand}
				<a href={post.permalink} draggable="false">
					<Text class="mt-2 cursor-pointer" text={post.selftext} clamp />
				</a>
			{:else}
				<Text class="mt-2" text={post.selftext} clamp />
			{/if}
		{/if}
	{/if}

	{#if !expand}
		<a href={post.permalink} draggable="false">
			<ListingFooter class="mt-2" {post} />
		</a>
	{:else}
		<ListingFooter class="mt-2" {post} />
	{/if}
</div>
