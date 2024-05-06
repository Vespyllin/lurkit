<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';

	let { post }: { post: Listing } = $props();
	let expanded = $state(false);

	const getMediaType = (post: Listing, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};

	let imgIndex = $state(0);
</script>

<div class="relative flex justify-center">
	<Carousel.Root class="flex h-[600px] justify-center">
		<Carousel.Content>
			{#each post?.gallery_data?.items ?? [] as gallery_picture}
				<Carousel.Item class="rounded-2xl">
					<div class="-p-4 mx-auto flex h-full items-center justify-center">
						<img
							class="h-full max-h-[600px] w-full object-contain"
							src={`https://i.redd.it/${gallery_picture.media_id}.${getMediaType(post, gallery_picture.media_id)}`}
						/>
					</div>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous
			customClick={() => {
				imgIndex = imgIndex - 1;
			}}
			class="translate-x-12"
		/>
		<Carousel.Next
			customClick={() => {
				imgIndex = imgIndex + 1;
			}}
			class="-translate-x-12"
		/>
	</Carousel.Root>
	<div
		class="absolute bottom-0 mb-1 flex h-fit w-fit items-center justify-center rounded-3xl bg-black bg-opacity-45 px-4 py-1"
	>
		<span class="text-zinc-300">{imgIndex + 1} ∕ {(post?.gallery_data?.items ?? []).length}</span>
	</div>
</div>
