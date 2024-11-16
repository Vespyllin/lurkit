<script lang="ts">
	import { page } from '$app/stores';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Comments from '$lib/components/comments/';
	import { cleanText } from '$lib';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fetchListingComments } from '$lib/client';
	import { untrack } from 'svelte';
	import { useQuery } from '@sveltestack/svelte-query';

	const {
		params: { subreddit, tag, title }
	} = $page;

	let sort: RedditCommentSortOptions = $state('top');

	let listing: RedditT3Data | undefined = $state();
	let comments: RedditListing<RedditT1DataWrapper> | undefined = $state();

	const queryUrl = `/r/${subreddit}/comments/${tag}/${title}/`;
	const listingQuery = useQuery(queryUrl, async () => {
		const data = await fetchListingComments(queryUrl, sort);
		if (!listing) listing = data?.[0].data?.children?.[0].data;
		comments = data[1];
		comments?.data?.children?.pop();

		return data;
	});

	$effect(() => {
		void sort;

		untrack(() => {
			$listingQuery.refetch();
		});
	});
</script>

<svelte:head>
	<title>
		{$listingQuery.isFetching && !listing
			? 'Loading...'
			: ($listingQuery.error ??
				cleanText(`${listing?.title} - ${listing?.subreddit_name_prefixed}`))}
	</title>
</svelte:head>

{#if !listing}
	<FetchStatus
		fetching={$listingQuery.isFetching}
		error={$listingQuery.error as string | undefined}
	/>
{:else}
	<div class="flex flex-col px-2">
		<Listing {listing} />

		<CommentSortDropdown class="mt-2" bind:sort />

		<Separator class="mt-2" />

		{#if $listingQuery.isFetching}
			<FetchStatus
				fetching={$listingQuery.isFetching}
				error={$listingQuery.error as string | undefined}
			/>
		{:else}
			<div class="mt-3 space-y-4 pb-3">
				{#if !comments?.data?.children || comments.data.children.length == 0}
					<span class="text-2xl text-zinc-400">No comments to display...</span>
				{:else}
					{#each comments.data.children as _, idx}
						<Comments bind:comment={comments.data.children[idx]} />
					{/each}
				{/if}
			</div>
		{/if}
	</div>
{/if}
