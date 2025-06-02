<script lang="ts">
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import Button from '../ui/button/button.svelte';

	const {
		category,
		username
	}: { category: 'overview' | 'submitted' | 'comments'; username: string } = $props();
</script>

<div class="space-x-2 py-2">
	<Button
		class={cn(
			'min-w-24 rounded-xl transition-colors duration-500 hover:bg-accent/60',
			category == 'overview' ? 'bg-primary/90' : 'bg-muted'
		)}
		onclick={() => {
			if (category != 'overview') goto(`/u/${username}`, { replaceState: true });
		}}
	>
		Overview
	</Button>
	<Button
		class={cn(
			'min-w-24 rounded-xl transition-colors duration-500 hover:bg-accent/60',
			category == 'submitted' ? 'bg-primary/90' : 'bg-muted'
		)}
		onclick={() => {
			if (category != 'submitted') goto(`/u/${username}/submitted`, { replaceState: true });
		}}
	>
		Posts
	</Button>
	<Button
		class={cn(
			'min-w-24 rounded-xl transition-colors duration-500 hover:bg-accent/60',
			category == 'comments' ? 'bg-primary/90' : 'bg-muted'
		)}
		onclick={() => {
			if (category != 'comments') goto(`/u/${username}/comments`, { replaceState: true });
		}}
	>
		Comments
	</Button>
</div>
