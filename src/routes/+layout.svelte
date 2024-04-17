<script>
	import Header from '$lib/components/layout/Header.svelte';
	import '../app.pcss';
</script>

<main class="py-2">
	<Header />
	<slot />
</main>
