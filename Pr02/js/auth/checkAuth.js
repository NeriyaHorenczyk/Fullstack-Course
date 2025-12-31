// When this script is loaded, check if the user is authenticated

import { fetchUserData, getCurrentUser, storeUserData } from './userdata.js';

function redirectToLogin() {
    window.location.href = '/login.html';
}

function checkAuth() {
    // Check localStorage for authentication token or user info
    const authenticatedUser = getCurrentUser();
    if (!authenticatedUser) {
        redirectToLogin();
        return;
    }

    // Check if the user data exists
    const userData = fetchUserData(authenticatedUser);
    if (!userData || !userData.hashedCreds) {
        redirectToLogin();
        return;
    }

    const currentTime = Date.now();
    if (userData.tokenExpiry && currentTime > userData.tokenExpiry) {
        redirectToLogin();
        return;
    }
    // User is authenticated
    userData.tokenExpiry = currentTime + 60 * 60 * 1000; // Extend expiry by 1 hour
    storeUserData(authenticatedUser, userData);
}

checkAuth();
