<script lang="ts">
	import { CaretDown } from 'radix-icons-svelte';
	import * as DropdownMenu from './ui/dropdown-menu';

	let { sort = $bindable(), class: className }: { sort: RedditSortOptions; class?: string } =
		$props();
</script>

<div class={className}>
	<DropdownMenu.Root preventScroll={false}>
		<div class="flex leading-8">
			<span class="mr-2 text-lg">Sort by:</span>
			<DropdownMenu.Trigger>
				<div
					class="flex items-center rounded-sm text-zinc-400 hover:bg-zinc-800 hover:bg-opacity-55"
				>
					<span class="ml-2 text-lg">{sort}</span>
					<CaretDown size={18} />
				</div>
			</DropdownMenu.Trigger>
		</div>
		<DropdownMenu.Content class="bg-background font-['Ubuntu']">
			<DropdownMenu.Item onclick={() => (sort = 'top')}>top</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => (sort = 'controversial')}>controversial</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => (sort = 'new')}>new</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => (sort = 'hot')}>hot</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => (sort = 'random')}>random</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
