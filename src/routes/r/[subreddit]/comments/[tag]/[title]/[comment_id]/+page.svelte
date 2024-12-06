<script lang="ts">
	import { page } from '$app/stores';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Comments, { assignCommentState } from '$lib/components/comments/';
	import { cleanText } from '$lib';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fetchComment } from '$lib/client';
	import { untrack } from 'svelte';
	import { useQuery } from '@sveltestack/svelte-query';

	const {
		params: { subreddit, tag, comment_id }
	} = $page;

	let sort: RedditCommentSortOptions = $state('top');

	let listing: RedditT3Data | undefined = $state();
	let comments: CommentsProp[] = $state([]);

	const queryUrl = `${subreddit}${tag}${comment_id}`;
	const listingQuery = useQuery(queryUrl, async () => {
		const data = await fetchComment(subreddit, tag, comment_id, sort);
		if (!listing) listing = data?.[0].data?.children?.[0].data;
		comments = assignCommentState(data[1]);

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
			<div class="mt-1 space-y-4 pb-3">
				{#if !comments.length}
					<span class="text-2xl text-zinc-400">No comments to display...</span>
				{:else}
					<Comments bind:comments />
				{/if}
			</div>
		{/if}
	</div>
{/if}
