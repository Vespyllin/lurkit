<script lang="ts">
	import { page } from '$app/stores';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Comments, { assignCommentState } from '$lib/components/comments/';
	import { cleanText } from '$lib';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fetchListingComments } from '$lib/client';
	import { useQuery } from '@sveltestack/svelte-query';
	import { goto } from '$app/navigation';

	const {
		params: { subreddit, tag, title },
		url: { searchParams }
	} = $page;

	let listing: RedditT3Data | undefined = $state();
	let comments: CommentsProp[] = $state([]);

	const isValidSort = (sort: string | null): sort is RedditCommentSortOption => {
		const validSortOptions = ['best', 'top', 'new', 'controversial', 'hot', 'random', 'old'];
		return !!sort && validSortOptions.includes(sort);
	};

	const sortParam = searchParams.get('sort');
	let sort: RedditCommentSortOption = $state(isValidSort(sortParam) ? sortParam : 'best');

	const listingQuery = useQuery(`${subreddit}${tag}${title}`, () =>
		fetchListingComments(subreddit, tag, title, sort)
	);

	$effect(() => {
		if (!$listingQuery.data) return;
		if (!listing) listing = $listingQuery.data?.[0].data?.children?.[0].data;
		comments = assignCommentState($listingQuery.data[1]);
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

		<CommentSortDropdown
			{sort}
			onChange={(sortOption) => {
				if (sortOption == sort) return;
				sort = sortOption;
				goto(`${title}?sort=${sort}`);
				$listingQuery.refetch();
			}}
			class="mt-2"
		/>

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
