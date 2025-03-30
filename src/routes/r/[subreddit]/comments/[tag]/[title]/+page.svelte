<script lang="ts">
	import { page } from '$app/stores';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';

	import { cleanText } from '$lib';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fetchListingComments } from '$lib/client';
	import { useQuery } from '@sveltestack/svelte-query';
	import { afterNavigate, goto } from '$app/navigation';
	import Comments from '$lib/components/comments/Comments.svelte';
	import { validateCommentSort } from '$lib/components/comments';

	const {
		params: { subreddit, tag, title }
	} = $page;

	const sortParam = validateCommentSort($page.url.searchParams.get('sort'));
	let sort: RedditCommentSortOption | undefined = $state(sortParam);

	const listingQuery = useQuery([subreddit, tag, title, sortParam], () =>
		fetchListingComments(subreddit, tag, title, sortParam)
	);

	let listing = $derived($listingQuery.data?.[0].data?.children?.[0].data);
	let comments = $derived($listingQuery.data?.[1]);

	afterNavigate((e) => {
		if (!e.from || !e.from.url) return;

		const newSort = validateCommentSort($page.url.searchParams.get('sort'));

		sort = newSort;

		listingQuery.setOptions({
			queryKey: [subreddit, tag, title, newSort],
			queryFn: () => fetchListingComments(subreddit, tag, title, newSort)
		});
	});
</script>

<svelte:head>
	<title>
		{$listingQuery.isFetching && !listing
			? 'Loading...'
			: !listing
				? $listingQuery.error
				: cleanText(`${listing.title} - ${listing.subreddit_name_prefixed}`)}
	</title>
</svelte:head>

{#if !listing || !comments}
	<FetchStatus
		fetching={$listingQuery.isFetching}
		error={$listingQuery.error as string | undefined}
	/>
{:else}
	<div class="flex flex-col px-2">
		<Listing {listing} />
		<CommentSortDropdown
			{sort}
			onChange={(sortOption) => goto(!sortOption ? `${title}` : `${title}?sort=${sortOption}`)}
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
				<Comments {comments} />
			</div>
		{/if}
	</div>
{/if}
