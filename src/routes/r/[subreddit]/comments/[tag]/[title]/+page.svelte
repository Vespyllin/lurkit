<script lang="ts">
	import ListingHeader from '$lib/components/listing/ListingHeader.svelte';
	import ListingFooter from '$lib/components/listing/ListingFooter.svelte';
	import CommentChain from '$lib/components/comments/CommentChain.svelte';
	import Post from '$lib/components/post/Post.svelte';

	let { data }: { data: ResultWrapper<PostData> } = $props();

	const getIcon = (post: Listing) => {
		const community_icon_src = post?.subreddit?.community_icon;
		return community_icon_src
			? community_icon_src.substring(0, community_icon_src.indexOf('?'))
			: post.subreddit.icon_img;
	};
</script>

{#if data.status == 'FAIL' || data.status == 'INTERNAL'}
	<div class="mx-auto w-full items-center justify-center space-y-2 p-32 lg:max-w-5xl">
		<div class="flex flex-col">
			<h1 class="text-center text-3xl">Could not reach Reddit servers.</h1>
			<h2 class="text-center text-xl">{data.reason}</h2>
		</div>
	</div>
{:else if data.status == 'OK'}
	{@const { listing: post, comments } = data.data}

	<div class="mx-auto w-full space-y-2 p-2 lg:max-w-5xl">
		<div class="flex w-full flex-col gap-2 rounded-2xl bg-zinc-900 p-4 px-6">
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
