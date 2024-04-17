<script>
	import Header from '$lib/components/layout/Header.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import '../app.pcss';
</script>

<main>
	<Header />
	<div class="flex pt-16">
		<Sidebar />
		<div class="w-full py-4">
			<slot />
		</div>
	</div>
</main>
