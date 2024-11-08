<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Video, IFrame, Markdown } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import ListingPortal from './ListingPortal.svelte';

	let { post }: { post: ListingData } = $props();
	const urlIsImage = post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)$/);
</script>

<div class="mt-2 flex cursor-default flex-col space-y-2 rounded-md [&_p]:cursor-auto">
	<ListingHeader
		edited={post.edited}
		crossposted_from={post.crosspost?.subreddit.display_name}
		locked={post.locked}
		flairs={post.link_flair_richtext}
		flairColor={post.link_flair_background_color}
		author={post.author}
		created_utc={post.created_utc}
		over_18={post.over_18}
		subreddit={post.subreddit}
		stickied={post.stickied}
	/>

	{#if post.post_hint == 'link' && !post.crosspost && !urlIsImage && !post.url.includes('.gifv')}
		{@const { thumbnail, title, url } = post}

		<Link {thumbnail} title={cleanText(title)} {url} />

		{#if post.selftext?.length > 0}
			<Markdown text={post.selftext} />
		{/if}
	{:else}
		<h1 class="cursor-text text-wrap break-words text-2xl font-medium">
			{cleanText(post.title)}
		</h1>

		{#if post.selftext?.length > 0}
			<Markdown text={post.selftext} />
		{/if}

		{#if post.removed_by && post.removed_by != 'deleted'}
			<p class="text-zinc-300">
				[Removed by {post.removed_by}]
			</p>
		{:else if post.crosspost}
			<div class="rounded-lg border-2">
				<ListingPortal class="px-4 pt-3" post={post.crosspost} />
			</div>
		{:else if post.is_video}
			<Video url={post.url} />
		{:else if post.url.includes('.gifv')}
			<Video url={post.url.replace('.gifv', '.mp4')} />
		{:else if post.post_hint == 'image' || urlIsImage}
			<Image url={post.url} />
		{:else if post.is_gallery}
			<Gallery {post} />
		{:else if post.post_hint == 'rich:video'}
			<div class="flex items-center justify-center">
				<IFrame {post} />
			</div>
		{/if}
	{/if}

	<ListingFooter class="mt-2 [&_span]:cursor-text" {post} />
</div>
