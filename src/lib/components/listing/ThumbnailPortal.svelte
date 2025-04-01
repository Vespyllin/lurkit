<script lang="ts">
	import { cleanText } from '$lib';
	import ListingFooter from '$lib/components/listing/ListingFooter.svelte';
	import ListingHeader from '$lib/components/listing/ListingHeader.svelte';

	const { listing }: { listing: RedditT3Data } = $props();
</script>

<div class="h-fit rounded-md p-2 hover:bg-[hsl(0,2,7)] [&_*]:cursor-pointer">
	<a class="flex" href={listing.permalink}>
		<div>
			<ListingHeader
				class="inline-flex w-fit"
				edited={listing.edited}
				locked={listing.locked}
				author={listing.author}
				created_utc={listing.created_utc}
				over_18={listing.over_18}
				subreddit={listing.sr_detail}
				stickied={listing.stickied}
				distinguished={listing.distinguished}
			/>

			<h1 class="line-clamp-1 cursor-text text-wrap break-words text-2xl font-medium">
				{cleanText(listing.title)}
			</h1>

			<ListingFooter plain {listing} class="mt-2" />
		</div>
		<img
			src={listing.thumbnail}
			alt=""
			class="my-auto ml-auto h-full max-h-20 max-w-20 rounded-md"
		/>
	</a>
</div>
