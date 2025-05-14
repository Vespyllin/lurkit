<script lang="ts">
	import { page } from '$app/state';
	import {
		fetchUserAbout,
		fetchUserCommented,
		fetchUserOverview,
		fetchUserSubmitted
	} from '$lib/client';
	import FetchMoreStatus from '$lib/components/layout/FetchMoreStatus.svelte';
	import FetchStatus from '$lib/components/layout/FetchStatus.svelte';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import UserBanner from '$lib/components/users/UserBanner.svelte';
	import UserComment from '$lib/components/users/UserComment.svelte';
	import { cn } from '$lib/utils';
	import { useInfiniteQuery, useQuery } from '@sveltestack/svelte-query';

	const {
		params: { username }
	} = page;

	let category = $state<'overview' | 'submitted' | 'comments'>('overview');

	const overviewQuery = useInfiniteQuery(
		[username, 'overview'],
		({ pageParam }: { pageParam?: string }) => fetchUserOverview(username, 50, pageParam),
		{
			getNextPageParam: (lastGroup) =>
				lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name
		}
	);

	const submittedQuery = useInfiniteQuery(
		[username, 'submitted'],
		({ pageParam }: { pageParam?: string }) => fetchUserSubmitted(username, 50, pageParam),
		{
			getNextPageParam: (lastGroup) =>
				lastGroup?.data?.after ?? lastGroup?.data?.children?.at(-1)?.data.name
		}
	);

	const commentedQuery = useInfiniteQuery(
		[username, 'commented'],
		({ pageParam }: { pageParam?: string }) => fetchUserCommented(username, 50, pageParam),
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
			: ($aboutQuery.error ?? `Lurkit - ${username}`)}
	</title>
</svelte:head>

<svelte:window
	onscroll={() => {
		const feedHeight = document.body.offsetHeight - window.innerHeight;
		const remainingPx = feedHeight - window.scrollY;

		if (remainingPx < 1000) {
			if (
				category == 'overview' &&
				$overviewQuery.hasNextPage &&
				!$overviewQuery.isFetching &&
				!$overviewQuery.isError
			) {
				$overviewQuery.fetchNextPage();
			} else if (
				category == 'submitted' &&
				$submittedQuery.hasNextPage &&
				!$submittedQuery.isFetching &&
				!$submittedQuery.isError
			) {
				$submittedQuery.fetchNextPage();
			} else if (
				category == 'comments' &&
				$commentedQuery.hasNextPage &&
				!$commentedQuery.isFetching &&
				!$commentedQuery.isError
			) {
				$commentedQuery.fetchNextPage();
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

		<div class="space-x-2 py-2">
			<Button
				class={cn(
					'min-w-24 rounded-full transition-colors duration-500',
					category == 'overview' ? 'bg-primary' : 'bg-muted'
				)}
				onclick={() => {
					if (category != 'overview') category = 'overview';
				}}
			>
				Overview
			</Button>
			<Button
				class={cn(
					'min-w-24 rounded-full transition-colors duration-500',
					category == 'submitted' ? 'bg-primary' : 'bg-muted'
				)}
				onclick={() => {
					if (category != 'submitted') category = 'submitted';
				}}
			>
				Posts
			</Button>
			<Button
				class={cn(
					'min-w-24 rounded-full transition-colors duration-500',
					category == 'comments' ? 'bg-primary' : 'bg-muted'
				)}
				onclick={() => {
					if (category != 'comments') category = 'comments';
				}}
			>
				Comments
			</Button>
		</div>

		<Separator class="h-0.5" />

		{#if category == 'overview'}
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
		{:else if category == 'submitted'}
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
		{:else if category == 'comments'}
			{#if !$commentedQuery.data && ($commentedQuery.isError || $commentedQuery.isFetching)}
				<FetchStatus
					fetching={$commentedQuery.isFetching}
					error={$commentedQuery.error as string | undefined}
				/>
			{:else}
				{#each $commentedQuery.data?.pages ?? [] as page}
					{#each page.data?.children ?? [] as child}
						<UserComment comment={child.data} />

						<Separator />
					{/each}
				{/each}

				<FetchMoreStatus
					fetching={$commentedQuery.isFetching}
					error={$commentedQuery.error as string | undefined}
				/>
			{/if}
		{/if}
	</div>
{/if}
