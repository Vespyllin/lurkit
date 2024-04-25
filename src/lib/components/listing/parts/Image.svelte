<script lang="ts">
	let { url }: { url: string } = $props();
</script>

<div class="flex items-center justify-center">
	<img src={url} class="mx-32 max-h-[600px] object-contain" />
</div>
