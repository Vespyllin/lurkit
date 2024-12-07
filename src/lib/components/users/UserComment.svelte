<script lang="ts">
	import { cleanText, getTimeAgo } from '$lib';

	const { comment }: { comment: RedditT1Data } = $props();
</script>

{JSON.stringify(comment)}

<a href={comment.permalink}>
	<div class="space-y-1">
		{comment.subreddit_name_prefixed}
		<!-- {comment.created_utc} -->
		{comment.author}
		<!-- {comment.link_title} -->

		{getTimeAgo(comment.created_utc)}
		{comment.ups}
		<div class="border">
			{@html cleanText(comment.body_html)}
		</div>
	</div>
</a>
