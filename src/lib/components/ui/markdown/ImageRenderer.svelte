<script lang="ts">
	import { cn } from '$lib/utils';

	let { href }: { href: string } = $props();

	let zoomed = $state(false);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<img
	src={href}
	onclick={() => (zoomed = !zoomed)}
	class={cn('mt-0.5', zoomed ? 'max-w-full cursor-zoom-out' : 'max-h-64 max-w-96 cursor-zoom-in')}
/>
