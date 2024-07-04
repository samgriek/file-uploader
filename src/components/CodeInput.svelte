<script lang="ts">
	import { writable } from 'svelte/store';

	export let isValidating = writable(false);
	export let code = writable(Array(6).fill(''));
	export let validateCode: () => void;

	const codeRefs: HTMLInputElement[] = [];

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
				validateCode();
			}
		}
	}

	function handlePaste(event: ClipboardEvent) {
		const paste = (event.clipboardData || window.clipboardData).getData('text');
		if (/^\d{6}$/.test(paste)) {
			code.set(paste.split(''));
			validateCode();
		}
	}
</script>

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
					disabled={$isValidating}
				/>
				{#if index === 2}
					<span class="mx-1">-</span>
				{/if}
			</div>
		{/each}
	</div>
	{#if $isValidating}
		<div class="flex justify-center mt-2">
			<img src="../favicon.png" alt="Validating..." class="spinner"/>
		</div>
	{/if}
</div>

<style>
	.code-inputs {
		display: flex;
		justify-content: center;
	}
	.code-input-wrapper {
		display: flex;
		align-items: center;
	}
	.spinner {
		width: 150px;
		height: 150px;
		animation: spin 2s linear infinite;
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
