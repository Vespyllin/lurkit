<script lang="ts">
	import {
		ExclamationTriangle,
		LockClosed,
		Reload,
		DrawingPin,
		MagicWand,
		VercelLogo
	} from 'radix-icons-svelte';
	import { cleanText, isDarkHex } from '$lib';
	import SubredditPopover from '../subreddit/SubredditPopover.svelte';
	import { cn } from '$lib/utils';
	import UserPopover from '../users/UserPopover.svelte';
	import type { ClassValue } from 'tailwind-variants';
	import TimeHoverCard from '../layout/TimeHoverCard.svelte';

	let {
		class: className,
		subreddit,
		edited,
		author,
		created_utc,
		crossposted_from,
		over_18,
		locked,
		stickied,
		flairs,
		flairColor,
		distinguished
	}: {
		class?: ClassValue;
		subreddit?: RedditSrDetail;
		edited?: boolean | number;
		author: string;
		created_utc: number;
		over_18: boolean;
		crossposted_from?: string;
		locked: boolean;
		stickied?: boolean;
		flairs?: RedditLinkFlairRichText[];
		flairColor?: string;
		distinguished?: string;
	} = $props();

	const formatDate = (date_utc: number) => {
		const date = new Date(date_utc * 1000);
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const dayName = days[date.getDay()];
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		return `${dayName}, ${day}-${month}-${year} at ${hours}:${minutes}:${seconds}`;
	};
</script>

<div class={cn('flex flex-wrap items-center gap-2', className)}>
	{#if subreddit}
		<SubredditPopover {subreddit} />
	{/if}

	<div class="hidden gap-2 md:flex">
		•
		<div class="flex items-center gap-1 text-zinc-400">
			<UserPopover username={author} />
			{#if distinguished}
				{#if distinguished == 'moderator'}
					<MagicWand />
				{:else if distinguished == 'admin'}
					<VercelLogo />
				{:else}
					<span class="capitalize">
						({distinguished})
					</span>
				{/if}
			{/if}
		</div>
	</div>

	•
	<TimeHoverCard {created_utc} {edited} class="cursor-default" />

	{#if over_18}
		•
		<div class="mt-0.5 flex items-center gap-1 text-zinc-400">
			<ExclamationTriangle />
			<span class="text-zinc-400">18+</span>
		</div>
	{/if}

	{#if crossposted_from}
		•
		<div class="flex items-center gap-1">
			<div class="size-fit text-zinc-400">
				<Reload />
			</div>
			<span class="text-zinc-400"> crosspost </span>
		</div>
	{/if}

	{#if locked}
		•
		<div class="flex items-center gap-1">
			<div class="size-fit text-zinc-400">
				<LockClosed />
			</div>

			<span class="hidden text-zinc-400 md:inline"> locked </span>
		</div>
	{/if}

	{#if stickied}
		•
		<div class="flex items-center gap-1">
			<div class="size-fit text-zinc-400">
				<DrawingPin />
			</div>

			<span class="hidden text-zinc-400 md:inline"> pinned </span>
		</div>
	{/if}

	<div
		class={cn(
			'flex h-fit w-fit items-center gap-1 rounded-2xl bg-secondary px-2 text-sm',
			flairColor && (isDarkHex(flairColor) ? 'text-white' : 'text-zinc-900')
		)}
		style="background-color: {flairColor};"
	>
		{#each flairs ?? [] as flair}
			{#if flair.e == 'text'}
				{cleanText(flair.t!)}
			{:else if flair.e == 'emoji'}
				<img alt="" src={flair.u} class="h-4 px-0.5" />
			{/if}
		{/each}
	</div>
</div>
