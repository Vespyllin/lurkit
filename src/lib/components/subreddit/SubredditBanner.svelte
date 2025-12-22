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
				class="h-20 w-full rounded-md bg-secondary"
				style="background-color: {data.primary_color};"
			></div>
		{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>

	<div class="flex">
		<img
			alt=""
			class="mr-4 aspect-square h-16 rounded-full border-2"
			style="border-color: {data.key_color};"
			src={icon_url}
		/>

		<div class="flex w-full">
			<div>
				<h1 class="text-3xl font-bold">r/{data.display_name}</h1>
				<div class="flex gap-2">
					<div class="flex items-center gap-1 text-lg text-zinc-400">
						<span>
							Active since {new Date(data.created_utc * 1000).getFullYear()}
						</span>
						{#if data.subreddit_type !== 'public'}
							<h1 class={cn('lowercase', data.subreddit_type !== 'private' && 'text-red-600')}>
								({data.subreddit_type ?? 'Untyped'})
							</h1>
						{/if}
					</div>
				</div>
			</div>

			<div class="mb-auto ml-auto flex h-fit gap-6">
				<div class="ml-auto flex flex-col">
					<span class="text-2xl text-zinc-300">Subscribers</span>
					<span class="ml-auto text-xl" style="color: {data.key_color};">
						{data.subscribers?.toLocaleString()}
					</span>
				</div>

				<div class="flex flex-col">
					<div class="flex items-center">
						<div class="ml-1.5 mr-0.5 h-2 w-2 rounded-full bg-green-600"></div>
						<span class="text-2xl text-zinc-300"> Online </span>
					</div>
					<span class="ml-auto text-xl" style="color: {data.primary_color};">
						{data.active_user_count?.toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="md mt-2 text-zinc-300">
		<Markdown text={data.public_description} />
	</div>
</div>
