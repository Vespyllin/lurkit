<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	import { getContext, untrack } from 'svelte';
	import { useInfiniteQuery, type UseQueryStoreResult } from '@sveltestack/svelte-query';

	import ImageListingSkeleton from '$lib/components/layout/ImageListingSkeleton.svelte';

	import { fetchListings } from '$lib/client';
	import type { Filter } from '$lib/db/filters';

	const lastFetchedListingIds = new Set<string>();

	const filterContext: UseQueryStoreResult<Filter[], unknown, Filter[], 'filters'> | null =
		getContext('filters');

	const filterListing = (
		listing: RedditT3Data,
		subredditFilter: string[],
		titleFilter: string[]
	) => {
		const rawContents = JSON.stringify(listing).toLowerCase();

		if (lastFetchedListingIds.has(listing.name)) return false;

		// if (listing.data.score >= UPVOTE_CUTOFF && listing.data.upvote_ratio >= 0.9) return false;

		const title = listing.title.toLowerCase();
		const subreddit = listing.sr_detail?.display_name_prefixed?.toLowerCase();
		const author = listing.author;

		const botOrLowIQ = /([-_].*\d{4}$|^[A-Z][a-z]*[A-Z][a-z]*.*\d{4}$)/.test(author);
		if (botOrLowIQ) {
			console.log(`Bot or low IQ author: ${title} - ${subreddit} by ${author}`);
			return false;
		}

		const subredditBan = subreddit && subredditFilter.includes(subreddit);
		const titleBan = !titleFilter.every((keyword) => !title.toLowerCase().includes(keyword));
		if (subredditBan || titleBan) {
			console.log(`Blacklist: ${title} - ${subreddit}`);
			return false;
		}

		if (
			rawContents.includes('india') ||
			rawContents.includes('anime') ||
			rawContents.includes('pizzacakecomic')
		) {
			console.log(`India/Anime: ${title} - ${subreddit}`);
			return false;
		}

		const { crosspost_parent, crosspost_parent_list } = listing;
		const crosspost = crosspost_parent_list?.find((x) => x.name == crosspost_parent);

		if (crosspost) return filterListing(crosspost, subredditFilter, titleFilter);

		return true;
	};

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(undefined, 50, pageParam, undefined, true);
		const subredditFilter = $filterContext?.data?.find((x) => x.type == 'subreddit')?.content;
		const titleFilter = $filterContext?.data?.find((x) => x.type == 'keyword')?.content;

		if (!data || !data.data || !subredditFilter || !titleFilter) return;

		const filteredChildren = data.data.children
			?.filter((listing) => filterListing(listing.data, subredditFilter, titleFilter))
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
		{/if}
	</div>
{/if}
