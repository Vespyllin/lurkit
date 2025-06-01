<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Check, Cross1, Trash } from 'radix-icons-svelte';
	import Spinner from '../layout/Spinner.svelte';
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';
	import type { Filter } from '$lib/db/filters';
	import { cleanText } from '$lib';
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
		const inBanlist = $filterContext?.data
			?.find((x) => x.type == 'subreddit')
			?.content.includes(subreddit.display_name_prefixed.toLowerCase());

		if (inBanlist) status = 'BANNED';
		else status = 'OK';
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

				{#if !!$filterContext?.data
					?.find((x) => x.type == 'subreddit')
					?.content.find((x) => x == subreddit.display_name_prefixed) && status == 'OK'}
					<Cross1 color="#f00" size={20} />
				{:else}
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
						class={cn(
							'size-fit rounded-md p-1',
							status === 'OK' ? 'hover:bg-zinc-700' : 'pointer-events-none bg-none',
							status === 'BANNED' && 'text-red-600'
						)}
					>
						<div>
							{#if status == 'OK'}
								<Trash size={20} />
							{:else if status == 'LOADING'}
								<Spinner class="size-5" />
							{:else}
								<GavelIcon size={20} />
							{/if}
						</div>
					</button>
				{/if}
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
