<script lang="ts">
	export let isCodeValid: boolean;
	export let fileInput: HTMLInputElement | null;
	export let handleFileInput: (event: Event) => void;
	export let handleDrop: (event: DragEvent) => void;
	export let handleDragOver: (event: DragEvent) => void;
</script>

<div
	class="upload-area border-2 border-dashed border-gray-300 p-6 text-center rounded-lg mb-4"
	role="button"
	class:cursor-not-allowed={!isCodeValid}
	on:click={() => isCodeValid && fileInput?.click()}
	on:dragover|preventDefault={handleDragOver}
	on:drop|preventDefault={handleDrop}
>
	<p class="text-gray-500 mb-2">Drag and drop a file here, or</p>
	<input
		type="file"
		on:change={handleFileInput}
		class="hidden"
		bind:this={fileInput}
		disabled={!isCodeValid}
	/>
	<button
		class="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-200"
		disabled={!isCodeValid}
	>Select File</button>
</div>

<style>
	.upload-area {
		transition: border-color 0.3s, background-color 0.3s;
	}
	.upload-area.dragover {
		border-color: #3182ce;
		background-color: #ebf8ff;
	}
	button:disabled {
		background-color: #a0aec0;
		cursor: not-allowed;
	}
</style>
