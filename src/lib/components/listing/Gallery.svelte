<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel';

	let { post }: { post: Listing } = $props();

	const getMediaType = (post: Listing, media_id: string) => {
		const mediaType = post?.media_metadata[media_id].m as string; // example: "image/png"
		if (mediaType) return mediaType.substring(mediaType.indexOf('/') + 1);
		else return '';
	};
</script>

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
	<Carousel.Previous class="translate-x-12" />
	<Carousel.Next class="-translate-x-12" />
</Carousel.Root>
