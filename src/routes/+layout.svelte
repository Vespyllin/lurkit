<script>
	import Header from '$lib/components/layout/Header.svelte';
	import '../app.pcss';
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main style="font-family: 'Ubuntu'" class="min-h-screen overflow-auto bg-background">
	<Header />
	<!-- <div class="flex h-screen overflow-y-scroll pt-16"> h-[100lvh-3.5rem]-->
	<div class="scrollbar mt-16 h-[calc(100lvh-4rem)] overflow-y-scroll" id="scroll-container">
		<div class="mx-auto h-full max-w-5xl px-8 py-4">
			<slot />
		</div>
	</div>
</main>
