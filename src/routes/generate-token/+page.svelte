<script lang="ts">
  import { writable } from 'svelte/store';

  const apiKey = writable('');
  const tokenData = writable(null);
  const errorMessage = writable('');

  async function generateToken() {
      errorMessage.set('');
      tokenData.set(null);

      try {
          const response = await fetch('/api/generate-token', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ apiKey: $apiKey })
          });

          if (!response.ok) {
              const errorData = await response.json();
              errorMessage.set(errorData.error);
              return;
          }

          const data = await response.json();
          tokenData.set(data);
      } catch (error) {
          errorMessage.set('An error occurred while generating the token.');
          console.error('Error generating token:', error);
      }
  }
</script>

<style>
  .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .container {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 400px;
      width: 100%;
      transform: scale(1);
      transition: transform 0.3s ease-in-out;
  }
  .container:hover {
      transform: scale(1.02);
  }
  .input-group {
      margin-bottom: 1rem;
  }
  .input-group label {
      display: block;
      margin-bottom: 0.5rem;
  }
  .input-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
  }
  .input-group button {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 0.25rem;
      background-color: #4CAF50;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.2s;
  }
  .input-group button:hover {
      background-color: #45a049;
      transform: scale(1.05);
  }
  .input-group button:active {
      background-color: #3e8e41;
  }
  .error-message {
      color: red;
      margin-bottom: 1rem;
  }
  .token-details {
      margin-top: 1rem;
  }
  h2 {
    font-size: 24px;
  }
</style>

<div class="overlay">
  <div class="container">
      <h2>Generate Token</h2>
      <div class="input-group">
          <label for="api-key">Enter Admin Key:</label>
          <input type="text" id="api-key" bind:value={$apiKey} />
      </div>
      <div class="input-group">
          <button on:click={generateToken}>Generate Token</button>
      </div>
      {#if $errorMessage}
          <div class="error-message">{$errorMessage}</div>
      {/if}
      {#if $tokenData}
          <div class="token-details">
              <p><strong>Token:</strong> {$tokenData.token}</p>
              <p><strong>Status:</strong> {$tokenData.status}</p>
              <p><strong>Create Time:</strong> {$tokenData.createTime}</p>
              <p><strong>Expire Time:</strong> {$tokenData.expireTime}</p>
          </div>
      {/if}
  </div>
</div>
