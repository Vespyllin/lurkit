<script lang="ts">
	import Spinner from './Spinner.svelte';

	let { fetching, error }: { fetching: boolean; error: string | undefined } = $props();
</script>

<div class="mx-auto p-8 text-center lg:max-w-5xl">
	{#if fetching}
		<div class="flex items-center justify-center gap-4">
			<Spinner class="h-8 w-8" />
			<h1 class="text-3xl">More? ok...</h1>
		</div>
	{:else if error}
		<h1 class="text-3xl text-red-500">Could not reach Reddit servers</h1>
		<h2 class="text-xl">{error}</h2>
	{/if}
</div>
