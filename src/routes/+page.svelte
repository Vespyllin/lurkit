<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LightningBolt } from 'radix-icons-svelte';

	import { getContext, untrack } from 'svelte';
	import { useInfiniteQuery, type UseQueryStoreResult } from '@sveltestack/svelte-query';
	import { PUBLIC_UPVOTE_CUTOFF } from '$env/static/public';

	import ImageListingSkeleton from '$lib/components/layout/ImageListingSkeleton.svelte';

	import { fetchListings } from '$lib/client';
	import type { Filter } from '$lib/db/filters';

	const UPVOTE_CUTOFF = parseInt(PUBLIC_UPVOTE_CUTOFF) || Infinity;
	const lastFetchedListingIds = new Set<string>();

	const filterContext: UseQueryStoreResult<Filter[], unknown, Filter[], 'filters'> | null =
		getContext('filters');

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(undefined, 50, pageParam, undefined, true);
		const subredditFilter = $filterContext?.data?.find((x) => x.type == 'subreddit')?.content;
		const titleFilter = $filterContext?.data?.find((x) => x.type == 'keyword')?.content;

		if (!data || !data.data || !subredditFilter || !titleFilter) return;

		const filteredChildren = data.data.children
			?.filter((listing) => {
				if (lastFetchedListingIds.has(listing.data.name)) return false;

				if (listing.data.score >= UPVOTE_CUTOFF && listing.data.upvote_ratio >= 0.9) return false;

				const listingTitle = listing.data.title.toLowerCase();
				const subreddit = listing.data.sr_detail?.display_name_prefixed?.toLowerCase();

				const subredditBan = subreddit && subredditFilter.includes(subreddit);
				const titleBan = !titleFilter.every((title) => !listingTitle.toLowerCase().includes(title));
				if (subredditBan || titleBan) return false;

				const { crosspost_parent, crosspost_parent_list } = listing.data;
				const crosspost = crosspost_parent_list?.find((x) => x.name == crosspost_parent);
				if (!crosspost) return true;

				if (crosspost.score >= UPVOTE_CUTOFF && crosspost.upvote_ratio >= 0.9) return false;

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
		getNextPageParam: (lastGroup) =>
			lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name,
		enabled: $filterContext?.isFetched ?? false
	});

	$effect(() => {
		if ($filterContext?.isFetched ?? false) {
			untrack(() => {
				listingsQuery.setOptions('r/all', fetchNextListings, {
					getNextPageParam: (lastGroup) =>
						lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name,
					enabled: true
				});
			});
		}
	});
</script>

<svelte:head>
	<title>
		{($listingsQuery.isFetching && !$listingsQuery.data) || ($filterContext?.isFetching ?? true)
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
	{#if $listingsQuery.isFetching || ($filterContext?.isFetching ?? true)}
		<ImageListingSkeleton />
	{:else}
		<FetchStatus fetching={false} error={$listingsQuery.error as string | undefined} />
	{/if}
{:else}
	<div class="mt-1 space-y-2">
		{#each $listingsQuery.data.pages as page}
			{#each page?.data?.children ?? [] as listing}
				<ListingPortal listing={listing.data} />
				<Separator />
			{/each}
		{/each}

		{#if $listingsQuery.isFetching || !!$listingsQuery.error}
			<FetchMoreStatus
				fetching={$listingsQuery.isFetching}
				error={$listingsQuery.error as string | undefined}
				retryFn={$listingsQuery.fetchNextPage}
			/>
		{:else if !$listingsQuery.hasNextPage && !$listingsQuery.isFetching && !$listingsQuery.isError}
			<div class="mx-auto h-20 justify-center py-2 text-center">
				<Button
					class="h-12 rounded-full bg-primary text-lg hover:bg-primary/90"
					onclick={() => $listingsQuery.refetch()}
				>
					<LightningBolt size={25} /> Load more
				</Button>
			</div>
		{/if}
	</div>
{/if}
