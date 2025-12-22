<script lang="ts">
	import '../app.css';

	import { type Snippet } from 'svelte';

	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import FilterProvider from '$lib/components/providers/FilterProvider.svelte';

	import Header from '$lib/components/layout/Header.svelte';

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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
	<title>Lurkit - Reddit Sucks</title>

	<meta property="og:title" content="Lurkit" />
	<meta property="og:description" content="Reddit Sucks" />
</svelte:head>

<main style="font-family: 'Montserrat'" class="min-h-screen overflow-auto bg-background">
	<QueryClientProvider client={queryClient}>
		<TooltipProvider delayDuration={200}>
			<FilterProvider>
				<Header />
				<div
					data-sveltekit-preload-data="off"
					class="mx-auto mt-12 max-w-full px-4 py-2 sm:mt-16 md:max-w-4xl md:px-8"
				>
					{@render children?.()}
				</div>
			</FilterProvider>
		</TooltipProvider>
	</QueryClientProvider>

	<!-- This hidden <div> is here to prevent the "md" class from being discarded by Tailwind treeshaking -->
	<div class="md hidden"></div>
</main>
