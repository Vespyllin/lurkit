<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Text, Video, IFrame } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';

	let { post }: { post: ListingData } = $props();
</script>

<div class="flex cursor-default flex-col rounded-md">
	<ListingHeader
		locked={post.locked}
		flairs={post.link_flair_richtext}
		author={post.author}
		created_utc={post.created_utc}
		over_18={post.over_18}
		subreddit={post.subreddit}
	/>

	{#if post.post_hint == 'link' || ((post.selftext?.length ?? 0) == 0 && !post.url.includes('redd.it') && !post.url.includes('reddit'))}
		{@const { thumbnail, title, url } = post}
		<!-- TODO: vreddit thing -->
		<Link class="mt-2" {thumbnail} title={cleanText(title)} {url} />
	{:else}
		<h1 class="mt-2 cursor-text text-wrap break-words text-2xl font-medium">
			{cleanText(post.title)}
		</h1>

		{#if post.selftext?.length > 0}
			<Text class="mt-2" text={post.selftext} />
		{/if}

		{#if post.is_video}
			<Video class="mt-2" url={post.url} />
		{:else if post.post_hint == 'image' && post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)/)}
			<Image class="mt-2" url={post.url} />
		{:else if post.is_gallery}
			<Gallery class="mt-2" {post} />
		{:else if post.post_hint == 'rich:video'}
			<div class="mt-2 flex items-center justify-center">
				<IFrame {post} />
			</div>
		{/if}
	{/if}

	<ListingFooter class="mt-2 [&_span]:cursor-text" {post} />
</div>
