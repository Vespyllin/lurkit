<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Text, Video, IFrame } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';

	let { post }: { post: ListingData } = $props();
</script>

<div
	class="flex cursor-default flex-col rounded-md px-2 hover:bg-[hsl(220,14.3,7.1)] [&_a]:cursor-pointer"
>
	<a href={post.permalink} draggable="false">
		<ListingHeader
			locked={post.locked}
			author={post.author}
			created_utc={post.created_utc}
			over_18={post.over_18}
			subreddit={post.subreddit}
		/>
	</a>

	{#if post.post_hint == 'link'}
		{@const { thumbnail, title, url } = post}

		<a href={post.permalink} draggable="false">
			<Link class="mt-2" {thumbnail} title={cleanText(title)} {url} clamp />
		</a>
	{:else}
		<a href={post.permalink} draggable="false">
			<h1 class="mt-2 text-wrap break-words text-2xl font-medium">
				{cleanText(post.title)}
				{#if post.is_crosspost}
					<span class="text-base font-normal text-zinc-400">
						Crosspost from {post.crosspost_parent?.subreddit.display_name}
					</span>
				{/if}
			</h1>
		</a>

		{#if post.is_video}
			<Video class="mt-2" url={post.url} />
		{:else if post.post_hint == 'link'}
			<!-- Reddit crossposts -->
			<Video class="mt-2" url={post.url} />
		{:else if post.post_hint == 'image'}
			<Image class="mt-2" url={post.url} />
		{:else if post.is_gallery}
			<Gallery class="mt-2" {post} />
		{:else if post.post_hint == 'rich:video'}
			<div class="mt-2 flex items-center justify-center">
				<IFrame {post} />
			</div>
		{:else if post.selftext?.length > 0}
			<a href={post.permalink} draggable="false">
				<Text class="mt-2 cursor-pointer" text={post.selftext} clamp />
			</a>
		{/if}
	{/if}

	<a href={post.permalink} draggable="false">
		<ListingFooter class="mt-2" {post} />
	</a>
</div>
