// @ts-check
import { hashCredentials } from './utils.js';
import { storeUserData, fetchUserData, setUsernameCookie } from './userdata.js';
/**
 * Logs in a user by verifying their credentials against stored data.
 * @param {string} username
 * @param {string} password
 */
export default async function login(username, password, rememberMe = false) {
    const hashedCreds = await hashCredentials(username, password);
    // Check if the hashed credentials exist as a key in localStorage
    const userData = fetchUserData(username);
    if (!userData || !userData.hashedCreds || userData.hashedCreds !== hashedCreds) {
        throw new Error('Invalid username or password');
    }
    userData.tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour from now
    storeUserData(username, userData);
    setUsernameCookie(username);
}
