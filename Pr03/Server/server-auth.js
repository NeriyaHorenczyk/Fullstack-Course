// Handles Registration, Login, and Logout requests from the client. Uses the db-users module to manage user accounts.

const AuthServer = (() => {
    
    const ADDRESS = 'auth-server'; // name we register with the Network
    const SESSION_KEY = 'cm_sessions'; // local storage key for session data

    // Session Management

    function _loadSessions() {

        try {
            const raw = localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            console.error('Failed to load sessions from localStorage:', e);
            return {};
        }
    }

    function _saveSessions(sessions) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    }

    function _generateToken() {
        return 'tok_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10); //Example: "tok_1704067200000_k9x2m"
    }

    function _createSession(userId) {
        const sessions = _loadSessions();
        const token = _generateToken();

        sessions[token] = {
            userId: userId,
            createdAt: new Date().toISOString()
        };
        _saveSessions(sessions);
        return token;
    }

    function validateToken(token) {

        if (!token) return null; // No token provided

        const sessions = _loadSessions();
        const session = sessions[token];

        return session ? session.userId : null; // Return userId if valid, or null if invalid
    }

    function _deleteSession(token) {
        const sessions = _loadSessions();
        delete sessions[token];
        _saveSessions(sessions);
        console.log(`Session with token ${token} deleted.`);
    }

    // REQUEST HANDLER
    // This is the function we register with the Network.
    // The Network calls this every time a message arrives
    // addressed to "auth-server".

    function _handle(envelope) {
        const { method, resource, id, body } = envelope.payload;
        console.log(`[AuthServer] Received request: ${method} ${resource} ${id || ''}`);

        let response;

        if (method === 'POST' && resource === 'users') response = _handleRegister(body);
        else if (method === 'POST' && resource === 'login') response = _handleLogin(body);
        else if (method === 'DELETE' && resource === 'login') response = _handleLogout(body);
        else response = { status: 404, message: 'Endpoint not found' };

        Network.respond({
            onDeliver: envelope.onDeliver,
            onDrop: envelope.onDrop,
            response: response,
        });
    }

    function _handleRegister(body) {

        // Validate body
        if (!body) return { status: 400, message: 'Missing request body' };

        const { username, password, email } = body;

        // Basic validation
        if (!username) return { status: 400, message: 'Username is required' };
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: 400, message: 'Valid email is required' };
        if (!password || password.length < 6) return { status: 400, message: 'Password must be at least 6 characters' };


        // Check for existing username or email
        if (DBUsers.getUserByUsername(username.trim())) {
            return { status: 409, message: 'Username already exists' };
        }
        if (DBUsers.getUserByEmail(email.trim())) {
            return { status: 409, message: 'Email already registered' };
        }

        // Create new user
        const newUser = DBUsers.addUser(username.trim(), password, email.trim());
        
        console.log(`[AuthServer] User registered: ${newUser.username} (ID: ${newUser.id})`);

        return { status: 201, message: 'User registered successfully' };

    }

    function _handleLogin(body) {

        // Validate body
        if (!body) return { status: 400, message: 'Missing request body' };

        const { username, password } = body;

        if (!username || !password) {
            return { status: 400, message: 'Username and password are required' };
        }

        const user = DBUsers.authenticate(username.trim(), password);

        if (!user) {
            console.warn(`[AuthServer] Failed login attempt for username: "${username.trim()}"`);
            return { status: 401, message: 'Invalid username or password' };
        }

        const token = _createSession(user.id);

        console.log(`[AuthServer] User logged in: ${user.username} (ID: ${user.id}) | Session token: ${token}`);

        return { 
            status: 200,
            message: 'Login successful',
            user: user,
            token: token
        };
    }

    function _handleLogout(token) {

        if (!token) return { status: 400, message: 'Missing session token' };
        _deleteSession(token);
        return { status: 200, message: 'Logout successful' };
    }


    function init() {
        Network.register(ADDRESS, _handle);
        console.log(`[AuthServer] Initialized and registered at address "${ADDRESS}"`);
    }

    init(); // start the server immediately

    return {
        validateToken, // exposed for other modules to use
    };
})();
        

