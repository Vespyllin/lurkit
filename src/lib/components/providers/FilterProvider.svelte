<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	import { useQuery } from '@sveltestack/svelte-query';
	import type { Filter } from '$lib/db/filters';

	const filtersQuery = useQuery('filters', async () => {
		const fetchData = await fetch('/api/filters');
		const filterContent = (await fetchData.json()) as Filter[];

		return filterContent;
	});

	setContext('filters', filtersQuery);

	let { children }: { children: Snippet } = $props();
</script>

{@render children?.()}
