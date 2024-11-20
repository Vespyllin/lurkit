<script lang="ts">
	import { cleanText, getTimeAgo } from '$lib';
	import { cn } from '$lib/utils';
	import {
		ArrowUp,
		ChatBubble,
		DrawingPin,
		PlusCircled,
		MagicWand,
		LockClosed,
		VercelLogo,
		ArrowRight
	} from 'radix-icons-svelte';
	import Self from './Comments.svelte';
	import Markdown from '../media/Markdown.svelte';
	import { PUBLIC_SHELF_COMMENT_LENGTH } from '$env/static/public';
	import { page } from '$app/stores';

	const {
		comments = $bindable(),
		class: className
	}: { comments: CommentsProps[]; class?: string } = $props();

	const SHELF_COMMENT_DEPTH = parseInt(PUBLIC_SHELF_COMMENT_LENGTH);
	const shelfDepth = !isNaN(SHELF_COMMENT_DEPTH) ? SHELF_COMMENT_DEPTH : 1;

	let shelved = $state(true);

	const {
		params: { subreddit, tag }
	} = $page;
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div>
	{#each comments as _, idx}
		{#if shelved && idx - 1 == shelfDepth}
			<button
				class="mt-1 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline lg:w-fit"
				onclick={() => (shelved = false)}
			>
				<PlusCircled size={18} />
				<span> Expand {(comments.length - shelfDepth - 1).toLocaleString()} more</span>
			</button>
		{:else if !shelved || idx < shelfDepth || comments[idx].depth == 0}
			{#if comments[idx].kind == 'more'}
				<a
					href={`/r/${subreddit}/comments/${tag}/comment/${comments[idx].parent_id.split('_')[1]}`}
					class="mt-1 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline md:w-fit"
				>
					<ArrowRight size={18} />
					<span>View {comments[idx].count} more comments</span>
				</a>
			{:else}
				<div class={cn('mt-2 border-l-2 pl-3 text-base hover:border-accent', className)}>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="flex h-fit cursor-pointer gap-1.5 text-lg leading-tight md:gap-2"
						onclick={() => {
							if (comments[idx].kind == 't1') {
								comments[idx].folded = !comments[idx].folded;
							}
						}}
					>
						<span
							class={cn(
								'flex items-center gap-1 text-primary',
								comments[idx].is_submitter && 'underline'
							)}
						>
							<span>{comments[idx].author}</span>
							{#if comments[idx].distinguished}
								{#if comments[idx].distinguished == 'moderator'}
									<MagicWand />
								{:else if comments[idx].distinguished == 'admin'}
									<VercelLogo />
								{:else}
									<span class="capitalize">
										({comments[idx].distinguished})
									</span>
								{/if}
							{/if}
						</span>

						{#if !comments[idx].score_hidden}
							<span class="hidden md:inline">•</span>
							<div class="hidden items-center text-zinc-400 md:flex">
								<ArrowUp />
								<span>{comments[idx].score.toLocaleString()}</span>
							</div>
						{/if}

						<span class="hidden md:inline">•</span>
						<div class="hidden items-center gap-1 text-zinc-400 md:flex">
							<ChatBubble />

							{#if comments[idx].replies.length || !comments[idx].locked}
								<span>{(comments[idx].replies.length ?? 0).toLocaleString()}</span>
							{/if}
							{#if comments[idx].locked}
								<LockClosed />
							{/if}
						</div>

						{#if comments[idx].stickied}
							<span class="hidden md:inline">•</span>
							<div class="flex items-center gap-1 text-zinc-400">
								<DrawingPin />
								<span class="hidden text-zinc-400 md:inline">stickied</span>
							</div>
						{/if}

						<span>•</span>
						<div class="text-zinc-400">
							<span class="hidden md:inline">
								{getTimeAgo(comments[idx].created_utc)}
							</span><span class="inline md:hidden">
								{getTimeAgo(comments[idx].created_utc, true)}
							</span>{#if comments[idx].edited}<span>*</span>{/if}
						</div>

						{#if comments[idx].author_flair_richtext && comments[idx].author_flair_richtext.length > 0}
							<div
								class="flex h-full w-fit items-center rounded-2xl bg-secondary px-2 py-0.5 text-sm"
							>
								{#each comments[idx].author_flair_richtext as flair}
									{#if flair.e == 'text'}
										<span class="[&:not(:first-child)]:ml-1">
											{cleanText(flair.t!)}
										</span>
									{:else if flair.e == 'emoji'}
										<img alt="" src={flair.u} class="h-4" />
									{/if}
								{/each}
							</div>
						{/if}
					</div>

					{#if !comments[idx].folded}
						<div class="mt-2 min-h-4 max-w-[calc(100lvw-3rem)]">
							<div class="text-wrap break-words text-base text-zinc-200">
								<Markdown text={comments[idx].body_html} />
							</div>

							<!-- Mobile -->
							<div class="mt-1 flex gap-4 md:hidden">
								{#if comments[idx].score}
									<div class="flex items-center text-zinc-400">
										<ArrowUp />
										<span>{comments[idx].score.toLocaleString()}</span>
									</div>
								{/if}

								<div class="flex items-center gap-1 text-zinc-400">
									<ChatBubble />
									{#if !comments[idx].replies.length || !comments[idx].locked}
										<span>{(comments[idx].replies.length ?? 0).toLocaleString()}</span>
									{/if}
									{#if comments[idx].locked}
										<LockClosed />
									{/if}
								</div>
							</div>
						</div>

						{#if comments[idx].replies.length}
							<div class="mt-3 space-y-4">
								<Self class="md:ml-2" bind:comments={comments[idx].replies} />
							</div>
						{/if}
					{/if}
				</div>
			{/if}
		{/if}
	{/each}
</div>
