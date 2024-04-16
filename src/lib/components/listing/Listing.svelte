<script lang="ts">
	import ListingBody from './ListingBody.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import ListingHeader from './ListingHeader.svelte';

	let { post }: { post: Listing } = $props();
</script>

<div class="flex flex-col gap-1">
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
		permalink={post.permalink}
		upvote_ratio={post.upvote_ratio}
	/>
</div>
