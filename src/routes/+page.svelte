<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { subredditFilter, titleFilter } from '$lib/stores/filters';
	import { fetchListings } from '$lib/client';
	import { useInfiniteQuery } from '@sveltestack/svelte-query';

	const lastFetchedListingIds = new Set<string>();

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(undefined, 50, pageParam, undefined, true);

		if (!data || !data.data) return undefined;

		const filteredChildren = data.data.children?.filter((listing) => {
			if (lastFetchedListingIds.has(listing.data.name)) return false;

			const listingTitle = listing.data.title.toLowerCase();
			const subreddit = listing.data.sr_detail?.display_name_prefixed?.toLowerCase();

			if (subreddit && subredditFilter.includes(subreddit)) return false;
			if (!titleFilter.every((title) => !listingTitle.toLowerCase().includes(title))) return false;

			const { crosspost_parent, crosspost_parent_list } = listing.data;
			const crosspost = crosspost_parent_list?.find((x) => x.name == crosspost_parent);
			if (!crosspost) return true;

			const crosspostSubreddit = crosspost.sr_detail?.display_name_prefixed.toLowerCase();
			const crossTitle = crosspost.title.toLowerCase();

			if (crosspostSubreddit && subredditFilter.includes(crosspostSubreddit)) return false;
			if (!titleFilter.every((title) => !crossTitle.toLowerCase().includes(title))) return false;

			return true;
		});

		lastFetchedListingIds.clear();
		filteredChildren?.forEach((x) => lastFetchedListingIds.add(x.data.name));

		const filteredData: RedditListing<RedditT3DataWrapper> = {
			kind: data.kind,
			data: {
				...data.data,
				children: filteredChildren
			}
		};

		return filteredData;
	};

	const listingsQuery = useInfiniteQuery('r/all', fetchNextListings, {
		getNextPageParam: (lastGroup) => lastGroup?.data?.children?.at(-1)?.data.name
	});
</script>

<svelte:head>
	<title>
		{$listingsQuery.isFetching && !$listingsQuery.data
			? 'Loading...'
			: ($listingsQuery.error ?? 'Lurkit')}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		const { hasNextPage, isFetching, isError } = $listingsQuery;
		if (remainingPx < 1000 && hasNextPage && !isFetching && !isError) {
			$listingsQuery.fetchNextPage();
		}
	}}
/>

{#if !$listingsQuery.data}
	<FetchStatus
		fetching={$listingsQuery.isFetching}
		error={$listingsQuery.error as string | undefined}
	/>
{:else}
	<div class="space-y-2">
		{#each $listingsQuery.data?.pages ?? [] as page}
			{#each page?.data?.children ?? [] as listing}
				<ListingPortal listing={listing.data} />
				<Separator />
			{/each}
		{/each}
		{#if $listingsQuery.isError || $listingsQuery.isFetching}
			<FetchMoreStatus
				fetching={$listingsQuery.isFetching}
				error={$listingsQuery.error as string | undefined}
			/>
		{/if}
	</div>
{/if}
