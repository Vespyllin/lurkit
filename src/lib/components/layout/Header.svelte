<script lang="ts">
	import { goto } from '$app/navigation';

	import FilterMenu from '../filters/FilterMenu.svelte';

	let searchString = $state('');
</script>

<div class="fixed z-20 flex h-14 w-full border-b-2 bg-background p-2 sm:p-8">
	<div class="flex w-full items-center justify-between">
		<a class="flex min-w-fit items-center gap-2" href="/" data-sveltekit-reload>
			<img alt="" src="/favicon.png" class="size-10" />
			<h1 class="text-3xl font-semibold tracking-tight">Lurkit</h1>
		</a>

		<input
			class="h-10 rounded-full border border-input bg-background px-5 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-[32rem]"
			placeholder="Search Lurkit"
			bind:value={searchString}
			onkeydown={(e) => {
				if (e.key == 'Enter' && searchString.length > 0) {
					e.preventDefault();
					goto(`/search/?q=${searchString}`);
				}
			}}
		/>

		<FilterMenu />
	</div>
</div>
