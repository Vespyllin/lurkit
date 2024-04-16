<script lang="ts">
	import Listing from './listing/Listing.svelte';

	let { data }: { data: { data: SubredditFeedData; reason: string | undefined } } = $props();
	const serverData = data.data;
</script>

<svelte:window
	on:scroll={() => {
		// maybe not nessesary anymore
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.8) {
			// console.log(
			// 	'near end',
			// 	window.innerHeight,
			// 	window.innerHeight + window.scrollY,
			// 	document.body.offsetHeight
			// );
		}
	}}
/>

{#if data.reason}
	<div class="mx-auto w-full items-center justify-center space-y-2 p-32 lg:max-w-5xl">
		<div class="flex flex-col">
			<h1 class="text-center text-3xl">Could not reach Reddit servers</h1>
			<h2 class="text-center text-xl">{data.reason}</h2>
		</div>
	</div>
{:else}
	<div class="mx-auto w-full space-y-2 p-2 lg:max-w-5xl">
		{#each serverData.posts ?? [] as post}
			<div class="flex w-full flex-col gap-2 rounded-2xl bg-zinc-900 p-4 px-6">
				<Listing {post} />
			</div>
		{/each}
	</div>
{/if}
