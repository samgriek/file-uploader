// src/routes/api/generate-token/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { addToken } from '../../../lib/db.mjs';
import { customAlphabet } from 'nanoid';
import { env } from '$env/dynamic/private';


const nanoid = customAlphabet('1234567890', 6);

// Load VALID_API_KEY from environment variable
const VALID_API_KEY = env.PRIVATE_VALID_API_KEY;

export const POST: RequestHandler = async ({ request }) => {
  const { apiKey } = await request.json();

  if (apiKey !== VALID_API_KEY) {
    return json({ error: 'Invalid API key' }, { status: 401 });
  }

  const token = nanoid();
  const status = 'valid';
  const createTime = new Date().toISOString();
  const expireTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days in the future

  try {
    await addToken(token, status, createTime, expireTime);
    return json({ token, status, createTime, expireTime });
  } catch (error) {
    console.error('Error generating token:', error);
    return json({ error: 'Error generating token' }, { status: 500 });
  }
};
