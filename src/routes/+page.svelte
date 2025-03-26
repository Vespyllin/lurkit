<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { fetchListings } from '$lib/client';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';
	import { untrack } from 'svelte';
	import type { Filter } from '$lib/db/filters';

	const lastFetchedListingIds = new Set<string>();

	const filtersQuery = useQuery('filters', async () => {
		const fetchData = await fetch('/api/filters');
		const filterContent = (await fetchData.json()) as Filter[];

		return filterContent;
	});

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(undefined, 50, pageParam, undefined, true);
		const subredditFilter = $filtersQuery.data?.[0].content;
		const titleFilter = $filtersQuery.data?.[1].content;

		if (!data || !data.data || !subredditFilter || !titleFilter) return;

		const filteredChildren = data.data.children
			?.filter((listing) => {
				if (lastFetchedListingIds.has(listing.data.name)) return false;

				const listingTitle = listing.data.title.toLowerCase();
				const subreddit = listing.data.sr_detail?.display_name_prefixed?.toLowerCase();

				const subredditBan = subreddit && subredditFilter.includes(subreddit);

				const titleBan = !titleFilter.every((title) => !listingTitle.toLowerCase().includes(title));
				if (subredditBan || titleBan) {
					let banReason = 'Banned ';

					if (subredditBan) banReason += 'Subreddit';
					if (subredditBan && titleBan) banReason += ' and ';
					if (titleBan) banReason += 'Keyword';

					console.log(`${banReason}:\n"${listingTitle} - ${subreddit}"`);
					return false;
				}

				const { crosspost_parent, crosspost_parent_list } = listing.data;
				const crosspost = crosspost_parent_list?.find((x) => x.name == crosspost_parent);
				if (!crosspost) return true;

				const crosspostSubreddit = crosspost.sr_detail?.display_name_prefixed.toLowerCase();
				const crossTitle = crosspost.title.toLowerCase();

				if (crosspostSubreddit && subredditFilter.includes(crosspostSubreddit)) return false;
				if (!titleFilter.every((title) => !crossTitle.toLowerCase().includes(title))) return false;

				return true;
			})
			.map((x) => {
				return { ...x, data: { ...x.data, pinned: false } };
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
		enabled: $filtersQuery.isFetched
	});

	$effect(() => {
		if ($filtersQuery.isFetched) {
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
		{($listingsQuery.isFetching && !$listingsQuery.data) || $filtersQuery.isFetching
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
		fetching={$listingsQuery.isFetching || $filtersQuery.isFetching}
		error={$listingsQuery.error as string | undefined}
	/>
{:else}
	<div class="mt-1 space-y-2">
		{#each $listingsQuery.data.pages as page}
			{#each page?.data?.children ?? [] as listing}
				<ListingPortal listing={listing.data} />
				<Separator />
			{/each}
		{/each}

		<FetchMoreStatus
			fetching={$listingsQuery.isFetching}
			error={$listingsQuery.error as string | undefined}
		/>
	</div>
{/if}
