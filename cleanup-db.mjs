// cleanup-db.mjs
import { deleteExpiredTokens } from './src/lib/db.mjs';

async function cleanup() {
  try {
    const changes = await deleteExpiredTokens();
    console.log(`Deleted ${changes} expired tokens.`);
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

cleanup();
