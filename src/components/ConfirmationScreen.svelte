<script lang="ts">
	export let message: string;
	export let handleConfirmation: () => void;
</script>

<div class="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
	<div class="modal-content bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
		<p class="mb-6">{message}</p>
		<button class="bg-blue-500 text-white px-4 py-2 rounded w-full transition-colors duration-200 hover:bg-blue-600" on:click={handleConfirmation}>OK</button>
	</div>
</div>

<style>
	.modal-overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(31, 41, 55, 0.8); /* bg-gray-800 bg-opacity-50 */
		z-index: 50; /* Ensure it appears above other elements */
	}

	.modal-content {
		background-color: white;
		border-radius: 0.5rem; /* rounded-lg */
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); /* shadow-lg */
		padding: 1.5rem; /* p-6 */
		max-width: 28rem; /* max-w-md */
		width: 100%;
	}

	/* Button */
	.bg-blue-500 {
		background-color: #3b82f6; /* Tailwind's bg-blue-500 */
		color: white;
		padding: 0.5rem 1rem; /* px-4 py-2 */
		border-radius: 0.25rem; /* rounded */
		width: 100%;
		transition: background-color 0.2s ease-in-out; /* transition-colors duration-200 */
	}

	.bg-blue-500:hover {
		background-color: #2563eb; /* Tailwind's hover:bg-blue-600 */
	}

	/* Centered text */
	.text-center {
		text-align: center;
	}

	/* Spacing utilities */
	.mb-4 {
		margin-bottom: 1rem;
	}

	.mb-6 {
		margin-bottom: 1.5rem;
	}
</style>
