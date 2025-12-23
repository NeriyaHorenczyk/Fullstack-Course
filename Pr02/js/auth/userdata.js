export default function getUserSummary(username) {
    const storedData = localStorage.getItem(`user:${username}`) || '{}';
    const userData = JSON.parse(storedData);
    return {
        username,
        hasAccount: !!userData.hashedCreds,
    };
}
