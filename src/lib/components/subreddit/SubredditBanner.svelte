<script lang="ts">
	import { cn } from '$lib/utils';
	import Markdown from '../media/Markdown.svelte';

	const { data, class: classList }: { data: RedditT5Data; class?: string } = $props();

	const icon_url =
		(data.community_icon?.split('?')[0] ?? '').length > 0
			? data.community_icon?.split('?')[0]
			: (data.icon_img ?? '').length > 0
				? data.icon_img
				: '/favicon.png';
</script>

<div class={classList}>
	<div class="relative">
		{#if data.banner_background_image}
			<img
				alt=""
				class="h-40 w-full rounded-md object-cover"
				src={data.banner_background_image.split('?')[0]}
			/>
		{:else}
			<div
				class="h-28 w-full rounded-md bg-secondary"
				style="background-color: {data.primary_color};"
			></div>
		{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>

	<div class="flex h-[5.5rem]">
		<img
			alt=""
			class="mr-4 aspect-square h-full rounded-full border-2"
			style="border-color: {data.key_color};"
			src={icon_url}
		/>

		<div>
			<h1 class="text-3xl font-bold">r/{data.display_name}</h1>
			<h2 class="text-xl text-zinc-200">
				Active since {new Date(data.created_utc * 1000).getFullYear()}
			</h2>

			<div class="flex gap-3">
				<div>
					<span class="font-medium" style="color: {data.key_color};">
						{data.subscribers?.toLocaleString()}
					</span>
					<span class="text-zinc-300">Subscribers</span>
				</div>

				<div class="flex">
					<span class="font-medium" style="color: {data.primary_color};">
						{data.active_user_count?.toLocaleString()}
					</span>
					<div class="flex items-center">
						<div class="ml-1.5 mr-0.5 h-2 w-2 rounded-full bg-green-600"></div>
						<span class="text-zinc-300"> Online </span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-2 border-l-4 pl-2 text-zinc-300">
		<Markdown text={data.public_description} />
	</div>
</div>

{#if data.subreddit_type !== 'public'}
	<h1
		class={cn(
			'text-4xl font-semibold capitalize',
			data.subreddit_type !== 'private' && 'text-red-600'
		)}
	>
		-- {data.subreddit_type} Subreddit --
	</h1>
{/if}
