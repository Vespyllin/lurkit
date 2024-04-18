<script lang="ts">
	import ListingBody from './ListingBody.svelte';
	import ListingFooter from './ListingFooter.svelte';
	import ListingHeader from './ListingHeader.svelte';

	let { post }: { post: Listing } = $props();
	const community_icon_src = post?.subreddit?.community_icon;
	const icon_url =
		community_icon_src?.substring(0, community_icon_src.indexOf('?')) ?? post.subreddit.icon_img;
</script>

<div class="flex flex-col gap-2">
	<ListingHeader
		author={post.author}
		created_utc={post.created_utc}
		subreddit_icon={icon_url}
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
