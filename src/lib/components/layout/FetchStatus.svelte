<script lang="ts">
	import Spinner from './Spinner.svelte';

	let { fetching, error }: { fetching: boolean; error: string | undefined } = $props();
</script>

<div class="mx-auto items-center py-32 text-center lg:max-w-5xl lg:p-32">
	{#if fetching}
		<div class="mb-4 h-fit w-full">
			<Spinner class="mx-auto h-24 w-24" />
		</div>
		<h1 class="text-3xl">Hold on, we're workin' on it...</h1>
	{:else}
		<h1 class="text-3xl text-red-500">Could not reach Reddit servers</h1>
		<h2 class="text-xl">{error}</h2>
	{/if}
</div>
