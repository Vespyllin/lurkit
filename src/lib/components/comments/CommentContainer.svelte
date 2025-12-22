<script lang="ts">
	import { cleanText, isDarkHex } from '$lib';
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
	import Self from './CommentContainer.svelte';
	import Markdown from '../media/Markdown.svelte';
	import { PUBLIC_SHELF_COMMENT_LENGTH } from '$env/static/public';
	import UserPopover from '../users/UserPopover.svelte';
	import { page } from '$app/state';
	import TimeHoverCard from '../layout/TimeHoverCard.svelte';

	const SHELF_COMMENT_DEPTH = parseInt(PUBLIC_SHELF_COMMENT_LENGTH);
	const shelfDepth = !isNaN(SHELF_COMMENT_DEPTH) ? SHELF_COMMENT_DEPTH : 1;

	const {
		comments = $bindable(),
		class: className,
		shelved: _shelved = true,
		nofold = false
	}: { comments: CommentsProp[]; class?: string; shelved?: boolean; nofold?: boolean } = $props();

	let shelved = $state((() => _shelved)());

	const {
		params: { subreddit, title, tag }
	} = page;
</script>

<div>
	{#each comments as _, idx}
		{#if shelved && idx - 1 == shelfDepth && comments[idx].depth != 0}
			{@const hasMore = !!comments.find((x) => x.kind == 'more')}
			<button
				class="mt-1.5 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline lg:w-fit"
				onclick={() => (shelved = false)}
			>
				<PlusCircled size={18} />
				<span>
					Expand {(comments.length - shelfDepth - +hasMore).toLocaleString()}{hasMore ? '+' : ''} more</span
				>
			</button>
		{:else if !shelved || idx < shelfDepth || comments[idx].depth == 0}
			<!-- ^ Hidden for base listing of comments as the "view more" functionality does not currently work -->
			{#if comments[idx].kind == 'more' && idx != 0}
				{@const parent_id = comments[idx].parent_id.split('_')[1]}
				<a
					href={`/r/${subreddit}/comments/${tag}/${title}/${parent_id}`}
					class="mt-1 flex w-full cursor-pointer items-center gap-2 pl-1 text-zinc-400 hover:underline md:w-fit"
				>
					<ArrowRight size={18} />
					<span>View {comments[idx].count} more comment{comments[idx].count == 1 ? '' : 's'}</span>
				</a>
			{:else if comments[idx].kind == 't1'}
				{@const comment = comments[idx]}
				{@const authorFlairTexts = comment.author_flair_richtext}
				<div class={cn('mt-2.5 border-l-2 pl-3 text-base hover:border-accent', className)}>
					<button
						class={cn(
							'flex h-full w-full flex-wrap items-center gap-1.5 text-lg leading-tight md:gap-2',
							nofold ? 'cursor-default' : 'cursor-pointer'
						)}
						onclick={(e) => {
							e.stopImmediatePropagation();
							if (nofold) return console.log('no fold');
							comment.folded = !comment.folded;
						}}
					>
						<span class={cn('flex items-center gap-1 text-primary')}>
							<UserPopover highlight={comment.is_submitter} username={comment.author} />
							{#if comment.distinguished}
								{#if comment.distinguished == 'moderator'}
									<MagicWand />
								{:else if comment.distinguished == 'admin'}
									<VercelLogo />
								{:else}
									<span class="capitalize">({comment.distinguished})</span>
								{/if}
							{/if}
						</span>

						{#if !comment.score_hidden}
							<span class="hidden md:inline">•</span>
							<div class="hidden items-center text-zinc-400 md:flex">
								<ArrowUp />
								<span>{comment.score.toLocaleString()}</span>
							</div>
						{/if}

						{#if comment.replies.length || !comment.locked}
							<span class="hidden md:inline">•</span>
							<div class="hidden items-center gap-1 text-zinc-400 md:flex">
								<ChatBubble />
								<span>{(comment.replies.length ?? 0).toLocaleString()}</span>
							</div>
						{/if}

						{#if comment.locked}
							<span class="hidden md:inline">•</span>
							<div class="flex items-center gap-1 text-zinc-400">
								<LockClosed />
								<span class="hidden text-zinc-400 md:inline">locked</span>
							</div>
						{/if}

						{#if comment.stickied}
							<span class="hidden md:inline">•</span>
							<div class="flex items-center gap-1 text-zinc-400">
								<DrawingPin />
								<span class="hidden text-zinc-400 md:inline">stickied</span>
							</div>
						{/if}

						<span>•</span>
						<div class="text-zinc-400">
							<TimeHoverCard
								class={nofold ? 'cursor-default' : 'cursor-pointer'}
								created_utc={comment.created_utc}
								edited={comment.edited}
							/>
						</div>

						{#if authorFlairTexts && authorFlairTexts.length > 0 && !(authorFlairTexts.length == 1 && authorFlairTexts[0]?.t == '​')}
							<div
								class="flex h-full w-fit max-w-72 items-center rounded-2xl bg-secondary px-2 py-0.5 text-sm"
								style="background-color: {comment.author_flair_background_color};"
							>
								{#each authorFlairTexts as flair}
									{#if flair.e == 'text'}
										<span
											class={cn(
												'overflow-hidden text-ellipsis whitespace-nowrap break-all [&:not(:first-child)]:ml-1.5',
												comment.author_flair_background_color &&
													!isDarkHex(comment.author_flair_background_color) &&
													'text-zinc-900'
											)}
										>
											{cleanText(flair.t!)}
										</span>
									{:else if flair.e == 'emoji'}
										<img alt="" src={flair.u} class="h-4" />
									{/if}
								{/each}
							</div>
						{/if}
					</button>

					{#if !comment.folded}
						<div class="mt-1.5 min-h-4">
							<div class="text-wrap break-words text-base text-zinc-200">
								{#if comment.deleted}
									{#if comment.deleted == 'removed'}
										<p class="capitalize italic text-zinc-400">
											Comment Moderated{!!comment.reason ? `: ${comment.reason}` : ''}
										</p>
									{:else}
										<p class="capitalize italic text-zinc-400">
											Comment Deleted{!!comment.reason ? `: ${comment.reason}` : ''}
										</p>
									{/if}
								{:else}
									<Markdown text={comment.body_html} />
								{/if}
							</div>

							<div class="mt-1 flex gap-4 md:hidden">
								{#if comment.score !== undefined || comment.score !== null}
									<div class="flex items-center text-zinc-400">
										<ArrowUp />
										<span>{comment.score.toLocaleString()}</span>
									</div>
								{/if}

								{#if comment.replies.length || !comment.locked}
									<div class="flex items-center gap-1 text-zinc-400">
										<ChatBubble />
										<span>{(comment.replies.length ?? 0).toLocaleString()}</span>
									</div>
								{/if}

								{#if comment.locked}
									<div class="flex items-center gap-1 text-zinc-400">
										<LockClosed />
									</div>
								{/if}
							</div>
						</div>

						<Self class="md:ml-2" shelved={_shelved} bind:comments={comment.replies} />
					{/if}
				</div>
			{/if}
		{/if}
	{/each}
</div>
