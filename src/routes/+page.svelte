<script lang="ts">
	import { fetchFeedData } from '$lib/client/subreddit';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let fetching = $state(true);
	let feed: FeedData | undefined = $state();
	let error: string | undefined = $state();

	let lastPostId: string | undefined;
	$effect(() => {
		fetchFeedData(undefined, 100).then((data) => {
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

<svelte:head>
	<title>{feed ? 'Lurkit' : error}</title>
</svelte:head>

<svelte:window
	on:scroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;

		if (!!feed && !fetching && feedHeight < window.scrollY + 750) {
			fetching = true;

			// TODO: Retry policy
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
	<div class="mx-auto items-center justify-center p-32 lg:max-w-5xl">
		{#if fetching}
			<h1 class="text-center text-3xl">LOADING</h1>
		{:else}
			<h1 class="text-center text-3xl">Could not reach Reddit servers</h1>
			<h2 class="text-center text-xl">{error}</h2>
		{/if}
	</div>
{:else}
	{#each feed.posts ?? [] as post}
		<Listing {post} />
		<Separator class="my-4" />
	{/each}

	{#if error || fetching}
		<div class="mx-auto p-8 text-center lg:max-w-5xl">
			{#if error}
				<h1 class="text-3xl text-red-500">FAILED TO FETCH MORE POSTS {error}</h1>
			{:else if fetching}
				<h1 class="text-3xl text-green-500">LOADING MORE POSTS</h1>
			{/if}
		</div>
	{/if}
{/if}
