<script lang="ts">
	import { getContext } from 'svelte';
	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';

	import { cn } from '$lib/utils';
	import { cleanText } from '$lib';
	import type { Filter } from '$lib/db/filters';

	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Spinner from '../layout/Spinner.svelte';
	import { Trash } from 'radix-icons-svelte';
	import { GavelIcon } from 'lucide-svelte';

	let { subreddit }: { subreddit: RedditSrDetail } = $props();
	let status: 'OK' | 'LOADING' | 'BANNED' = $state('LOADING');

	const filterContext: UseQueryStoreResult<Filter[], unknown, Filter[], 'filters'> | null =
		getContext('filters');

	const icon_url: string | undefined = (
		subreddit?.community_icon ||
		subreddit.icon_img ||
		undefined
	)?.split('?')[0];

	$effect(() => {
		if (!$filterContext || $filterContext.isFetching) {
			status = 'LOADING';
		} else {
			const filtered = $filterContext?.data
				?.find((x) => x.type == 'subreddit')
				?.content.includes(subreddit.display_name_prefixed.toLowerCase());

			status = filtered ? 'BANNED' : 'OK';
		}
	});
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
	<Tooltip.Content class={cn('flex gap-1 ', icon_url ? 'h-[7.25rem] p-1 pr-1.5' : 'h-fit p-2')}>
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
						} else {
							status = 'OK';
						}
					}}
					disabled={status !== 'OK'}
					class={cn(
						'size-fit rounded-md p-1',
						status === 'OK' && 'hover:bg-zinc-700',
						status === 'BANNED' && 'text-red-600',
						status !== 'OK' && 'pointer-events-none bg-none'
					)}
				>
					{#if status == 'OK'}
						<Trash size={20} />
					{:else if status == 'LOADING'}
						<Spinner class="size-5" />
					{:else}
						<GavelIcon size={20} />
					{/if}
				</button>
			</div>

			{#if !subreddit.public_description}
				<div class="w-32 italic text-zinc-400">No description.</div>
			{:else}
				<div
					class={cn(
						'line-clamp-4 w-fit  overflow-hidden text-ellipsis break-words text-zinc-400',
						icon_url ? 'min-w-72 max-w-[450px]' : 'min-w-60 max-w-[325px]'
					)}
				>
					{cleanText(subreddit.public_description)}
				</div>
			{/if}
		</div>
	</Tooltip.Content>
</Tooltip.Root>
