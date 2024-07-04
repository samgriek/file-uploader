<script lang="ts">
	import { writable } from 'svelte/store';

	export let fileList = writable<File[]>([]);
	export let removeFile: (index: number) => void;
</script>

<div class="file-list mb-4">
	{#each $fileList as file, index (file.name)}
		<div class="flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
			<span>{file.name}</span>
			<button class="text-red-500 hover:text-red-700" on:click={() => removeFile(index)}>✕</button>
		</div>
	{/each}
</div>
