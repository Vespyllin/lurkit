<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import Listing from '$lib/components/Listing.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { FeedStore } from '$lib/stores/FeedState.svelte';

	const sleep = async (ms: number) => new Promise((x) => setTimeout(x, ms));
	$effect(() => {
		const scrollTo = FeedStore.scrollTo;
		if (!scrollTo) return;

		sleep(30).then(() => {
			document.getElementById(scrollTo)?.scrollIntoView(true);
			window.scrollBy({ top: -80 });
		});
	});
</script>

<svelte:window
	on:scroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const scrolledPercentage = (window.scrollY / feedHeight) * 100;

		if (!!FeedStore.data && !FeedStore.fetching && scrolledPercentage > 95) FeedStore.fetchMore();
	}}
/>

<svelte:head>
	<title>{FeedStore.data ? 'Lurkit' : FeedStore.error}</title>
</svelte:head>

{#if !FeedStore.data}
	<FetchStatus fetching={FeedStore.fetching} error={FeedStore.error} />
{:else}
	{#each FeedStore.data as post, idx}
		<div id={`${idx}`} onclick={() => FeedStore.setScroll(idx.toString())}>
			<Listing {post} />
			<Separator class="mb-6 mt-4" />
		</div>
	{/each}

	{#if FeedStore.error || FeedStore.fetching}
		<FetchMoreStatus fetching={FeedStore.fetching} error={FeedStore.error} />
	{/if}
{/if}
