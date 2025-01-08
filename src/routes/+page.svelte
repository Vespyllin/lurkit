<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { titleFilter } from '$lib/filters';
	import { fetchListings } from '$lib/client';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';
	import { untrack } from 'svelte';

	const lastFetchedListingIds = new Set<string>();

	const subredditFilterQuery = useQuery('filters', async () => {
		const fetchData = await fetch('/api/filters');
		const filterContent = (await fetchData.json()).filter as string[];
		return filterContent;
	});

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(undefined, 50, pageParam, undefined, true);
		const subredditFilter = $subredditFilterQuery.data;

		if (!data || !data.data || !subredditFilter) return;

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
		getNextPageParam: (lastGroup) => lastGroup?.data?.after,
		enabled: $subredditFilterQuery.isFetched
	});

	$effect(() => {
		if ($subredditFilterQuery.isFetched) {
			untrack(() => {
				listingsQuery.setOptions('r/all', fetchNextListings, {
					getNextPageParam: (lastGroup) => lastGroup?.data?.after,
					enabled: true
				});
			});
		}
	});
</script>

<svelte:head>
	<title>
		{($listingsQuery.isFetching && !$listingsQuery.data) || $subredditFilterQuery.isFetching
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
		fetching={$listingsQuery.isFetching || $subredditFilterQuery.isFetching}
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
		{#if $listingsQuery.isError || $listingsQuery.isFetching || !$listingsQuery.hasNextPage}
			<FetchMoreStatus
				fetching={$listingsQuery.isFetching}
				error={!$listingsQuery.hasNextPage
					? 'Could not retrieve next page param.'
					: ($listingsQuery.error as string | undefined)}
			/>
		{/if}
	</div>
{/if}
