<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Markdown, Video, IFrame } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import Self from './ListingPortal.svelte';
	import { cn } from '$lib/utils';

	let { post, class: classList }: { post: ListingData; class?: string } = $props();

	const urlIsImage = post.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)$/);
</script>

<div
	class={cn(
		'flex cursor-default flex-col rounded-md p-2 hover:bg-[hsl(220,14.3,7.1)] [&_a]:cursor-pointer',
		classList
	)}
>
	<a href={post.permalink} draggable="false">
		<ListingHeader
			crossposted_from={post.crosspost?.subreddit.display_name}
			locked={post.locked}
			author={post.author}
			created_utc={post.created_utc}
			over_18={post.over_18}
			subreddit={post.subreddit}
			stickied={post.stickied}
		/>
	</a>

	{#if post.post_hint == 'link' && !post.crosspost && !urlIsImage && !post.url.includes('.gifv')}
		{@const { thumbnail, title, url } = post}

		<a href={post.permalink} draggable="false">
			<Link class="mt-2" {thumbnail} title={cleanText(title)} {url} clamp />
		</a>
	{:else}
		<a href={post.permalink} draggable="false">
			<h1 class="mt-2 text-wrap break-words text-2xl font-medium">
				{cleanText(post.title)}
			</h1>
		</a>

		{#if post.crosspost}
			<div class="mt-2 rounded-lg border-2 px-2 pt-1">
				<Self post={post.crosspost} />
			</div>
		{:else if post.is_video}
			<Video class="mt-2" url={post.url} />
		{:else if post.url.includes('.gifv')}
			<Video class="mt-2" url={post.url.replace('.gifv', '.mp4')} />
		{:else if post.post_hint == 'image' || urlIsImage}
			<Image class="mt-2" url={post.url} />
		{:else if post.is_gallery}
			<Gallery class="mt-2" {post} />
		{:else if post.post_hint == 'rich:video'}
			<div class="mt-2 flex items-center justify-center">
				<IFrame {post} />
			</div>
		{:else if post.selftext?.length > 0}
			<a
				href={post.permalink}
				class="max-h-64 overflow-hidden [&_*]:pointer-events-none"
				draggable="false"
			>
				<Markdown text={post.selftext} />
			</a>
		{/if}
	{/if}

	<a href={post.permalink} draggable="false">
		<ListingFooter class="mt-2" {post} />
	</a>
</div>
