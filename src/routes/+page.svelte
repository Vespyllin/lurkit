<script lang="ts">
	import Feed from '$lib/components/Feed.svelte';

	let { data }: { data: ResultWrapper<FeedData> } = $props();
</script>

<Feed {data} />
