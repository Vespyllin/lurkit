<script lang="ts">
	import Feed from '$lib/components/Feed.svelte';

	let { data }: { data: { data: SubredditFeedData; reason: string | undefined } } = $props();
</script>

<Feed {data} />
