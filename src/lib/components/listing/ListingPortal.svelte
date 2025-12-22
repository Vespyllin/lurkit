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

	// svelte-ignore state_referenced_locally
	const urlIsImage = listing.url.match(/(png|jpg|jpeg|gif|bmp|svg|webp)$/);
	// svelte-ignore state_referenced_locally
	const crosspost = listing.crosspost_parent_list?.find((x) => x.name == listing.crosspost_parent);
</script>

<div
	class={cn('cursor-default rounded-md p-2 hover:bg-[hsl(0,2,7)] [&_a]:cursor-pointer', classList)}
>
	<a href={listing.permalink} draggable="false">
		<ListingHeader
			class="pb-0.5"
			crossposted_from={crosspost?.subreddit_name_prefixed}
			{listing}
			flaired={inSubreddit}
		/>
	</a>

	{#if listing.post_hint == 'link' && !crosspost && !urlIsImage && !listing.url.includes('.gifv')}
		{@const { thumbnail, title, url } = listing}

		<a href={listing.permalink} draggable="false">
			<Link class="pointer-events-none" {thumbnail} title={cleanText(title)} {url} clamp />
		</a>
	{:else}
		<a href={listing.permalink} draggable="false">
			<h1
				class={cn(
					'text-wrap break-words text-2xl font-medium',
					crosspost?.title == listing.title && 'line-clamp-1 text-ellipsis'
				)}
			>
				{cleanText(listing.title)}
			</h1>
		</a>

		{#if crosspost}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="pt-1.5">
				<Self class="rounded-lg border-2 p-1.5 px-2" listing={crosspost} />
			</div>
		{:else if listing.is_video}
			<Video class="pt-1.5" url={listing.url} mediaData={listing.secure_media?.reddit_video} />
		{:else if listing.url.includes('.gifv')}
			<Video class="pt-1.5" url={listing.url.replace('.gifv', '.mp4')} />
		{:else if listing.post_hint == 'image' || urlIsImage}
			<Image class="pt-1.5" url={listing.url} blur={listing.spoiler} />
		{:else if listing.is_gallery}
			<Gallery class="pt-1.5" post={listing} blur={listing.spoiler} />
		{:else if listing.post_hint == 'rich:video'}
			<div class="flex items-center justify-center pt-1.5">
				<IFrame post={listing} />
			</div>
		{:else if listing.selftext?.length > 0}
			<a
				href={listing.permalink}
				class=" [&_*]:pointer-events-none"
				data-sveltekit-preload-data="off"
				draggable="false"
			>
				<Markdown class="pt-1.5" crop text={listing.selftext_html} />
			</a>
		{/if}
	{/if}

	<a href={listing.permalink} draggable="false">
		<ListingFooter class="pt-1.5" {listing} />
	</a>
</div>
