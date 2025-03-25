<script lang="ts">
	let { data }: { data: RedditT2Data } = $props();

	const _icon_img = data.icon_img?.split('?')[0];
	const icon_url = !!_icon_img.length ? _icon_img : '/favicon.png';
</script>

<div>
	<div class="relative">
		{#if data.subreddit.banner_img}
			<img
				alt=""
				class="h-40 w-full rounded-md object-cover"
				src={data.subreddit.banner_img.split('?')[0]}
			/>
		{:else}{/if}
		<div class="absolute inset-0 h-full bg-gradient-to-b from-transparent to-background"></div>
	</div>
	<div class="flex">
		<img alt="" class="mr-4 aspect-square h-[5.5rem] rounded-full border-2" src={icon_url} />
		<div>
			<h1 class="text-3xl font-bold">
				{!data.subreddit?.title.length ? data.name : data.subreddit?.title}A
			</h1>
			<h2 class="text-xl text-zinc-200">u/{data.name}</h2>
			<h2 class="text-xl text-zinc-400">
				Created {new Date(data.created_utc * 1000).toDateString()}
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
