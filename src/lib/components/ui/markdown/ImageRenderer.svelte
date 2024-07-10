<script lang="ts">
	import Image from '$lib/components/media/Image.svelte';

	let { href }: { href: string } = $props();
</script>

<Image url={href} class="w-fit" />
