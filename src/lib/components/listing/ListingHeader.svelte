<script lang="ts">
	import { ExclamationTriangle, LockClosed } from 'radix-icons-svelte';
	import { cleanText, getTimeAgo } from '$lib';
	import SubredditPopover from '../subreddit/SubredditPopover.svelte';

	let {
		subreddit,
		author,
		created_utc,
		over_18,
		locked,
		flairs
	}: {
		subreddit?: SubredditDetails;
		author: string;
		created_utc: number;
		over_18: boolean;
		locked: boolean;
		flairs?: RedditLinkFlairRichText[];
	} = $props();
</script>

<div class="flex h-5 items-center gap-2">
	{#if subreddit}
		<SubredditPopover {subreddit} />
	{/if}

	<div class="hidden gap-2 lg:flex">
		•
		<span class="text-zinc-400">
			{author}
		</span>
	</div>

	•
	<span class="hidden text-zinc-400 lg:inline">
		{getTimeAgo(created_utc)}
	</span>
	<span class="text-zinc-400 lg:hidden">
		{getTimeAgo(created_utc, true)}
	</span>

	{#if over_18}
		•
		<div class="flex items-center gap-1">
			<div class="mt-0.5 h-fit w-fit text-zinc-400">
				<ExclamationTriangle />
			</div>
			<span class="text-zinc-400"> 18+ </span>
		</div>
	{/if}

	{#if !locked}
		•
		<div class="flex items-center gap-1">
			<div class="h-fit w-fit text-zinc-400">
				<LockClosed />
			</div>

			<span class="hidden text-zinc-400 lg:inline"> locked </span>
		</div>
	{/if}

	{#each (flairs ?? []).filter((x) => x.e === 'text' && !!x.t) as flair}
		<div class="h-fit w-fit rounded-2xl bg-blue-400 px-2 text-sm">{cleanText(flair.t!)}</div>
	{/each}
</div>
