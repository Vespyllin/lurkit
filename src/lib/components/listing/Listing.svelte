<script lang="ts">
	import { cleanText } from '$lib';
	import { Link, Gallery, Image, Video, IFrame, Markdown } from '$lib/components/media';
	import ListingHeader from './ListingHeader.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import ListingPortal from './ListingPortal.svelte';
	import { cn } from '$lib/utils';
	import { CircleBackslash } from 'radix-icons-svelte';

	let { listing }: { listing: RedditT3Data } = $props();

	const urlIsImage = listing.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)$/);
	const getCrosspost = (() => {
		let crosspost: RedditT3Data | undefined = undefined;
		return () => {
			if (!crosspost)
				crosspost = listing.crosspost_parent_list?.find((x) => x.name == listing.crosspost_parent);

			return crosspost;
		};
	})();
</script>

<div class="mt-2 flex flex-col rounded-md [&_p]:cursor-auto">
	<ListingHeader
		flaired
		class="pb-0.5"
		{listing}
		crossposted_from={getCrosspost()?.subreddit_name_prefixed}
	/>

	{#if !!listing.removed_by || !!listing.removed_by_category}
		<div class="my-2 flex items-center gap-2 rounded-md p-3">
			<CircleBackslash class="size-10 text-red-700" />
			<p class="text-lg">
				This post has been removed by {!!listing.removed_by_category
					? `a ${listing.removed_by_category}.`
					: `${listing.removed_by}.`}
			</p>
		</div>
	{:else if (listing.post_hint == 'link' || !(listing.domain.includes('redd') || listing.domain.includes('self.'))) && !getCrosspost() && !urlIsImage && !listing.url.includes('.gifv')}
		{@const { thumbnail, title, url } = listing}

		<Link {thumbnail} title={cleanText(title)} {url} />

		{#if listing.selftext?.length > 0}
			<Markdown text={listing.selftext} />
		{/if}
	{:else}
		<h1
			class={cn(
				'cursor-text text-wrap break-words text-2xl font-medium',
				getCrosspost()?.title == listing.title && 'line-clamp-1 text-ellipsis'
			)}
		>
			{cleanText(listing.title)}
		</h1>

		{#if listing.selftext?.length > 0}
			<Markdown class="mt-1.5" text={listing.selftext_html} />
		{/if}

		{#if listing.removed_by && listing.removed_by != 'deleted'}
			<p class="mt-1.5 text-zinc-300">
				[Removed by {listing.removed_by}]
			</p>
		{:else if getCrosspost()}
			<div class="mt-1.5">
				<ListingPortal class="rounded-lg border-2 p-1.5 px-2" listing={getCrosspost()!} />
			</div>
		{:else if listing.is_video}
			<Video class="mt-1.5" url={listing.url} mediaData={listing.secure_media?.reddit_video} />
		{:else if listing.url.includes('.gifv')}
			<Video class="mt-1.5" url={listing.url.replace('.gifv', '.mp4')} />
		{:else if listing.post_hint == 'image' || urlIsImage}
			<Image class="mt-1.5" url={listing.url} blur={listing.spoiler} />
		{:else if listing.is_gallery}
			<Gallery class="mt-1.5" post={listing} blur={listing.spoiler} />
		{:else if listing.post_hint == 'rich:video'}
			<div class="mt-1.5 flex items-center justify-center">
				<IFrame post={listing} />
			</div>
		{/if}
	{/if}

	<ListingFooter class="mt-1.5 [&_span]:cursor-text" {listing} />
</div>
