<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, derived, get } from 'svelte/store';

	let fileInput: HTMLInputElement | null = null;
	const fileList = writable<File[]>([]);
	const code = writable(Array(6).fill(''));
	const isCodeValid = writable(false);
	const isValidating = writable(false);
	const isUploading = writable(false);
	const codeRefs: HTMLInputElement[] = [];

	// Derived store for isUploadDisabled
	const isUploadDisabled = derived([fileList, isCodeValid, isUploading], ([$fileList, $isCodeValid, $isUploading]) => {
		return $fileList.length === 0 || !$isCodeValid || $isUploading;
	});

	// Handle file input change
	function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			fileList.set(Array.from(input.files));
			input.value = ''; // Clear the input value
		}
	}

	// Handle file drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer && event.dataTransfer.files) {
			fileList.set(Array.from(event.dataTransfer.files));
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	// Remove a file from the list
	function removeFile(index: number) {
		fileList.update((files) => {
			files.splice(index, 1);
			return [...files];
		});
	}

	// Upload files to the server
	async function uploadFile() {
		isUploading.set(true);
		const files = get(fileList);
		const token = get(code).join('');
		for (const file of files) {
			try {
				const response = await fetch('/api/get-presigned-url', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						fileName: file.name,
						fileType: file.type,
						token: token // Pass the token here
					})
				});

				if (!response.ok) {
					throw new Error('Failed to get presigned URL');
				}

				const { url } = await response.json();

				const uploadResponse = await fetch(url, {
					method: 'PUT',
					body: file,
					headers: {
						'Content-Type': file.type
					}
				});

				if (uploadResponse.ok) {
					console.log('File uploaded successfully');
					alert(
						'File uploaded successfully. We will email you when processing is complete. You will be redirected...'
					);
					window.location.href = 'https://www.eagleyes.ai';
				} else {
					throw new Error('Failed to upload file');
				}
			} catch (error) {
				console.error('Error uploading file:', error);
				alert('Error uploading file. You will be redirected.');
				window.location.href = 'https://www.eagleyes.ai';
			}
		}
		fileList.set([]); // Clear the file list after upload
		isUploading.set(false);
	}

	// Validate the entered code
	async function validateCode() {
		const codeValue = get(code).join('');

		try {
			const response = await fetch('/api/validate-token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token: codeValue })
			});

			const result = await response.json();

			if (response.ok) {
				isCodeValid.set(true);
				isValidating.set(false);
			} else {
				throw new Error(result.error || 'Invalid code');
			}
		} catch (error) {
			isCodeValid.set(false);
			alert(`${error.message} Redirecting to support...`);
			isValidating.set(false);
			setTimeout(() => {
				window.location.href = 'https://www.eagleyes.ai';
			}, 10000); // 10 seconds delay for the user to read the message
		}
	}

	// Handle code input changes
	function handleInput(event: Event, index: number) {
		const input = event.target as HTMLInputElement;
		const value = input.value;

		if (value.length === 1) {
			code.update((c) => {
				c[index] = value;
				return c;
			});
			if (index < 5) {
				codeRefs[index + 1].focus();
			} else {
				isValidating.set(true);
				validateCode();
			}
		}
	}

	// Handle code paste
	function handlePaste(event: ClipboardEvent) {
		const paste = (event.clipboardData || window.clipboardData).getData('text');
		if (/^\d{6}$/.test(paste)) {
			code.set(paste.split(''));
			isValidating.set(true);
			validateCode();
		}
	}

	// Setup drag and drop event listeners
	onMount(() => {
		const uploadArea = document.querySelector('.upload-area');
		if (uploadArea) {
			uploadArea.addEventListener('dragover', handleDragOver);
			uploadArea.addEventListener('drop', handleDrop);
		}
		return () => {
			if (uploadArea) {
				uploadArea.removeEventListener('dragover', handleDragOver);
				uploadArea.removeEventListener('drop', handleDrop);
			}
		};
	});
</script>

<div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
	<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transform transition-transform duration-300">
		<h4 class="text-xl font-semibold mb-4 text-center">
			Confirm key and upload...
		</h4>
		<div class="mb-4 text-center">
			<p>Please enter the 6-digit code sent to your email:</p>
			<div class="code-inputs" on:paste={handlePaste}>
				{#each $code as digit, index}
					<div class="code-input-wrapper">
						<input
							type="text"
							maxlength="1"
							class="w-12 h-12 text-center border rounded mx-1"
							bind:value={$code[index]}
							on:input={(event) => handleInput(event, index)}
							bind:this={codeRefs[index]}
						/>
						{#if index === 2}
							<span class="mx-1">-</span>
						{/if}
					</div>
				{/each}
			</div>
			{#if $isValidating}
				<div class="flex justify-center mt-2">
					<div class="spinner"></div>
				</div>
			{/if}
		</div>
		<div
			class="upload-area border-2 border-dashed border-gray-300 p-6 text-center rounded-lg mb-4"
			role="button"
			class:cursor-not-allowed={!$isCodeValid}
			on:click={() => $isCodeValid && fileInput?.click()}
			on:dragover|preventDefault={handleDragOver}
			on:drop|preventDefault={handleDrop}
		>
			<p class="text-gray-500 mb-2">Drag and drop a file here, or</p>
			<input
				type="file"
				on:change={handleFileInput}
				class="hidden"
				bind:this={fileInput}
				disabled={!$isCodeValid}
			/>
			<button
				class="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-200 hover:bg-blue-600 active:bg-blue-700"
				disabled={!$isCodeValid}>Select File</button>
		</div>
		<div class="file-list mb-4">
			{#each $fileList as file, index (file.name)}
				<div class="flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-2">
					<span>{file.name}</span>
					<button class="text-red-500 hover:text-red-700" on:click={() => removeFile(index)}>✕</button>
				</div>
			{/each}
		</div>
		<button
			class="bg-green-500 text-white w-full py-2 rounded transition-colors duration-200 hover:bg-green-600 active:bg-green-700"
			on:click={uploadFile}
			disabled={$isUploadDisabled}
			class:cursor-not-allowed={$isUploadDisabled}>
			{#if $isUploading}
				<div class="flex justify-center items-center">
					<div class="spinner mr-2"></div>Uploading...
				</div>
			{:else}
				Upload
			{/if}
		</button>
	</div>
</div>

<style>
	.upload-area {
		transition:
			border-color 0.3s,
			background-color 0.3s;
	}
	.upload-area.dragover {
		border-color: #3182ce;
		background-color: #ebf8ff;
	}
	button:disabled {
		background-color: #a0aec0;
		cursor: not-allowed;
	}
	.code-inputs {
		display: flex;
		justify-content: center;
	}
	.code-input-wrapper {
		display: flex;
		align-items: center;
	}
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: #4b9cd3;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
