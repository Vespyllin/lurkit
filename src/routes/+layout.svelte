<script lang="ts">
	import '../app.pcss';
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';

	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				retry: 3,
				retryDelay: (failureCount) => 3 ** failureCount * 1000
			}
		}
	});

	let { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main style="font-family: 'Ubuntu'" class="min-h-screen overflow-auto bg-background">
	<QueryClientProvider client={queryClient}>
		<Header />
		<div
			data-sveltekit-preload-data="off"
			class="mx-auto mt-16 max-w-full px-4 py-2 md:max-w-4xl md:px-8"
		>
			{@render children?.()}
		</div>
	</QueryClientProvider>
	<!-- This hidden <div> is here to prevent the "md" class from being discarded by Tailwind treeshaking -->
	<div class="md hidden"></div>
</main>
