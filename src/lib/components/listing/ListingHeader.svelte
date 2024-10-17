<script lang="ts">
	import { ExclamationTriangle, LockClosed, Reload } from 'radix-icons-svelte';
	import { cleanText, getTimeAgo } from '$lib';
	import SubredditPopover from '../subreddit/SubredditPopover.svelte';

	let {
		subreddit,
		edited,
		author,
		created_utc,
		crossposted_from,
		over_18,
		locked,
		flairs
	}: {
		subreddit?: SubredditDetails;
		edited?: boolean | number;
		author: string;
		created_utc: number;
		over_18: boolean;
		crossposted_from: string | undefined;
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
		{getTimeAgo(created_utc)}{#if edited}
			*
		{/if}
	</span>
	<span class="text-zinc-400 lg:hidden">
		{getTimeAgo(created_utc, true)}{#if edited}
			*
		{/if}
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

	{#if crossposted_from}
		•
		<div class="flex items-center gap-1">
			<div class="h-fit w-fit text-zinc-400">
				<Reload />
			</div>
			<span class="text-zinc-400"> {crossposted_from} </span>
		</div>
	{/if}

	{#if locked}
		•
		<div class="flex items-center gap-1">
			<div class="h-fit w-fit text-zinc-400">
				<LockClosed />
			</div>

			<span class="hidden text-zinc-400 lg:inline"> locked </span>
		</div>
	{/if}

	{#each flairs?.filter((x) => x.e === 'text' && !!x.t) ?? [] as flair}
		<div class="h-fit w-fit rounded-2xl bg-blue-400 px-2 text-sm">{cleanText(flair.t!)}</div>
	{/each}
</div>
