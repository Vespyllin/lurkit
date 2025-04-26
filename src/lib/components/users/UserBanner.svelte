<script lang="ts">
	import { cn } from '$lib/utils';
	import Check from '@lucide/svelte/icons/check';
	import { Minus } from 'lucide-svelte';
	import { Cross1, Timer } from 'radix-icons-svelte';

	let { data }: { data: RedditT2Data } = $props();

	const icon_img = data.icon_img?.split('?')[0];
	const verifiedLevel = (data.has_verified_email ? 1 : 0) + (data.verified ? 1 : 0);
</script>

<div>
	<div class="relative">
		{#if data.subreddit.banner_img}
			<img
				alt=""
				class="h-40 w-full rounded-md object-cover"
				src={data.subreddit.banner_img.split('?')[0]}
			/>
		{:else}
			<div class="h-20 w-full rounded-md bg-primary"></div>
		{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>

	<div class="flex">
		{#if !!icon_img?.length}
			<img
				alt=""
				class="my-auto mr-4 aspect-square h-[5.5rem] rounded-full border-2 border-primary"
				src={icon_img}
			/>
		{/if}

		<div class="w-96">
			<div class="flex items-center">
				<h1 class="inline text-3xl font-bold">
					{!data.subreddit?.title.length ? data.name : data.subreddit?.title}
				</h1>
				<div class="ml-2">
					{#if verifiedLevel == 0}
						<Cross1 size={22} />
					{:else if verifiedLevel == 1}
						<Minus size={22} />
					{:else}
						<Check size={22} />
					{/if}
				</div>
			</div>
			<div class="flex gap-2">
				<h2 class="inline text-lg text-primary">u/{data.name}</h2>
				<div class="flex items-center gap-1 text-lg text-zinc-400">
					<Timer />
					<span>
						{new Date(data.created_utc * 1000).toDateString().split(' ').slice(1).join(' ')}
					</span>
				</div>
			</div>
			<h2
				class={cn(
					'text-base ',
					!!data.subreddit.public_description ? 'text-zinc-100' : 'text-zinc-500'
				)}
			>
				{!!data.subreddit.public_description
					? data.subreddit.public_description
					: 'No description.'}
			</h2>
		</div>

		<div class="ml-auto mt-auto flex h-fit gap-6">
			<div class="flex flex-col">
				<span class="text-3xl">Posts</span>
				<span class="text-xl text-zinc-400">
					{(data.awarder_karma + data.link_karma).toLocaleString()} karma
				</span>
			</div>
			<div class="ml-auto flex flex-col">
				<span class="text-3xl">Comments</span>
				<span class="text-xl text-zinc-400">{data.comment_karma.toLocaleString()} karma</span>
			</div>
		</div>
	</div>
</div>
