<script lang="ts">
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Comments from '$lib/components/comments/';

	const {
		params: { subreddit, tag, title }
	} = $page;

	let fetching = $state(true);
	let postData: PostData | undefined = $state();
	let error: string | undefined = $state();
	let sort: RedditSortOptions = $state('top');

	const getData = async (sort: RedditSortOptions) => {
		fetching = true;
		const fetchRes = await fetchPostData(`/r/${subreddit}/comments/${tag}/${title}/`, sort);

		if (fetchRes.status == 'OK') {
			if (!postData?.listing) postData = fetchRes.data;
			else postData.comments = fetchRes.data.comments; // Only update the comments if the listing is already populated (changing comment sort options)
		} else {
			error = fetchRes.reason;
		}
		fetching = false;
	};

	$effect(() => {
		getData(sort);
	});
</script>

<svelte:head>
	<title>
		{postData
			? `${postData.listing.title} - ${postData.listing.subreddit.display_name}`
			: error
				? error
				: 'Loading...'}
	</title>
</svelte:head>

{#if !postData}
	<FetchStatus {fetching} {error} />
{:else}
	{@const { listing: post, comments } = postData}

	<div class="flex flex-col">
		<Listing {post} expand />

		{#key comments}
			<Comments class="mt-4" bind:sort {comments} {error} {fetching} />
		{/key}
	</div>
{/if}
