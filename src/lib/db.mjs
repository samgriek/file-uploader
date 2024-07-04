// src/lib/db.mjs
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
    filename: './tokens.db',
    driver: sqlite3.Database
});

export async function addToken(token, status, createTime, expireTime) {
    const db = await dbPromise;
    await db.run(
        `INSERT INTO tokens (token, status, create_time, expire_time) VALUES (?, ?, ?, ?)`,
        [token, status, createTime, expireTime]
    );
}

export async function getToken(token) {
    const db = await dbPromise;
    return db.get(`SELECT * FROM tokens WHERE token = ?`, [token]);
}

export async function updateTokenStatus(token, status) {
    const db = await dbPromise;

    console.log(`Token updated ${token}, ${status}`)
    await db.run(
        `UPDATE tokens SET status = ? WHERE token = ?`,
        [status, token]
    );
}

export async function deleteExpiredTokens() {
    const db = await dbPromise;
    await db.run(`DELETE FROM tokens WHERE expire_time < datetime('now')`);
}

export async function validateToken(token) {
    console.log("validate token", token)

    const tokenRecord = await getToken(token);
    console.log("validate tokenRecord", tokenRecord)

    if (!tokenRecord) {
        return { valid: false, message: 'Invalid token' };
    }

    if (tokenRecord.status === 'activated') {
        await updateTokenStatus(token, 'redeemed');
        return { valid: true, message: "valid token"};

    }

    if (tokenRecord.status === 'valid') {
        await updateTokenStatus(token, 'activated');
        return { valid: true, message: "valid token"};
    }

    return { valid: false, message: 'Token already used...' };


}
