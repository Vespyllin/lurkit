<script lang="ts">
	import { cleanText, getTimeAgo } from '$lib';
	import { ArrowUp, ChatBubble, LockClosed } from 'radix-icons-svelte';

	const { comment }: { comment: RedditT1Data } = $props();
</script>

<div class="border-l-2 pl-3 hover:border-accent hover:bg-[hsl(0,2,7)]">
	<div>
		<a class="text-primary hover:underline" href={`/${comment.subreddit_name_prefixed}`}>
			{comment.subreddit_name_prefixed}
		</a>
		•
		{comment.link_title}
	</div>

	<a class="space-y-1 rounded-md" href={comment.permalink}>
		<p class="text-zinc-400">{comment.author} commented {getTimeAgo(comment.created_utc)}</p>

		<div>{@html cleanText(comment.body_html)}</div>

		<div class="flex gap-4">
			{#if comment.score}
				<div class="flex items-center text-zinc-400">
					<ArrowUp />
					<span>{comment.score.toLocaleString()}</span>
				</div>
			{/if}

			<div class="flex items-center gap-1 text-zinc-400">
				<ChatBubble />
				{#if !(comment.replies?.data?.children?.length ?? 0) || !comment.locked}
					<span>{(comment.replies?.data?.children?.length ?? 0).toLocaleString()}</span>
				{/if}
				{#if comment.locked}
					<LockClosed />
				{/if}
			</div>
		</div>
	</a>
</div>
