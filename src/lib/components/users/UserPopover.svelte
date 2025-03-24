<script lang="ts">
	import { cn } from '$lib/utils';
	import { useQuery } from '@sveltestack/svelte-query';
	import { fetchUserAbout } from '$lib/client';
	import Spinner from '../layout/Spinner.svelte';
	import { Check, Cross1, Minus, Timer } from 'radix-icons-svelte';

	let { username, class: className }: { username: string; class?: string } = $props();

	const listingQuery = useQuery(username, () => fetchUserAbout(username));
</script>

{#if username === '[deleted]' || username === 'AutoModerator'}
	<span class={className}>{username}</span>
{:else}
	<!-- <Tooltip.Root openDelay={250}>
		<Tooltip.Trigger> -->
	<a class={cn('hover:underline', className)} href={`/u/${username}`}>
		{username}
	</a>
	<!-- </Tooltip.Trigger>
		<Tooltip.Content class="flex min-h-24 w-fit min-w-32 items-center gap-1 px-2">
			{#if $listingQuery.isLoading}
				<Spinner class="mx-auto" />
			{:else if $listingQuery.error}
				<span>Error: {$listingQuery.error}</span>
			{:else if $listingQuery.data?.data}
				{@const { data } = $listingQuery.data}
				{@const verifiedLevel = (data.has_verified_email ? 1 : 0) + (data.verified ? 1 : 0)}
				{@const dateTime = new Date(data.created_utc * 1000)}
				{#if data.snoovatar_img}
					<img src={data.snoovatar_img} alt="" class="h-24 pr-2" />
				{/if}
				<div class="flex flex-col">
					<div class="flex items-center text-xl font-semibold">
						<a class={cn('hover:underline', className)} href={`/u/${username}`}>
							{data.subreddit.display_name_prefixed}
						</a>

						<div class="mt-0.5">
							{#if verifiedLevel == 0}
								<Cross1 size={22} />
							{:else if verifiedLevel == 1}
								<Minus size={22} />
							{:else}
								<Check size={22} />
							{/if}
						</div>
					</div>

					<div class="mt-0.5 flex items-center gap-1 text-zinc-200">
						<Timer /> <span>{dateTime.toDateString()}</span>
					</div>

					<div class="grid w-fit grid-cols-2 gap-4">
						<div class="flex flex-col">
							<span class="text-lg">Posts</span>
							<span class="text-zinc-400">
								{(data.awarder_karma + data.link_karma).toLocaleString()} karma
							</span>
						</div>
						<div class="ml-auto flex flex-col">
							<span class="text-lg">Comments</span>
							<span class="text-zinc-400">{data.comment_karma.toLocaleString()} karma</span>
						</div>
					</div>
				</div>
			{/if}
		</Tooltip.Content>
	</Tooltip.Root> -->
{/if}
