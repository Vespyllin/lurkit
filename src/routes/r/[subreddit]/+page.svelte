<script lang="ts">
	import { page } from '$app/stores';
	import { fetchFeedData } from '$lib/client/subreddit';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const {
		params: { subreddit }
	} = $page;

	let fetching = $state(true);
	let feed: FeedData | undefined = $state();
	let error: string | undefined = $state();

	let lastPostId: string | undefined;
	$effect(() => {
		fetchFeedData(subreddit, 50).then((data) => {
			if (data.status == 'OK') {
				feed = data.data;
				lastPostId = data.data.posts.at(-1)?.name;
			} else {
				error = data.reason;
			}
			fetching = false;
		});
	});
</script>

<svelte:window
	on:scroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;

		if (!!feed && !fetching && feedHeight < window.scrollY + 750) {
			fetching = true;

			// TODO: Retry policy
			const fetchedFeed = await fetchFeedData(subreddit, 100, lastPostId);
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

<svelte:head>
	<title>{!!feed ? `r/${subreddit}` : error}</title>
</svelte:head>

{#if !feed && fetching}
	<div class="mx-auto items-center justify-center p-32 lg:max-w-5xl">
		<h1 class="text-center text-3xl">LOADING</h1>
	</div>
{:else if !feed}
	<div class="mx-auto items-center justify-center p-32 lg:max-w-5xl">
		<h1 class="text-center text-3xl">Could not reach Reddit servers</h1>
		<h2 class="text-center text-xl">{error}</h2>
	</div>
{:else}
	{#each feed.posts ?? [] as post}
		<Listing {post} />
		<Separator class="my-4" />
	{/each}
	{#if error}
		<h1 class="text-3xl text-red-500">FAILED TO FETCH MORE POSTS {error}</h1>
	{/if}
	{#if fetching}
		<h1 class="text--500 text-3xl">LOADING MORE POSTS</h1>
	{/if}
{/if}
