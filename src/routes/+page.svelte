<script lang="ts">
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { FeedStore } from '$lib/stores/FeedState.svelte';
	import { onMount } from 'svelte';

	const sleep = async (ms: number) => new Promise((x) => setTimeout(x, ms));
	onMount(async () => {
		if (!FeedStore.data || FeedStore.data.length == 0) await FeedStore.fetchMore();

		const scrollTo = FeedStore.scrollTo;
		if (!scrollTo) return;

		sleep(30).then(() => {
			document.getElementById(scrollTo)?.scrollIntoView(true);
			window.scrollBy({ top: -70 });
		});
	});
</script>

<svelte:window
	on:scroll={async () => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const scrolledPercentage = (window.scrollY / feedHeight) * 100;

		if (!FeedStore.error && !!FeedStore.data && !FeedStore.fetching && scrolledPercentage > 95) {
			FeedStore.fetchMore();
		}
	}}
/>

<svelte:head>
	<title>
		{FeedStore.fetching && !FeedStore.data ? 'Loading...' : (FeedStore.error ?? 'Lurkit')}
	</title>
</svelte:head>

{#if !FeedStore.data}
	<FetchStatus fetching={FeedStore.fetching} error={FeedStore.error} />
{:else}
	{#each FeedStore.data as post, idx}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div id={`${idx}`} onclick={() => FeedStore.setScroll(idx.toString())}>
			<ListingPortal {post} />
		</div>
		<Separator class="my-2" />
	{/each}

	{#if FeedStore.error || FeedStore.fetching}
		<FetchMoreStatus
			fetching={FeedStore.fetching}
			error={FeedStore.error}
			retryFn={FeedStore.fetchMore}
		/>
	{/if}
{/if}
