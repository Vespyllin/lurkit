<script lang="ts">
	import { getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import CommentChain from './CommentChain.svelte';

	const { comment }: { comment: PostComment } = $props();
	let collapsed = $state(false);
	const collapse = () => {
		collapsed = !collapsed;
	};
</script>

<svelte:head>
	<script type="module" src="https://md-block.verou.me/md-block.js"></script>
</svelte:head>

<div class="border-l-2 pl-3 text-lg hover:border-blue-400">
	<div on:click={collapse}>
		<span class={cn('text-blue-500', comment.is_submitter && 'underline')}>
			{comment.author}
		</span>
		•
		<span class="text-zinc-400">
			{comment.score}
		</span>
		•
		<span class="text-zinc-400">
			{getTimeAgo(comment.created_utc)}
		</span>
	</div>

	{#if !collapsed}
		<p class="text-bg-zinc-100 whitespace-pre text-wrap break-words">
			{comment.text}
		</p>

		<div class="ml-3 mt-3 flex flex-col">
			{#if !!comment.children}
				<CommentChain comments={comment.children} />
			{/if}
		</div>
	{/if}
</div>
