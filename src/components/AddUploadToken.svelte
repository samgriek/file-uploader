<script lang="ts">
    import { onMount } from 'svelte';
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
    .container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 1rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
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
    }
    .input-group button:hover {
      background-color: #45a049;
    }
    .error-message {
      color: red;
      margin-bottom: 1rem;
    }
    .token-details {
      margin-top: 1rem;
    }
  </style>
  
  <div class="container">
    <h2>Generate Upload Token</h2>
    <div class="input-group">
      <label for="api-key">API Key</label>
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
  