<script lang="ts">
	import ListingHeader from '$lib/components/listing/ListingHeader.svelte';
	import ListingFooter from '$lib/components/listing/ListingFooter.svelte';
	import CommentChain from '$lib/components/post/CommentChain.svelte';
	import Post from '$lib/components/post/Post.svelte';
	import { page } from '$app/stores';
	import { fetchPostData } from '$lib/client/post';

	const {
		params: { subreddit, tag, title }
	} = $page;

	let fetching = $state(true);
	let postData: PostData | undefined = $state();
	let error: string | undefined = $state();

	$effect(() => {
		fetchPostData(`/r/${subreddit}/comments/${tag}/${title}/`, 'top').then((data) => {
			if (data.status == 'OK') {
				postData = data.data;
			} else {
				error = data.reason;
			}
			fetching = false;
		});
	});

	const getIcon = (post: Listing) => {
		const community_icon_src = post?.subreddit?.community_icon;
		return community_icon_src?.substring(0, community_icon_src?.indexOf('?'));
	};
</script>

<svelte:head>
	<title>{postData ? postData.listing.title : error}</title>
</svelte:head>

{#if !postData && fetching}
	<div class="mx-auto items-center justify-center p-32 lg:max-w-5xl">
		<h1 class="text-center text-3xl">LOADING</h1>
	</div>
{:else if !postData}
	<div class="mx-auto items-center justify-center space-y-2 p-32 lg:max-w-5xl">
		<div class="flex flex-col">
			<h1 class="text-center text-3xl">Could not reach Reddit servers.</h1>
			<h2 class="text-center text-xl">{error}</h2>
		</div>
	</div>
{:else}
	{@const { listing: post, comments } = postData}

	<div class="mx-auto space-y-2 p-2 lg:max-w-5xl">
		<div class="flex w-full flex-col gap-2 rounded-2xl pb-4">
			<ListingHeader
				author={post.author}
				created_utc={post.created_utc}
				subreddit_icon={getIcon(post)}
				subreddit_name={post.subreddit.display_name}
			/>
			<Post {post} />
			<ListingFooter
				score={post.score}
				num_comments={post.num_comments}
				upvote_ratio={post.upvote_ratio}
			/>
		</div>

		<div class="mt-4 text-xl font-semibold">Comments</div>
		<CommentChain {comments} root />
	</div>
{/if}
