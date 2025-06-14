<script lang="ts">
	import { getTimeAgo } from '$lib';

	import * as HoverCard from '../ui/hover-card';

	let {
		created_utc,
		edited,
		class: className
	}: { created_utc: number; edited?: boolean | number; class?: string } = $props();

	const formatDate = (date_utc: number) => {
		const date = new Date(date_utc * 1000);
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const dayName = days[date.getDay()];
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		return `${dayName}, ${day}/${month}/${year} at ${hours}:${minutes}:${seconds}`;
	};
</script>

<HoverCard.Root>
	<HoverCard.Trigger class={className}>
		<span class="hidden text-zinc-400 md:inline">
			{getTimeAgo(created_utc)}{#if edited}
				*
			{/if}
		</span>
		<span class="text-zinc-400 md:hidden">
			{getTimeAgo(created_utc, true)}{#if edited}
				*
			{/if}
		</span>
	</HoverCard.Trigger>
	<HoverCard.Content class="size-fit bg-black p-1 px-1.5 text-sm">
		<p>
			{#if edited}
				<span class="font-semibold text-zinc-100">Submitted:</span>
			{/if}
			<span class="text-zinc-200">{formatDate(created_utc)}</span>
		</p>

		{#if edited && edited !== true}
			<p>
				<span class="font-semibold text-zinc-100">Edited:</span>
				<span class="text-zinc-200">{formatDate(edited)}</span>
			</p>
		{/if}
	</HoverCard.Content>
</HoverCard.Root>
