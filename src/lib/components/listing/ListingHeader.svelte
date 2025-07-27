<script lang="ts">
	import type { ClassValue } from 'tailwind-variants';

	import {
		ExclamationTriangle,
		LockClosed,
		Reload,
		DrawingPin,
		MagicWand,
		VercelLogo,
		Trash
	} from 'radix-icons-svelte';
	import { cleanText, isDarkHex } from '$lib';
	import { cn } from '$lib/utils';

	import SubredditPopover from '../subreddit/SubredditPopover.svelte';
	import UserPopover from '../users/UserPopover.svelte';
	import TimeHoverCard from '../layout/TimeHoverCard.svelte';

	let {
		class: className,
		listing,
		crossposted_from,
		flaired
	}: {
		class?: ClassValue;
		listing: RedditT3Data;
		crossposted_from?: string;
		flaired?: boolean;
	} = $props();

	const {
		sr_detail: subreddit,
		edited,
		author,
		created_utc,
		over_18,
		locked,
		stickied,
		pinned,
		removed_by,
		removed_by_category,
		link_flair_richtext: flairs,
		link_flair_background_color: flairColor,
		distinguished
	} = listing;

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

	<div class="flex gap-2">
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

	{#if stickied || (flaired && pinned)}
		•
		<div class="flex items-center gap-1">
			<div class="size-fit text-zinc-400">
				<DrawingPin />
			</div>

			<span class="hidden text-zinc-400 md:inline"> pinned </span>
		</div>
	{/if}

	{#if removed_by || removed_by_category}
		•
		<div class="flex items-center gap-1">
			<div class="size-fit text-zinc-400">
				<Trash />
			</div>

			<span class="hidden text-zinc-400 md:inline"> removed </span>
		</div>
	{/if}

	{#if flaired}
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
	{/if}
</div>
