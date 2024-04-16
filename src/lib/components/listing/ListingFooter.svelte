<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRight, ArrowUp, ChatBubble } from 'radix-icons-svelte';

	const {
		score,
		upvote_ratio,
		num_comments,
		permalink
	}: { score: number; upvote_ratio: number; num_comments: number; permalink?: string } = $props();
</script>

<div class="mt-1 font-semibold">
	<div class="inline-flex items-center gap-1 rounded-3xl bg-black p-2 px-5">
		<div class="-ml-1">
			<ArrowUp size={20} />
		</div>
		<span>
			{score.toLocaleString()}
		</span>
		<span style="color:hsl({120 * upvote_ratio}, 100%, 50%);">
			({upvote_ratio.toLocaleString(undefined, { minimumFractionDigits: 2 })})
		</span>
	</div>
	<div class="inline-flex items-center gap-1 rounded-3xl bg-black p-2 px-5">
		<ChatBubble size={20} />
		<span class="ml-1">
			{num_comments.toLocaleString()}
		</span>
	</div>
	{#if permalink}
		<a class="" href={`http://localhost:5173${permalink}`}>
			<div class="inline-flex items-center gap-2 rounded-3xl bg-blue-800 p-2 pl-4 pr-5">
				<ArrowRight size={20} />
				<span>Go to Post</span>
			</div>
		</a>
	{/if}
</div>
