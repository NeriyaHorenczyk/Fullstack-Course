// @ts-check
import { hashCredentials } from './utils.js';
/**
 * Logs in a user by verifying their credentials against stored data.
 * @param {string} username
 * @param {string} password
 */
export default async function login(username, password) {
    const hashedCreds = await hashCredentials(username, password);
    // Check if the hashed credentials exist as a key in localStorage
    const storedData = localStorage.getItem(`user:${username}`) || '{}';
    const userData = JSON.parse(storedData);
    if (userData.hashedCreds !== hashedCreds) {
        throw new Error('Invalid username or password');
    }
}
