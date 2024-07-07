<script lang="ts">
	import { getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import { ArrowUp, ChatBubble, DrawingPin, PlusCircled } from 'radix-icons-svelte';
	import Markdown from '../ui/markdown/Markdown.svelte';

	const { comment = $bindable() }: { comment: CommentContentProps } = $props();
	const toggleCollapse = () => (comment.collapsed = !comment.collapsed);
	const showMoreComments = () => (comment.shelved = false);
</script>

<div class="border-l-2 pl-3 text-base hover:border-blue-400">
	<div class="cursor-pointer text-lg leading-tight" onclick={toggleCollapse}>
		<div class="hidden gap-2 lg:flex">
			<div class={cn('text-blue-500', comment.is_submitter && 'underline')}>
				{comment.author}
			</div>

			<span class="hidden lg:inline">•</span>

			<div class="flex items-center text-zinc-400">
				<ArrowUp />
				{comment.score.toLocaleString()}
			</div>

			{#if comment.totalChildren}
				<span>•</span>
				<div class="flex items-center gap-1 text-zinc-400">
					<ChatBubble />
					{comment.totalChildren.toLocaleString()}
				</div>
			{/if}

			{#if comment.stickied}
				<span>•</span>
				<div class="flex items-center gap-1 text-zinc-400">
					<DrawingPin />
					<span class="text-zinc-400">stickied</span>
				</div>
			{/if}

			<span>•</span>
			<span class="text-zinc-400">{getTimeAgo(comment.created_utc)}</span>

			{#if typeof comment.edited == 'number'}
				<span>•</span>
				<span class="text-zinc-400">*{getTimeAgo(comment.edited)}</span>
			{/if}
		</div>

		<!-- Mobile -->
		<div class="flex gap-2 lg:hidden">
			<div class={cn('text-blue-500', comment.is_submitter && 'underline')}>
				{comment.author}
			</div>

			{#if comment.stickied}
				<span>•</span>
				<div class="flex items-center gap-1 text-zinc-400">
					<DrawingPin />
				</div>
			{/if}

			<span>•</span>
			<span class="text-zinc-400"
				>{getTimeAgo(comment.created_utc, true)}{#if comment.edited}
					*
				{/if}
			</span>
		</div>
	</div>

	{#if !comment.collapsed}
		<div class="mt-2 max-w-[calc(100lvw-3rem)]">
			<Markdown class="text-base text-zinc-200" text={comment.text} />

			<!-- Mobile -->
			<div class="mt-1 flex gap-2 lg:hidden">
				<div class="flex items-center text-zinc-400">
					<ArrowUp />
					{comment.score.toLocaleString()}
				</div>

				<span>•</span>
				<div class="flex items-center gap-1 text-zinc-400">
					<ChatBubble />
					{comment.totalChildren.toLocaleString()}
				</div>
			</div>
		</div>

		{#if !comment.shelved && comment.children?.length}
			<div class="mt-3 space-y-4 lg:pl-3">
				{#each comment.children ?? [] as _, idx}
					<svelte:self bind:comment={comment.children![idx]} />
				{/each}
			</div>
		{:else if comment.shelved && comment.children?.length}
			<div
				class="mt-2 flex w-full cursor-pointer items-center gap-2 pl-3 text-zinc-400 hover:underline lg:w-fit"
				onclick={showMoreComments}
			>
				<PlusCircled size={18} />
				<span>Expand {comment.children.length.toLocaleString()} more</span>
			</div>
		{/if}
	{/if}
</div>
