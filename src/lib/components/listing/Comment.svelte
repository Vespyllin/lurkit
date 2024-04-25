<script lang="ts">
	import { cleanText, getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import { DrawingPin } from 'radix-icons-svelte';
	import CommentChain from './CommentChain.svelte';
	import Markdown from '@magidoc/plugin-svelte-marked';

	const {
		comment,
		depth,
		collapsed: collapseProp
	}: { comment: PostComment; depth: number; collapsed?: boolean } = $props();

	let collapsed = $state(comment.stickied || collapseProp);
	const collapse = () => (collapsed = !collapsed);
</script>

<div class="mt-1 border-l-2 pl-3 text-lg hover:border-blue-400">
	<div class="my-1 flex items-center gap-2 leading-none" onclick={collapse}>
		<span class={cn('text-blue-500', comment.is_submitter && 'underline')}>
			{comment.author}
		</span>
		•
		<span class="text-zinc-400">
			{comment.score} upvote{comment.score != 1 ? 's' : ''}
		</span>
		•
		<span class="text-zinc-400">
			{getTimeAgo(comment.created_utc)}
		</span>
		{#if typeof comment.edited == 'number'}
			•
			<span class="text-zinc-400"> *edited {getTimeAgo(comment.edited)} </span>
		{/if}

		{#if comment.stickied}
			•
			<span class="text-zinc-400"><DrawingPin size={18} /></span>

			<span class="text-zinc-400"> stickied </span>
		{/if}
	</div>

	{#if !collapsed}
		<p
			class="mt-2 flex flex-col gap-3 whitespace-pre text-wrap break-words text-zinc-100 [&_a]:inline-block [&_a]:text-blue-600 [&_a]:underline [&_a]:visited:text-purple-600 hover:[&_a]:text-blue-800"
		>
			<Markdown source={cleanText(comment.text) ?? ''} />
		</p>

		{#if !!comment.children}
			<div class="ml-3 flex flex-col pt-1">
				<CommentChain comments={comment.children} depth={depth + 1} />
			</div>
		{/if}
	{/if}
</div>
