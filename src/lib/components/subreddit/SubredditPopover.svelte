<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Check, Trash } from 'radix-icons-svelte';
	import Spinner from '../layout/Spinner.svelte';
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';
	import type { Filter } from '$lib/db/filters';
	import { cleanText } from '$lib';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();
	let status: 'INIT' | 'LOADING' | 'DONE' = $state('INIT');

	const filterContext: UseQueryStoreResult<Filter[], unknown, Filter[], 'filters'> | null =
		getContext('filters');

	const icon_url: string | undefined =
		subreddit?.community_icon?.split('?')[0] || subreddit.icon_img || undefined;
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<a class="flex items-center gap-2 hover:underline" href={`/${subreddit.display_name_prefixed}`}>
			<img alt="" src={icon_url ?? '/favicon.png'} class="h-5 rounded-full object-contain" />
			<span class="text-zinc-200">
				{subreddit.display_name_prefixed}
			</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content class="flex h-[7.25rem] gap-1 p-1 pr-1.5">
		{#if icon_url}
			<img alt="" src={icon_url} class="mr-2 aspect-square h-full rounded-md" />
		{/if}
		<div>
			<div class="flex items-center gap-2">
				<a
					class="w-fit text-xl font-semibold tracking-tighter hover:underline"
					href={`/${subreddit.display_name_prefixed}`}
				>
					{subreddit.display_name_prefixed}
				</a>

				<button
					onclick={async (e) => {
						e.preventDefault();
						status = 'LOADING';

						const res = await fetch('/api/filters/subreddit', {
							method: 'POST',
							body: JSON.stringify({ subreddit: subreddit.display_name_prefixed })
						});
						const resJson = await res.json();

						if (!!resJson.success) {
							await $filterContext?.refetch();
							status = 'DONE';
						} else {
							status = 'INIT';
						}
					}}
					class={cn(
						!!$filterContext?.data
							?.find((x) => x.type == 'subreddit')
							?.content.find((x) => x == subreddit.display_name_prefixed) && 'hidden',
						'hover size-fit rounded-md p-1 transition-opacity hover:bg-zinc-700',
						status !== 'INIT' && 'pointer-events-none bg-none opacity-0 duration-1000 ease-in'
					)}
				>
					{#if status == 'INIT'}
						<Trash size={20} />
					{:else if status == 'LOADING'}
						<Spinner class="size-5" />
					{:else}
						<Check size={20} />
					{/if}
				</button>
			</div>

			{#if !subreddit.public_description}
				<div class="w-32 italic text-zinc-400">No description.</div>
			{:else}
				<div
					class="line-clamp-4 w-fit min-w-72 max-w-[450px] overflow-hidden text-ellipsis break-words text-zinc-400"
				>
					{cleanText(subreddit.public_description)}
				</div>
			{/if}
		</div>
	</Tooltip.Content>
</Tooltip.Root>
