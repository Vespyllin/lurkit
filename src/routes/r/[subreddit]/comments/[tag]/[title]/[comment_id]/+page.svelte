<script lang="ts">
	import { page } from '$app/stores';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import { validateCommentSort } from '$lib/components/comments/';
	import { cleanText } from '$lib';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fetchComment } from '$lib/client';
	import { useQuery } from '@sveltestack/svelte-query';
	import Comments from '$lib/components/comments/Comments.svelte';

	const {
		params: { subreddit, tag, comment_id }
	} = $page;

	let sort: RedditCommentSortOption = $state($page.url.searchParams.get('sort') as any);

	const queryUrl = `${subreddit}${tag}${comment_id}}`;
	const listingQuery = useQuery(queryUrl, () => fetchComment(subreddit, tag, comment_id, sort));

	let listing = $derived($listingQuery.data?.[0].data?.children?.[0].data);
	let comments = $derived($listingQuery.data?.[1]);

	$effect(() => {
		const newSort = validateCommentSort($page.url.searchParams.get('sort'));
		if (sort == newSort) return;
		sort = newSort;
		$listingQuery.refetch();
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
				{#if !comments?.data || !comments.data?.children?.length}
					<span class="text-2xl text-zinc-400">No comments to display...</span>
				{:else}
					<Comments fold={false} {comments} />
				{/if}
			</div>
		{/if}
	</div>
{/if}
