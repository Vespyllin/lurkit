<script lang="ts">
	import { cn } from '$lib/utils';
	import { useQuery } from '@sveltestack/svelte-query';
	import * as Tooltip from '../ui/tooltip';
	import { fetchUserAbout } from '$lib/client';
	import Spinner from '../layout/Spinner.svelte';
	import { Check, Cross1, Minus, Timer } from 'radix-icons-svelte';

	let { username, class: className }: { username: string; class?: string } = $props();

	const listingQuery = useQuery(username, () => fetchUserAbout(username));
</script>

<Tooltip.Root openDelay={50}>
	<Tooltip.Trigger>
		<a class={cn('hover:underline', className)} href={`/u/${username}`}>
			{username}
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content class="w-fit pt-1">
		{#if $listingQuery.isLoading}
			<Spinner />
		{:else if $listingQuery.error}
			error
		{:else if $listingQuery.data?.data}
			{@const { data } = $listingQuery.data}
			{@const verifiedLevel = (data.has_verified_email ? 1 : 0) + (data.verified ? 1 : 0)}
			{@const dateTime = new Date(data.created_utc * 1000)}
			<div class="flex gap-1">
				{#if data.snoovatar_img}
					<img src={data.snoovatar_img} alt="" class="h-24 pr-2" />
				{/if}
				<div class="flex flex-col">
					<div class="flex items-center text-xl font-semibold">
						<span>
							{data.subreddit.display_name_prefixed}
						</span>

						<div class="mt-1">
							{#if verifiedLevel == 0}
								<Cross1 size={22} />
							{:else if verifiedLevel == 1}
								<Minus size={22} />
							{:else}
								<Check size={22} />
							{/if}
						</div>
					</div>

					<div class="mt-0.5 flex items-center gap-1">
						<Timer /> <span>{dateTime.toDateString()}</span>
					</div>

					<div class="grid w-fit grid-cols-2 gap-4">
						<div class="flex flex-col">
							<span class="text-lg">Posts</span>
							<span class="text-zinc-400"
								>{(data.awarder_karma + data.link_karma).toLocaleString()} karma</span
							>
						</div>
						<div class="ml-auto flex flex-col">
							<span class="text-lg">Comments</span>
							<span class="text-zinc-400">{data.comment_karma.toLocaleString()} karma</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
