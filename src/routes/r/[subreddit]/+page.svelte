<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { fetchFeedData, fetchSubredditData } from '$lib/client/subreddit';

	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SubredditBanner from '$lib/components/subreddit/SubredditBanner.svelte';

	const {
		params: { subreddit }
	} = $page;

	let fetching = $state(true);
	let subredditData: SubredditData | undefined = $state();
	let feed: ListingData[] | undefined = $state();
	let error: string | undefined = $state();
	let lastPostId: string | undefined;

	onMount(() => {
		fetchSubredditData(subreddit).then((res) => {
			if (res.status == 'OK') {
				subredditData = res.data;
			} else {
				error = res.reason;
			}
			fetching = false;
		});

		fetchFeedData(subreddit, 50, undefined, undefined, true).then((res) => {
			if (res.status == 'OK') {
				feed = res.data;
				lastPostId = res.data.at(-1)?.name;
			} else {
				error = res.reason;
			}
			fetching = false;
		});
	});
</script>

<svelte:window
	on:scroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;

		const scrolledPercentage = (window.scrollY / feedHeight) * 100;

		if (!!feed && !fetching && scrolledPercentage > 95) {
			fetching = true;

			const fetchedFeed = await fetchFeedData(subreddit, 100, lastPostId);

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
		{!!feed && !!subredditData ? `r/${subredditData?.display_name}` : error ? error : 'Loading...'}
	</title>
</svelte:head>

{#if error}
	<FetchStatus {fetching} {error} />
{:else}
	{#if subredditData}
		<SubredditBanner {subredditData} />
	{/if}
	{#each feed ?? [] as post}
		<ListingPortal {post} />

		<Separator class="my-2" />
	{/each}

	{#if error || fetching}
		<FetchMoreStatus {fetching} {error} />
	{/if}
{/if}
