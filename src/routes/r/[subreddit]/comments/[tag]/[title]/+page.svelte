<script lang="ts">
	import ListingBody from '$lib/components/listing/ListingBody.svelte';
	import ListingFooter from '$lib/components/listing/ListingFooter.svelte';
	import ListingHeader from '$lib/components/listing/ListingHeader.svelte';
	import CommentChain from '$lib/components/comments/CommentChain.svelte';

	let { data }: { data: PostData; reason: string | undefined } = $props();
	const post = data.listing;
</script>

<div class="mx-auto w-full space-y-2 p-2 lg:max-w-5xl">
	<div class="flex w-full flex-col gap-2 rounded-2xl bg-zinc-900 p-4 px-6">
		<ListingHeader
			author={post.author}
			created_utc={post.created_utc}
			subreddit_icon={post.subreddit.icon_img}
			subreddit_name={post.subreddit.display_name}
		/>
		<ListingBody {post} />
		<ListingFooter
			score={post.score}
			num_comments={post.num_comments}
			upvote_ratio={post.upvote_ratio}
		/>
	</div>

	<div class="text-xl font-semibold">Sort by:</div>
	<CommentChain comments={data.comments} root />
</div>
