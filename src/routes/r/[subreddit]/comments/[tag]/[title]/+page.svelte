<script lang="ts">
	import { page } from '$app/stores';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';

	import { cleanText } from '$lib';
	import CommentSortDropdown from '$lib/components/comments/CommentSortDropdown.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { fetchListingComments } from '$lib/client';
	import { useQuery } from '@sveltestack/svelte-query';
	import Cw from '$lib/components/comments/CW.svelte';
	import { goto } from '$app/navigation';

	const {
		params: { subreddit, tag, title }
	} = $page;

	const validateSort = (sortString: string | null) => {
		const validSortOptions = [
			'confidence',
			'top',
			'new',
			'controversial',
			'old',
			'random',
			'qa',
			'blank'
		];

		const isValid = !!sortString && validSortOptions.includes(sortString);

		return isValid ? (sortString as RedditCommentSortOption) : 'blank';
	};

	let sort: RedditCommentSortOption = $state($page.url.searchParams.get('sort') as any);

	const listingQuery = useQuery([subreddit, tag, title], () =>
		fetchListingComments(subreddit, tag, title, sort)
	);

	let listing = $derived($listingQuery.data?.[0].data?.children?.[0].data);
	let comments = $derived($listingQuery.data?.[1]);

	$effect(() => {
		const newSort = validateSort($page.url.searchParams.get('sort'));
		if (sort == newSort) return;
		sort = newSort;
		$listingQuery.refetch();
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
			onChange={(sortOption) => goto(`${title}?sort=${sortOption}`)}
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
				<Cw {comments} />
			</div>
		{/if}
	</div>
{/if}
