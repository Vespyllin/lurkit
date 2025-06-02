<script lang="ts">
	import { page } from '$app/state';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';
	import { fetchUserAbout, fetchUserSubmitted } from '$lib/client';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';

	import UserBanner from '$lib/components/users/UserBanner.svelte';
	import UserNavigation from '$lib/components/users/UserNavigation.svelte';

	const {
		params: { username }
	} = page;

	const submittedQuery = useInfiniteQuery(
		[username, 'submitted'],
		({ pageParam }: { pageParam?: string }) => fetchUserSubmitted(username, 50, pageParam),
		{
			getNextPageParam: (lastGroup) =>
				lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name
		}
	);

	const aboutQuery = useQuery([username, 'about'], () => fetchUserAbout(username));
</script>

<svelte:head>
	<title>
		{$submittedQuery.isFetching
			? 'Loading...'
			: ($aboutQuery.error ?? $submittedQuery.error ?? `Lurkit - ${username}`)}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		if (remainingPx < 1000) {
			if ($submittedQuery.hasNextPage && !$submittedQuery.isFetching && !$submittedQuery.isError) {
				$submittedQuery.fetchNextPage();
			}
		}
	}}
/>

{#if $aboutQuery.isFetching}
	<FetchStatus fetching={$aboutQuery.isFetching} error={$aboutQuery.error as string | undefined} />
{:else if !$aboutQuery.data || 'error' in $aboutQuery.data}
	<div class="mx-auto py-24 text-center uppercase">
		<h1 class="text-7xl text-red-600">ERROR: Could not fetch user</h1>
	</div>
{:else}
	<div class="space-y-2">
		<UserBanner data={$aboutQuery.data.data} />

		<UserNavigation category="submitted" {username} />

		{#if !$submittedQuery.data && ($submittedQuery.isError || $submittedQuery.isFetching)}
			<FetchStatus
				fetching={$submittedQuery.isFetching}
				error={$submittedQuery.error as string | undefined}
			/>
		{:else}
			{#each $submittedQuery.data?.pages ?? [] as page}
				{#each page.data?.children ?? [] as child}
					<ListingPortal listing={child.data} />

					<Separator />
				{/each}
			{/each}

			<FetchMoreStatus
				fetching={$submittedQuery.isFetching}
				error={$submittedQuery.error as string | undefined}
			/>
		{/if}
	</div>
{/if}
