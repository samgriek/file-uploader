// src/routes/api/validate-token/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { validateToken } from '../../../lib/db.mjs';

export const POST: RequestHandler = async ({ request }) => {
  const { token } = await request.json();

  try {
    const { valid, message } = await validateToken(token);

    if (!valid) {
      return json({ valid: false, message: '', error: message }, { status: 400 });
    }

    return json({ valid: true, message: 'Token is valid. You can proceed with the upload.' });
  } catch (error) {
    console.error('Error validating token:', error);
    return json({ error: 'Error validating token' }, { status: 500 });
  }
};
