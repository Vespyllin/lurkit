<script>
	import Header from '$lib/components/layout/Header.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import '../app.pcss';
</script>

<main>
	<Header />
	<div class="flex pt-16">
		<Sidebar />
		<div class="mx-auto px-8 py-4 lg:max-w-6xl">
			<slot />
		</div>
		<div class="hidden w-64 min-w-48 xl:block"></div>
	</div>
</main>
