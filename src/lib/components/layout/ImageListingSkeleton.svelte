<script>
	import { Skeleton } from '../ui/skeleton';
</script>

<div class="space-y-3 p-2">
	<div class="flex items-center gap-2">
		<Skeleton class="size-5 rounded-full" />
		<Skeleton class="h-4 w-2/3 rounded-full" />
	</div>
	<Skeleton class="h-8 w-full rounded-full" />
	<Skeleton class="mx-auto h-[600px] w-4/5 rounded-md" />
	<Skeleton class="h-7 w-48 rounded-full" />
</div>
