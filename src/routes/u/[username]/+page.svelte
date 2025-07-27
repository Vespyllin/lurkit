<script lang="ts">
	import { page } from '$app/state';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';
	import { fetchUserAbout, fetchUserOverview } from '$lib/client';

	import Separator from '$lib/components/ui/separator/separator.svelte';

	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';

	import UserBanner from '$lib/components/users/UserBanner.svelte';
	import UserComment from '$lib/components/users/UserComment.svelte';
	import UserNavigation from '$lib/components/users/UserNavigation.svelte';

	const {
		params: { username }
	} = page as { params: { username: string } };

	let category = $state<'overview' | 'submitted' | 'comments'>('overview');

	const overviewQuery = useInfiniteQuery(
		[username, 'overview'],
		({ pageParam }: { pageParam?: string }) => fetchUserOverview(username, 50, pageParam),
		{
			getNextPageParam: (lastGroup) =>
				lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name
		}
	);

	const aboutQuery = useQuery([username, 'about'], () => fetchUserAbout(username));
</script>

<svelte:head>
	<title>
		{$aboutQuery.isFetching || $overviewQuery.isFetching
			? 'Loading...'
			: ($aboutQuery.error ?? $overviewQuery.error ?? `Lurkit - ${username}`)}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		if (remainingPx < 1000) {
			if ($overviewQuery.hasNextPage && !$overviewQuery.isFetching && !$overviewQuery.isError) {
				$overviewQuery.fetchNextPage();
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

		<UserNavigation {category} {username} />

		{#if !$overviewQuery.data && ($overviewQuery.isError || $overviewQuery.isFetching)}
			<FetchStatus
				fetching={$overviewQuery.isFetching}
				error={$overviewQuery.error as string | undefined}
			/>
		{:else}
			{#each $overviewQuery.data?.pages ?? [] as page}
				{#each page.data?.children ?? [] as child}
					{#if child.kind == 't1'}
						<UserComment comment={child.data} />
					{:else}
						<ListingPortal inSubreddit listing={child.data} />
					{/if}

					<Separator />
				{/each}
			{/each}

			<FetchMoreStatus
				fetching={$overviewQuery.isFetching}
				error={$overviewQuery.error as string | undefined}
			/>
		{/if}
	</div>
{/if}
