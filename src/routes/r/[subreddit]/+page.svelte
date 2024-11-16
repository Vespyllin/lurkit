<script lang="ts">
	import { untrack } from 'svelte';
	import { page } from '$app/stores';

	import { fetchListings, fetchSubreddit } from '$lib/client';
	import { subredditFilter, titleFilter } from '$lib/stores/filters';

	import { useInfiniteQuery, useQuery, useQueryClient } from '@sveltestack/svelte-query';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import SubredditBanner from '$lib/components/subreddit/SubredditBanner.svelte';
	import SubredditSortDropdown from '$lib/components/subreddit/SubredditSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const {
		params: { subreddit }
	} = $page;

	let sort: RedditSubredditSortOptions | undefined = $state();

	const subredditQuery = useQuery(`r/${subreddit}`, () => fetchSubreddit(subreddit));

	const fetchNextListings = async ({ pageParam }: { pageParam?: string }) => {
		const data = await fetchListings(subreddit, 50, pageParam, sort, true);

		if (!data || !data.data) return undefined;

		const filteredChildren = data.data.children
			?.filter((listing) => {
				const subredditDisplayName = listing.data.sr_detail?.display_name?.toLowerCase();
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

	const listingsQuery = useInfiniteQuery(`r/${subreddit}/listings`, fetchNextListings, {
		getNextPageParam: (lastGroup) => lastGroup?.data?.children?.at(-1)?.data.name
	});

	$effect(() => {
		void sort;

		untrack(() => {
			useQueryClient().setQueryData(`r/${subreddit}/listings`, (data) => {
				return { pages: undefined, pageParams: undefined };
			});
			$listingsQuery.fetchNextPage();
		});
	});
</script>

<svelte:head>
	<title>
		{$listingsQuery.isFetching || $subredditQuery.isFetching
			? 'Loading...'
			: ($subredditQuery.error ??
				$listingsQuery.error ??
				'r/' + $subredditQuery?.data?.data.display_name_prefixed)}
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

{#if !$subredditQuery.data || !$listingsQuery.data}
	<FetchStatus
		fetching={$listingsQuery.isFetching || $subredditQuery.isFetching}
		error={($subredditQuery.error ?? $listingsQuery.error) as string | undefined}
	/>
{:else}
	<div class="space-y-2">
		<SubredditBanner data={$subredditQuery.data.data} />

		<SubredditSortDropdown bind:sort />
		<Separator class="h-0.5" />

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
