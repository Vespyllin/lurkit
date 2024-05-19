<script lang="ts">
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';
	import CommentChain from '$lib/components/CommentChain.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Listing from '$lib/components/Listing.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import SortDropdown from '$lib/components/CommentSortDropdown.svelte';

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

		<SortDropdown class="mt-4" bind:sort />
		<Separator class="my-2" />

		{#if fetching}
			<FetchStatus {fetching} {error} />
		{:else}
			<CommentChain {comments} root />
		{/if}
	</div>
{/if}
