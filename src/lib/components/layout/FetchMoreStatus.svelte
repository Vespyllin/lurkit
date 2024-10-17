<script lang="ts">
	import Spinner from './Spinner.svelte';

	let {
		fetching,
		error,
		retryFn
	}: { fetching: boolean; error: string | undefined; retryFn?: () => void } = $props();
</script>

<div class="mx-auto justify-center px-8 text-center lg:max-w-5xl">
	{#if fetching}
		<div class="flex items-center justify-center gap-4">
			<Spinner class="h-8 w-8" />
			<h1 class="text-3xl">More? ok...</h1>
		</div>
	{:else if error}
		<h1 class="text-3xl text-red-500">Could not reach Reddit servers</h1>
		<div class="flex w-full justify-center gap-3">
			<span class="py-1 text-xl">{error}</span>
			{#if retryFn}
				<button
					class="rounded-md px-2 py-1 text-lg text-zinc-400 hover:bg-accent"
					onclick={retryFn}
				>
					Retry
				</button>
			{/if}
		</div>
	{/if}
</div>
