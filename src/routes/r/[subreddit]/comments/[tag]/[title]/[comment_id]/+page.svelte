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
	import { afterNavigate, goto } from '$app/navigation';
	import { ArrowLeft, ArrowUp } from 'lucide-svelte';

	const {
		params: { subreddit, tag, comment_id }
	} = $page;

	const sortParam = validateCommentSort($page.url.searchParams.get('sort'));
	let sort: RedditCommentSortOption | undefined = $state(sortParam);

	const listingQuery = useQuery([subreddit, tag, comment_id, sortParam], () =>
		fetchComment(subreddit, tag, comment_id, sortParam)
	);

	let listing = $derived($listingQuery.data?.[0].data?.children?.[0].data);
	let comments = $derived($listingQuery.data?.[1]);
	afterNavigate((e) => {
		if (!e.from || !e.from.url) return;

		const newSort = validateCommentSort($page.url.searchParams.get('sort'));

		sort = newSort;

		listingQuery.setOptions({
			queryKey: [subreddit, tag, comment_id, newSort],
			queryFn: () => fetchComment(subreddit, tag, comment_id, newSort)
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
	{@const parent = comments?.data?.children?.[0].data.parent_id.split('_')[1]}
	<div class="flex flex-col px-2">
		<Listing {listing} />

		<div class="mt-2 flex items-center gap-2">
			<CommentSortDropdown
				{sort}
				onChange={(sortOption) =>
					goto(!sortOption ? comment_id : `${comment_id}?sort=${sortOption}`)}
				class="mr-auto"
			/>
			{#if parent}
				<a data-sveltekit-reload class="flex text-zinc-400 hover:text-inherit" href={parent}>
					<ArrowUp /> Up one comment
				</a>
			{/if}
			<a class="flex text-zinc-400 hover:text-inherit" href={listing.permalink}
				><ArrowLeft /> Back to post</a
			>
		</div>

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
					<Comments shelve={false} {comments} />
				{/if}
			</div>
		{/if}
	</div>
{/if}
