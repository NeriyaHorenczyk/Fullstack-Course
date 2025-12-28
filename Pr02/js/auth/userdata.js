export default function getUserSummary(username) {
    const storedData = localStorage.getItem(`user:${username}`) || '{}';
    const userData = JSON.parse(storedData);
    return {
        username,
        hasAccount: !!userData.hashedCreds,
    };
}

export function storeUserData(username, data) {
    const storedData = localStorage.getItem(`user:${username}`) || '{}';
    const userData = JSON.parse(storedData);
    const updatedData = { ...userData, ...data };
    localStorage.setItem(`user:${username}`, JSON.stringify(updatedData));
}

export function fetchUserData(username) {
    const storedData = localStorage.getItem(`user:${username}`);
    if (!storedData) return null;
    return JSON.parse(storedData);
}
