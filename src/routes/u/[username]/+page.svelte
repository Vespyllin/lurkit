<script lang="ts">
	import { page } from '$app/stores';
	import { fetchUserOverview } from '$lib/client';
	import ListingPortal from '$lib/components/listing/ListingPortal.svelte';
	import UserComment from '$lib/components/users/UserComment.svelte';
	import { useQuery } from '@sveltestack/svelte-query';

	const {
		params: { username }
	} = $page;

	const aboutQuery = useQuery(username, () => fetchUserOverview(username));
	const userQuery = useQuery(username + 'overview', () => fetchUserOverview(username));
</script>

<svelte:head>
	<title>
		{username}
	</title>
</svelte:head>

<div class="space-y-1">
	{#each $userQuery.data?.data.children ?? [] as child}
		<div>
			{#if child.kind == 't1'}
				<!-- <UserComment comment={child.data} /> -->
			{:else if child.kind == 't3'}
				<ListingPortal listing={child.data} />
			{:else}
				Unhandled submission type: {(child as any).kind}
			{/if}
		</div>
	{/each}
</div>
