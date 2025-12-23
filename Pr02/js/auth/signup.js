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
    try {
        await login(username, password);
        throw new Error('User already exists');
    } catch (e) {
        if (!(e instanceof Error) || e.message !== 'Invalid username or password') {
            throw e; // re-throw unexpected errors
        }
        // User does not exist, proceed to create
    }
    localStorage.setItem(`user:${username}`, JSON.stringify({ hashedCreds, email }));
    return login(username, password);
}
