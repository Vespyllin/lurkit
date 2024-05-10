<script lang="ts">
	import { page } from '$app/stores';
	import { fetchFeedData } from '$lib/client/subreddit';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/Listing.svelte';
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

	$effect(() => {
		const scrollContainer = document.getElementById('scroll-container');
		if (!scrollContainer) return console.log('NO CONTAINER FOUND');

		scrollContainer.onscroll = async () => {
			const contentHeight = scrollContainer.scrollHeight;
			const visibleHeight = scrollContainer.clientHeight;
			const scrollTop = scrollContainer.scrollTop;
			const scrolledPercentage = (scrollTop / (contentHeight - visibleHeight)) * 100;

			if (!!feed && !fetching && scrolledPercentage > 95) {
				fetching = true;

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
		};
	});
</script>

<svelte:head>
	<title>{!!feed ? `r/${subreddit}` : error}</title>
</svelte:head>

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
