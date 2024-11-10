<script lang="ts">
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/listing/Listing.svelte';
	import Comments from '$lib/components/comments/';
	import { PUBLIC_COLLAPSE_COMMENT_DEPTH } from '$env/static/public';
	import { cleanText } from '$lib';

	const SHELVE_COMMENT_DEPTH = parseInt(PUBLIC_COLLAPSE_COMMENT_DEPTH);
	const shelveDepth = !isNaN(SHELVE_COMMENT_DEPTH) ? SHELVE_COMMENT_DEPTH : 1;

	const {
		params: { subreddit, tag, title }
	} = $page;

	let fetching = $state(true);
	let error: string | undefined = $state();
	let sort: RedditSortOptions = $state('top');
	let listing: ListingData | undefined = $state();
	let comments: CommentContentProps[] = $state([]);

	const getData = async (sort: RedditSortOptions) => {
		fetching = true;
		const fetchRes = await fetchPostData(`/r/${subreddit}/comments/${tag}/${title}/`, sort);

		if (fetchRes.status == 'OK') {
			if (!listing) listing = fetchRes.data.listing;
			comments = assignCommentState(fetchRes.data.comments);
		} else {
			error = fetchRes.reason;
		}
		fetching = false;
	};

	const assignCommentState = (
		comments: PostComment[],
		depth: number = 0
	): CommentContentProps[] => {
		return comments.map((comment, idx) => {
			const childrenWithState = comment.children?.length
				? assignCommentState(comment.children, depth + 1)
				: undefined;

			const subCommentCount =
				(comment.children?.length ?? 0) +
				(childrenWithState?.reduce((acc, v) => acc + v.replyCount, 0) ?? 0);

			return {
				...comment,
				depth: depth,
				collapsed: comment.stickied || (depth != 0 && idx > 2 && (comment.score ?? 10) < 10),
				children: childrenWithState,
				replyCount: subCommentCount,
				shelved: depth >= shelveDepth
			} as CommentContentProps;
		});
	};

	// Refetch data whenever the comment sort key is changed
	$effect(() => {
		getData(sort);
	});
</script>

<svelte:head>
	<title>
		{listing
			? cleanText(`${listing.title} - ${listing.subreddit.display_name}`)
			: error
				? error
				: 'Loading...'}
	</title>
</svelte:head>

{#if error || !listing}
	<FetchStatus {fetching} {error} />
{:else}
	<div class="flex flex-col px-2">
		<Listing post={listing} />

		<Comments class="mt-2" bind:sort bind:comments {error} {fetching} />
	</div>
{/if}
