// @ts-check
import { hashCredentials } from './utils.js';
import login from './login.js';
/**
 * Registers a new user by storing their hashed credentials in localStorage.
 * @param {string} username
 * @param {string} password
 * @param {string} email
 */
export default async function register(username, password, email) {
    const hashedCreds = await hashCredentials(username, password);
    // Check if the user already exists
    if (userExists(username)) throw new Error('User already exists');

    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour from now
    localStorage.setItem(`user:${username}`, JSON.stringify({ hashedCreds, email, tokenExpiry }));
    return login(username, password);
}

/** * Checks if a user with the given username already exists.
 * @param {string} username
 * @returns {boolean}
 */
export function userExists(username) {
    const storedData = localStorage.getItem(`user:${username}`);
    return !!storedData;
}
