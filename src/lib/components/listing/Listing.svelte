<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Video, IFrame, Markdown } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import ListingPortal from './ListingPortal.svelte';
	import { cn } from '$lib/utils';

	let { listing }: { listing: RedditT3Data } = $props();
	const urlIsImage = listing.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)$/);
	const crosspost = listing.crosspost_parent_list?.find((x) => x.name == listing.crosspost_parent);
</script>

<div class="mt-2 flex flex-col space-y-2 rounded-md [&_p]:cursor-auto">
	<ListingHeader
		edited={listing.edited}
		crossposted_from={crosspost?.subreddit_name_prefixed}
		locked={listing.locked}
		flairs={listing.link_flair_richtext}
		flairColor={listing.link_flair_background_color}
		author={listing.author}
		created_utc={listing.created_utc}
		over_18={listing.over_18}
		subreddit={listing.sr_detail}
		stickied={listing.stickied}
		distinguished={listing.distinguished}
	/>

	{#if (listing.post_hint == 'link' || !(listing.domain.includes('redd') || listing.domain.includes('self.'))) && !crosspost && !urlIsImage && !listing.url.includes('.gifv')}
		{@const { thumbnail, title, url } = listing}

		<Link {thumbnail} {title} {url} />

		{#if listing.selftext?.length > 0}
			<Markdown text={listing.selftext} />
		{/if}
	{:else}
		<h1
			class={cn(
				'cursor-text text-wrap break-words text-2xl font-medium',
				crosspost?.title == listing.title && 'line-clamp-1 text-ellipsis'
			)}
		>
			{cleanText(listing.title)}
		</h1>

		{#if listing.selftext?.length > 0}
			<Markdown text={listing.selftext_html} />
		{/if}

		{#if listing.removed_by && listing.removed_by != 'deleted'}
			<p class="text-zinc-300">
				[Removed by {listing.removed_by}]
			</p>
		{:else if crosspost}
			<div class="rounded-lg border-2">
				<ListingPortal listing={crosspost} />
			</div>
		{:else if listing.is_video}
			<div>
				<Video url={listing.url} mediaData={listing.secure_media?.reddit_video} />
			</div>
		{:else if listing.url.includes('.gifv')}
			<Video url={listing.url.replace('.gifv', '.mp4')} />
		{:else if listing.post_hint == 'image' || urlIsImage}
			<Image url={listing.url} blur={listing.spoiler} />
		{:else if listing.is_gallery}
			<Gallery post={listing} blur={listing.spoiler} />
		{:else if listing.post_hint == 'rich:video'}
			<div class="flex items-center justify-center">
				<IFrame post={listing} />
			</div>
		{/if}
	{/if}

	<ListingFooter class="mt-2 [&_span]:cursor-text" {listing} />
</div>
