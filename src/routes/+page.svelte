<script lang="ts">
	import { fetchListings } from '$lib/client';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { subredditFilter, titleFilter } from '$lib/stores/filters';
	import { useInfiniteQuery } from '@sveltestack/svelte-query';

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(undefined, 50, pageParam, undefined, true);

		if (!data || !data.data) return undefined;

		const filteredChildren = data.data.children
			?.filter((listing) => {
				const subredditDisplayName = listing.data.sr_detail?.display_name_prefixed?.toLowerCase();
				return subredditDisplayName ? !subredditFilter.includes(subredditDisplayName) : true;
			})
			.filter((listing) => {
				return titleFilter.every((title) => !listing.data.title.toLowerCase().includes(title));
			});

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
