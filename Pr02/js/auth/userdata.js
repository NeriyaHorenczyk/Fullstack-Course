export function storeUserData(username, data) {
    setUsernameCookie(username);
    const storedData = localStorage.getItem(`user:${username}`) || '{}';
    const userData = JSON.parse(storedData);
    const updatedData = { ...userData, ...data };
    localStorage.setItem(`user:${username}`, JSON.stringify(updatedData));
}

export function storeCurrentUserData(data) {
    const username = getCurrentUser();
    if (!username) return;
    storeUserData(username, data);
}

export function fetchUserData(username) {
    const storedData = localStorage.getItem(`user:${username}`);
    if (!storedData) return null;
    return JSON.parse(storedData);
}

export function fetchCurrentUserData() {
    const username = getCurrentUser();
    if (!username) return null;
    return fetchUserData(username);
}

export function getCurrentUser() {
    return getCurrentUserFromCookie();
}

export function setUsernameCookie(username) {
    const oneHour = 60 * 60 * 1000; // milliseconds
    const expires = new Date(Date.now() + oneHour).toUTCString();

    document.cookie = `username=${encodeURIComponent(username)}; expires=${expires}; path=/`;
}

function getCurrentUserFromCookie() {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'username') {
            return decodeURIComponent(value);
        }
    }

    return null; // cookie not found
}

export function logoutCurrentUser() {
    // Clear the username cookie
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    // Also clear from localStorage
    window.location.href = '/login.html';
}
