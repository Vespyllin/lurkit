<script lang="ts">
	import { fetchFeedData } from '$lib/client/subreddit';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Spinner from '$lib/components/layout/Spinner.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let fetching = $state(true);
	let feed: FeedData | undefined = $state();
	let error: string | undefined = $state();

	let lastPostId: string | undefined;
	const init = async () => {
		const data = await fetchFeedData(undefined, 50);
		if (data.status == 'OK') {
			feed = data.data;
			lastPostId = data.data.posts.at(-1)?.name;
		} else {
			error = data.reason;
		}
	};

	$effect(() => {
		fetching = true;
		try {
			init().then(() => (fetching = false));
		} catch (error) {
			error = 'Error making request';
			fetching = false;
		}
	});
</script>

<svelte:head>
	<title>{feed ? 'Lurkit' : error}</title>
</svelte:head>

<svelte:window
	on:scroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;

		if (!!feed && !fetching && feedHeight < window.scrollY + 750) {
			fetching = true;

			const fetchedFeed = await fetchFeedData(undefined, 100, lastPostId);
			if (fetchedFeed.status === 'OK') {
				feed.after = fetchedFeed.data.after;
				feed.dist += fetchedFeed.data.dist;
				feed.posts = feed.posts.concat(fetchedFeed.data.posts);
				lastPostId = fetchedFeed.data.posts.at(-1)?.name;
			} else {
				error = fetchedFeed.reason;
				console.log(`FAILED TO FETCH NEXT BATCH\nLast post ID: ${lastPostId}\nReason: ${error}`);
			}

			fetching = false;
		}
	}}
/>

{#if !feed}
	<FetchStatus {fetching} {error} />
{:else}
	{#each feed.posts ?? [] as post}
		<Listing {post} />
		<Separator class="my-4" />
	{/each}

	{#if error || fetching}
		<FetchMoreStatus {fetching} {error} />
	{/if}
{/if}
