<script lang="ts">
	import Listing from './listing/Listing.svelte';

	let { data }: { data: ResultWrapper<FeedData> } = $props();
</script>

{#if data.status == 'FAIL' || data.status == 'INTERNAL'}
	<div class="mx-auto w-full items-center justify-center p-32 lg:max-w-5xl">
		<h1 class="text-center text-3xl">Could not reach Reddit servers</h1>
		<h2 class="text-center text-xl">{data.reason}</h2>
	</div>
{:else if data.status == 'OK'}
	<div class="mx-auto w-full space-y-2 lg:max-w-5xl">
		{#each data.data.posts ?? [] as post}
			<div class="flex w-full flex-col gap-2 rounded-2xl bg-zinc-900 p-4 px-6">
				<Listing {post} />
			</div>
		{/each}
	</div>
{/if}
