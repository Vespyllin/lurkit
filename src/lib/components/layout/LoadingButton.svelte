<script lang="ts">
	import type { ButtonProps } from '../ui/button';
	import Button from '../ui/button/button.svelte';
	import Spinner from './Spinner.svelte';

	let { onclick, children, ...restProps }: ButtonProps & { onclick: () => Promise<any> } = $props();

	let loading = $state(false);
</script>

<Button
	{...restProps}
	disabled={loading}
	onclick={async () => {
		loading = true;
		await onclick();
		loading = false;
	}}
>
	{#if loading}
		<Spinner />
	{:else}
		{@render children?.()}
	{/if}
</Button>
