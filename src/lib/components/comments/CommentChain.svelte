<script lang="ts">
	import { cn } from '$lib/utils';
	import Comment from './Comment.svelte';

	const { comments, root }: { comments: PostComments; root?: boolean } = $props();
</script>

<div class={cn('flex flex-col', !!root ? 'gap-5' : 'gap-3')}>
	{#each comments as parent}
		<Comment comment={parent} />
	{/each}
</div>
