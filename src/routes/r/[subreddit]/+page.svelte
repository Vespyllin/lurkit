<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { fetchFeedData, fetchSubredditData } from '$lib/client/subreddit';

	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SubredditBanner from '$lib/components/subreddit/SubredditBanner.svelte';
	import SubredditSortDropdown from '$lib/components/subreddit/SubredditSortDropdown.svelte';

	const {
		params: { subreddit }
	} = $page;

	let subredditFetching = $state(true);
	let subredditError: string | undefined = $state();

	let listingFetching = $state(true);
	let listingError: string | undefined = $state();

	let fetching = $state(false);
	let error: string | undefined = $state();

	let sort: RedditSubredditSortOptions | undefined = $state();
	let subredditData: SubredditData | undefined = $state();
	let feed: ListingData[] | undefined = $state();
	let lastPostId: string | undefined;

	onMount(async () => {
		const subredditRes = await fetchSubredditData(subreddit);
		if (subredditRes.status == 'OK') {
			subredditData = subredditRes.data;
		} else {
			subredditError = subredditRes.reason;
		}
		subredditFetching = false;

		const feedRes = await fetchFeedData(subreddit, 50, undefined, sort, true);
		if (feedRes.status == 'OK') {
			feed = feedRes.data;
			console.log(feedRes.data);
			lastPostId = feedRes.data.at(-1)?.name;
		} else {
			listingError = feedRes.reason;
		}
		listingFetching = false;
	});

	$effect(() => {
		listingFetching = true;
		fetchFeedData(subreddit, 50, undefined, sort, true).then((res) => {
			if (res.status == 'OK') {
				feed = res.data;
				lastPostId = res.data.at(-1)?.name;
			} else {
				listingError = res.reason;
			}
			listingFetching = false;
		});
	});
</script>

<svelte:window
	onscroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;

		const scrolledPercentage = (window.scrollY / feedHeight) * 100;

		if (!!feed && !listingFetching && !subredditFetching && scrolledPercentage > 95) {
			fetching = true;

			const fetchedFeed = await fetchFeedData(subreddit, 100, lastPostId, undefined, true);

			if (fetchedFeed.status === 'OK') {
				feed = feed.concat(fetchedFeed.data);
				lastPostId = fetchedFeed.data.at(-1)?.name;
			} else {
				error = fetchedFeed.reason;
			}

			fetching = false;
		}
	}}
/>

<svelte:head>
	<title>
		{!!feed && !!subredditData
			? `r/${subredditData?.display_name}`
			: subredditError
				? subredditError
				: 'Loading...'}
	</title>
</svelte:head>

{#if subredditError || subredditFetching}
	<FetchStatus fetching={subredditFetching} error={subredditError} />
{:else}
	<SubredditBanner class="mb-2" subredditData={subredditData!} />

	<SubredditSortDropdown bind:sort />
	<Separator class="my-2 h-0.5" />

	{#if listingFetching || listingError}
		<FetchStatus fetching={listingFetching} error={listingError} />
	{:else}
		{#each feed ?? [] as post}
			<ListingPortal {post} />

			<Separator class="my-2" />
		{/each}
	{/if}

	{#if fetching || error}
		<FetchMoreStatus {fetching} {error} />
	{/if}
{/if}
