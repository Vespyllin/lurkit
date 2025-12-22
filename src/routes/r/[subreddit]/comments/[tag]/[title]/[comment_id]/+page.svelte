<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate, goto } from '$app/navigation';

	import { ArrowLeft, ArrowUp } from 'lucide-svelte';
	import { useQuery } from '@sveltestack/svelte-query';

	import { cleanText } from '$lib';
	import { fetchComment } from '$lib/client';
	import { validateCommentSort } from '$lib/components/comments/';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Comments from '$lib/components/comments/Comments.svelte';

	const {
		params: { subreddit: _subreddit, tag: _tag, comment_id: _comment_id }
	} = page;

	const subreddit = _subreddit as string;
	const tag = _tag as string;
	const comment_id = _comment_id as string;

	const sortParam = validateCommentSort(page.url.searchParams.get('sort'));
	let sort: RedditCommentSortOption | undefined = $state(sortParam);

	const listingQuery = useQuery([subreddit, tag, comment_id, sortParam], () =>
		fetchComment(subreddit, tag, comment_id, sortParam)
	);

	const commentQuery = useQuery(
		[subreddit, tag, comment_id, 'comment', sortParam],
		() => fetchComment(subreddit, tag, comment_id, sortParam).then(([, c]) => c),
		{ enabled: false }
	);

	let listing = $listingQuery.data?.[0].data?.children?.[0].data;
	let comments = $commentQuery.data || $listingQuery.data?.[1];

	afterNavigate((e) => {
		if (!e.from || !e.from.url) return;

		const newSort = validateCommentSort(page.url.searchParams.get('sort'));
		sort = newSort;

		commentQuery.setOptions({
			queryKey: [subreddit, tag, comment_id, 'comment', newSort],
			queryFn: () => fetchComment(subreddit, tag, comment_id, newSort).then(([, c]) => c)
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
	{@const parent = comments?.data?.children?.[0].data.parent_id.split('t1_')[1]}
	<div class="flex flex-col px-2">
		<Listing {listing} />

		<div class="mt-2 flex items-center gap-2">
			<CommentSortDropdown
				{sort}
				onChange={(sortOption) =>
					goto(!sortOption ? comment_id : `${comment_id}?sort=${sortOption}`, {
						noScroll: true,
						keepFocus: true
					})}
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

		{#if $listingQuery.isFetching || $commentQuery.isFetching}
			<FetchStatus
				fetching={$listingQuery.isFetching || $commentQuery.isFetching}
				error={($listingQuery.error ?? $commentQuery.error) as string | undefined}
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
