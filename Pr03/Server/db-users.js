
const DBUsers = (() => {

    const STORAGE_KEY = 'cm_users';


    // Private helper functions


    function _load(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to load users from localStorage:', e);
            return [];
        }
    }

    function _save(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    function _generateId() {
        return 'u_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }

    function _hashPassword(password) {
        // Simple hash for demonstration (DO NOT use in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            hash = ((hash << 5) - hash) + password.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }

    function _safeUser(user) {
        const {passwordHash, ...safe} = user;
        return safe;
    }


    // Public API

    function getAllUsers(){
        return _load().map(_safeUser);
    }

    function getUserById(id) {
        const user = _load().find(u => u.id === id);
        return user ? _safeUser(user) : null;
    }

    function getUserByUsername(username) {
        const user = _load().find(u => u.username.toLowerCase() === username.toLowerCase());
        return user ? _safeUser(user) : null;
    }

    function getUserByEmail(email) {
        const user = _load().find(u => u.email.toLowerCase() === email.toLowerCase());
        return user ? _safeUser(user) : null;
    }

    function addUser(username, password, email) {
        const users = _load();
        const newUser = {
            id: _generateId(),
            username: username,
            passwordHash: _hashPassword(password),
            email: email,
            createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        _save(users);
        console.log(`User "${username}" registered successfully.`);
        return _safeUser(newUser);
    }

    function authenticate(username, password) {
        const users = _load();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) return null;

        if (user.passwordHash !== _hashPassword(password)) return null;

        console.log(`User "${username}" authenticated successfully.`);
        return _safeUser(user);
    }

    function removeUser(id) {
        const users = _load();
        const index = users.findIndex(u => u.id === id);

        if (index === -1) return false;
        users.splice(index, 1); // Remove user
        _save(users);
        console.log(`User with ID "${id}" removed successfully.`);
        return true;
    }

    // Return the public API
    return {
        getAllUsers,
        getUserById,
        getUserByUsername,
        getUserByEmail,
        addUser,
        authenticate,
        removeUser
    };

})();