// @ts-check
import { hashCredentials } from './utils.js';
import login from './login.js';
/**
 * Registers a new user by storing their hashed credentials in localStorage.
 * @param {string} username
 * @param {string} password
 */
export default async function register(username, password) {
    const hashedCreds = await hashCredentials(username, password);
    // Check if the user already exists
    await login(username, password)
        .catch(() => {})
        .then(() => {
            throw new Error('User already exists');
        });
    localStorage.setItem(`user:${username}`, JSON.stringify({ hashedCreds }));
}
