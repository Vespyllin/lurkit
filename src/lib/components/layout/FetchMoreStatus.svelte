<script lang="ts">
	import { cn } from '$lib/utils';
	import Spinner from './Spinner.svelte';

	let {
		class: className,
		fetching,
		error,
		retryFn
	}: {
		class?: string;
		fetching: boolean;
		error: string | undefined;
		retryFn?: () => void;
	} = $props();
</script>

<div class={cn('mx-auto justify-center py-4 text-center md:max-w-5xl', className)}>
	{#if fetching}
		<div class="flex items-center justify-center gap-4">
			<Spinner class="size-8" />
			<h1 class="text-3xl">More? ok...</h1>
		</div>
	{:else if error}
		<h1 class="text-3xl text-red-500">Could not reach Reddit servers</h1>
		<div class="flex w-full justify-center gap-3">
			<span class="py-1 text-xl">{error}</span>
			{#if retryFn}
				<button
					class="rounded-md px-2 py-1 text-lg text-zinc-400 hover:bg-secondary"
					onclick={retryFn}
				>
					Retry
				</button>
			{/if}
		</div>
	{/if}
</div>
