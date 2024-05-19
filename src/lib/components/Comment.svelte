<script lang="ts">
	import { getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import { ArrowUp, DrawingPin } from 'radix-icons-svelte';
	import CommentChain from './CommentChain.svelte';
	import Markdown from './Markdown.svelte';

	const {
		comment,
		depth,
		collapsed: collapseProp
	}: { comment: PostComment; depth: number; collapsed?: boolean } = $props();

	let collapsed = $state(comment.stickied || collapseProp);
	const collapse = () => (collapsed = !collapsed);
</script>

<div class="mt-1 border-l-2 pl-3 text-lg hover:border-blue-400">
	<div class="my-1 flex cursor-pointer items-center gap-2 leading-none" onclick={collapse}>
		<span class={cn('font-medium text-blue-500', comment.is_submitter && 'underline')}>
			{comment.author}
		</span>
		•
		<div>
			<span class="hidden text-zinc-400 lg:inline">
				{comment.score.toLocaleString()} upvote{comment.score != 1 ? 's' : ''}
			</span>
			<div class="flex text-zinc-400 lg:hidden">
				<ArrowUp size={18} />
				{comment.score.toLocaleString()}
				{#if typeof comment.edited == 'number'}
					<span class="inline lg:hidden">*</span>
				{/if}
			</div>
		</div>
		•
		<span class="hidden text-zinc-400 lg:inline">
			{getTimeAgo(comment.created_utc)}
		</span>
		<span class="inline text-zinc-400 lg:hidden">
			{getTimeAgo(comment.created_utc, true)}
		</span>

		{#if typeof comment.edited == 'number'}
			<span class="hidden lg:inline">•</span>
			<span class="hidden text-zinc-400 lg:inline"> *edited {getTimeAgo(comment.edited)}</span>
		{/if}

		{#if comment.stickied}
			<span>•</span>
			<span class="text-zinc-400">
				<DrawingPin size={18} />
			</span>
			<span class="text-zinc-400"> stickied</span>
		{/if}
	</div>

	{#if !collapsed}
		<Markdown class="mt-2" text={comment.text} />

		{#if !!comment.children}
			<div class="ml-3 flex flex-col pt-1">
				<CommentChain comments={comment.children} depth={depth + 1} />
			</div>
		{/if}
	{/if}
</div>
