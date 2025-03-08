<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Markdown, Video, IFrame } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import Self from './ListingPortal.svelte';
	import { cn } from '$lib/utils';

	let {
		listing,
		inSubreddit,
		class: classList
	}: { listing: RedditT3Data; inSubreddit?: boolean; class?: string } = $props();

	const urlIsImage = listing.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)$/);
	const crosspost = listing.crosspost_parent_list?.find((x) => x.name == listing.crosspost_parent);
</script>

<div
	class={cn(
		'flex cursor-default flex-col rounded-md p-2 hover:bg-[hsl(220,14.3,7.1)] [&_a]:cursor-pointer',
		classList
	)}
>
	<a href={listing.permalink} draggable="false">
		<ListingHeader
			crossposted_from={crosspost?.subreddit_name_prefixed}
			locked={listing.locked}
			author={listing.author}
			created_utc={listing.created_utc}
			over_18={listing.over_18}
			subreddit={listing.sr_detail}
			stickied={!!inSubreddit && listing.stickied}
			flairs={!!inSubreddit ? listing.link_flair_richtext : undefined}
			flairColor={!!inSubreddit ? listing.link_flair_background_color : undefined}
		/>
	</a>

	{#if listing.post_hint == 'link' && !crosspost && !urlIsImage && !listing.url.includes('.gifv')}
		{@const { thumbnail, title, url } = listing}

		<a href={listing.permalink} draggable="false">
			<Link class="mt-2" {thumbnail} title={cleanText(title)} {url} clamp />
		</a>
	{:else}
		<a href={listing.permalink} draggable="false">
			<h1
				class={cn(
					'mt-2 text-wrap break-words text-2xl font-medium',
					crosspost?.title == listing.title && 'line-clamp-1 text-ellipsis'
				)}
			>
				{cleanText(listing.title)}
			</h1>
		</a>

		{#if crosspost}
			<div class="mt-2 rounded-lg border-2">
				<Self listing={crosspost} />
			</div>
		{:else if listing.is_video}
			<Video class="mt-2" url={listing.url} mediaData={listing.secure_media?.reddit_video} />
		{:else if listing.url.includes('.gifv')}
			<Video class="mt-2" url={listing.url.replace('.gifv', '.mp4')} />
		{:else if listing.post_hint == 'image' || urlIsImage}
			<Image class="mt-2" url={listing.url} blur={listing.spoiler} />
		{:else if listing.is_gallery}
			<Gallery class="mt-2" post={listing} blur={listing.spoiler} />
		{:else if listing.post_hint == 'rich:video'}
			<div class="mt-2 flex items-center justify-center">
				<IFrame post={listing} />
			</div>
		{:else if listing.selftext?.length > 0}
			<!-- h-48 + mt-2 ==> 12.5 rem height -->
			<a
				href={listing.permalink}
				class="max-h-[12.5rem] overflow-hidden [&_*]:pointer-events-none"
				data-sveltekit-preload-data="off"
				draggable="false"
			>
				<Markdown class="mt-2" crop text={listing.selftext_html} />
			</a>
		{/if}
	{/if}

	<a href={listing.permalink} draggable="false">
		<ListingFooter class="mt-2" {listing} />
	</a>
</div>
