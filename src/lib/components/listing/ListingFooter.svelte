<script lang="ts">
	import { ArrowUp, ChatBubble } from 'radix-icons-svelte';

	const {
		score,
		upvote_ratio,
		num_comments,
		permalink
	}: { score: number; upvote_ratio: number; num_comments: number; permalink?: string } = $props();
</script>

<div class="font-semibold">
	<div class="inline-flex items-center gap-1 rounded-3xl bg-black p-2 px-5">
		<div class="-ml-1">
			<ArrowUp size={20} />
		</div>
		<span>
			{score.toLocaleString()}
		</span>
		<span style="color:hsl({120 * upvote_ratio}, 85%, 50%);">
			({upvote_ratio.toLocaleString(undefined, { minimumFractionDigits: 2 })})
		</span>
	</div>
	<a href={`${permalink}`}>
		<div class="inline-flex items-center gap-1 rounded-3xl bg-black p-2 px-5">
			<ChatBubble size={20} />
			<span class="ml-1">
				{num_comments.toLocaleString()}
			</span>
		</div>
	</a>
</div>
