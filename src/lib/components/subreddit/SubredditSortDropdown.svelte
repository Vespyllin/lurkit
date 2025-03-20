<script lang="ts">
	import { CaretDown, Star, Rocket, LightningBolt, DoubleArrowUp, Gear } from 'radix-icons-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { ComponentType } from 'svelte';

	let {
		onChange,
		class: className
	}: {
		class?: string;
		onChange?: (v: any) => void;
	} = $props();

	let sort: string | undefined = $state();
	const sortOptions: {
		option: RedditSubredditSortOptions | 'default';
		icon: ComponentType | undefined;
	}[] = [
		{ option: 'default', icon: Gear },
		{ option: 'top', icon: Star },
		{ option: 'rising', icon: DoubleArrowUp },
		{ option: 'new', icon: LightningBolt },
		{ option: 'hot', icon: Rocket }
	];
</script>

<div class={className}>
	<DropdownMenu.Root preventScroll={false}>
		<div class="flex leading-8">
			<span class="mr-2 text-lg">Sort by:</span>
			<DropdownMenu.Trigger>
				<div class="flex items-center rounded-sm text-zinc-400 hover:text-zinc-300">
					<span class="ml-2 text-lg">{sort ?? 'default'}</span>
					<CaretDown size={18} />
				</div>
			</DropdownMenu.Trigger>
		</div>
		<DropdownMenu.Content class="space-y-0.5 bg-background font-['Montserrat']">
			{#each sortOptions as sortOption}
				<DropdownMenu.Item
					class="cursor-pointer rounded-sm font-normal hover:bg-accent"
					onclick={() => {
						sort = sortOption.option !== 'default' ? sortOption.option : undefined;
						onChange?.(sort);
					}}
				>
					<sortOption.icon class="mr-1" />
					<span>{sortOption.option}</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
