<script lang="ts">
	import { page } from '$app/stores';
	import { fetchFeedData } from '$lib/client/subreddit';
	import Feed from '$lib/components/Feed.svelte';

	let { data }: { data: ResultWrapper<FeedData> } = $props();

	const { params } = $page;
	const { subreddit } = params;

	let fetching = $state(false);
	let failed = $state(false);
	let feed: FeedData | undefined = $state();
	$effect(() => {
		if (data.status == 'OK') {
			feed = data.data;
		}
	});
</script>

<svelte:window
	on:scroll={async () => {
		// maybe not nessesary anymore
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const scrolledY = window.scrollY;

		if (data.status === 'OK' && !!feed && !fetching && feedHeight < scrolledY + 750) {
			fetching = true;

			const lastPostID = data.data.posts.at(-1)?.name;

			// TODO: Retry policy

			const fetchedFeed = await fetchFeedData(subreddit, 100, lastPostID);
			if (fetchedFeed.status === 'OK') {
				feed.after = fetchedFeed.data.after;
				feed.dist += fetchedFeed.data.dist;
				feed.posts = feed.posts.concat(fetchedFeed.data.posts);
			} else {
				console.log('FAILED TO FETCH NEXT BATCH\nLAST ID:', lastPostID);
				failed = true;
			}

			fetching = false;
		}
	}}
/>

<svelte:head>
	<title>{data.status == 'OK' ? `r/${subreddit}` : data.reason}</title>
</svelte:head>

{#if data.status == 'FAIL' || data.status == 'INTERNAL'}
	<div class="mx-auto w-full items-center justify-center p-32 lg:max-w-5xl">
		<h1 class="text-center text-3xl">Could not reach Reddit servers</h1>
		<h2 class="text-center text-xl">{data.reason}</h2>
	</div>
{:else if data.status == 'OK' && !!feed}
	<Feed {feed} />
	{#if failed}
		<div class="text-3xl">FAILED</div>
	{/if}
{/if}
