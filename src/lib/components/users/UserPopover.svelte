<script lang="ts">
	import { cn } from '$lib/utils';
	import { useQuery } from '@sveltestack/svelte-query';
	import { fetchUserAbout } from '$lib/client';
	import Spinner from '../layout/Spinner.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Check, Cross1, Minus, Timer } from 'radix-icons-svelte';

	let { username, class: className }: { username: string; class?: string } = $props();

	const userQuery = useQuery([username, 'about'], () => fetchUserAbout(username));
</script>

{#if username === '[deleted]' || username === 'AutoModerator'}
	<span class={className}>{username}</span>
{:else}
	<Tooltip.Root>
		<Tooltip.Trigger>
			<a class={cn('hover:underline', className)} href={`/u/${username}`}>
				{username}
			</a>
		</Tooltip.Trigger>
		<Tooltip.Content
			onclick={(e) => {
				console.log('A');
				e.preventDefault();
				e.stopPropagation();
			}}
			class="flex h-28 min-w-28 cursor-default items-center gap-1 p-1 pr-1.5 [&_p]:cursor-text [&_span]:cursor-text"
		>
			{#if $userQuery.isLoading}
				<Spinner class="mx-auto" />
			{:else if $userQuery.error}
				<span>Error: {$userQuery.error}</span>
			{:else if $userQuery.data?.data}
				{@const { data } = $userQuery.data}
				{@const verifiedLevel = (data.has_verified_email ? 1 : 0) + (data.verified ? 1 : 0)}

				{#if data.snoovatar_img || data.icon_img}
					<img
						src={data.snoovatar_img ? data.snoovatar_img : data.icon_img.split('?')[0]}
						alt=""
						class="mr-2 h-full rounded-md"
					/>
				{/if}
				<div class="flex flex-col">
					<div class="flex items-center text-xl font-semibold">
						<a class={cn('hover:underline', className)} href={`/u/${username}`}>
							{data.subreddit.display_name_prefixed}
						</a>

						<div class="ml-0.5">
							{#if verifiedLevel == 0}
								<Cross1 size={22} />
							{:else if verifiedLevel == 1}
								<Minus size={22} />
							{:else}
								<Check size={22} />
							{/if}
						</div>
					</div>

					<div class="mt-0.5 flex items-center gap-1 text-zinc-400">
						<Timer />
						<span
							>{new Date(data.created_utc * 1000)
								.toDateString()
								.split(' ')
								.slice(1)
								.join(' ')}</span
						>
					</div>

					<div class="grid w-fit grid-cols-2 gap-4 text-start">
						<div class="flex flex-col">
							<p class="text-lg">Posts</p>
							<p class="text-zinc-400">
								{(data.awarder_karma + data.link_karma)?.toLocaleString()} karma
							</p>
						</div>
						<div class="ml-auto flex flex-col">
							<p class="text-lg">Comments</p>
							<p class="text-zinc-400">{data.comment_karma?.toLocaleString()} karma</p>
						</div>
					</div>
				</div>
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
