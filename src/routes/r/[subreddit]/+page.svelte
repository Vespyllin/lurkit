<script lang="ts">
	import { page } from '$app/stores';
	import { fetchFeedData } from '$lib/client/subreddit';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const {
		params: { subreddit }
	} = $page;

	let fetching = $state(true);
	let feed: ListingData[] | undefined = $state();
	let error: string | undefined = $state();

	let lastPostId: string | undefined;
	$effect(() => {
		fetchFeedData(subreddit, 50).then((res) => {
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
				const x = fetchedFeed.data;
				feed = feed.concat(fetchedFeed.data);
				lastPostId = fetchedFeed.data.at(-1)?.name;
			} else {
				error = fetchedFeed.reason;
				console.log(`FAILED TO FETCH NEXT BATCH\nLast post ID: ${lastPostId}\nReason: ${error}`);
			}

			fetching = false;
		}
	}}
/>

<svelte:head>
	<title>{!!feed ? `r/${subreddit}` : error}</title>
</svelte:head>

{#if !feed}
	<FetchStatus {fetching} {error} />
{:else}
	{#each feed as post}
		<a href={post.permalink}>
			<Listing {post} />
		</a>
		<Separator class="my-4" />
	{/each}

	{#if error || fetching}
		<FetchMoreStatus {fetching} {error} />
	{/if}
{/if}
