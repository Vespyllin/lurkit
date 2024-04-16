<script lang="ts">
	let { text }: { text: string } = $props();

	let para: HTMLDivElement | undefined = $state();

	let collapsed = $state(true);
</script>

<div bind:this={para}>
	{#if (para?.offsetHeight ?? 0) > 200}
		{#if collapsed}
			<div
				class="h-[200px] truncate text-ellipsis whitespace-pre text-wrap break-words rounded-lg text-lg text-gray-300 hover:cursor-pointer hover:bg-zinc-700 hover:opacity-80"
				on:click={() => (collapsed = !collapsed)}
			>
				{text}
			</div>
		{:else}
			<div
				class="whitespace-pre text-wrap break-words rounded-lg text-lg text-gray-300 hover:cursor-pointer hover:bg-zinc-700 hover:opacity-80"
				on:click={() => (collapsed = !collapsed)}
			>
				{text}
			</div>
		{/if}
	{:else}
		<div class="whitespace-pre text-wrap break-words text-lg text-gray-300">
			{text}
		</div>
	{/if}
</div>
