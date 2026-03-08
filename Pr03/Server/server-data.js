
const dataServer = (() => {

    const ADDRESS = 'data-server'; // name we register with the Network

    function _authenticate(body) {
        if (!body || !body.token) return null;

        return AuthServer.validateToken(body.token);
    }

    // REQUEST HANDLER
    // Registered with Network — called on every incoming message
    function _handle(envelope) {
        const { method, resource, id, body } = envelope.payload;

        console.log(`[Data Server] Received request: ${method} /${resource}/${id || ''}`);

        // Authenticate the user first
        const userId = _authenticate(body);

        if (!userId) {
            console.warn('[Data Server] Authentication failed. No valid token provided.');
            Network.respond({
                onDeliver: envelope.onDeliver,
                onDrop: envelope.onDrop,
                response: { status: 401, message: 'Unauthorized: Invalid or missing token' },
            });
            return;
        }

        let response;

        if (resource === 'contacts') {
            if (method === 'GET' && id === 'search') response = _handleSearch(userId, body);
            else if (method === 'GET' && !id) response = _handleGetAll(userId);
            else if (method === 'GET' && id) response = _handleGetOne(userId, id);
            else if (method === 'POST' && !id) response = _handleCreate(userId, body);
            else if (method === 'PUT' && id) response = _handleUpdate(userId, id, body);
            else if (method === 'DELETE' && id) response = _handleDelete(userId, id);
            else response = { status: 404, message: 'Endpoint not found' };
        } else {
            response = { status: 404, message: 'Resource not found' };
        }

        Network.respond({
            onDeliver: envelope.onDeliver,
            onDrop: envelope.onDrop,
            response: response,
        });
    }


    function _handleGetAll(userId) {
        const contacts = DBContacts.getAllContacts(userId);
        return { status: 200, contacts: contacts };
    }

    function _handleGetOne(userId, contactId) {
        const contact = DBContacts.getContactById(userId, contactId);

        if (!contact) {
            return { status: 404, message: 'Contact not found' };
        }

        return { status: 200, contact: contact };
    }

    function _handleCreate(userId, body) {
        if (!body) return { status: 400, message: 'Missing request body' };

        const { firstName, lastName, email, phone } = body;
        if (!firstName || !lastName) return { status: 400, message: 'Missing required fields: firstName and lastName' };
        if (email && /*!email ||*/ !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: 400, message: '#####Valid email is required' };

        const contantData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email ? email.trim() : '',
            phone: phone ? phone.trim() : '',
        }

        const existingContacts = DBContacts.getAllContacts(userId);
        const contactExists = existingContacts.some(c =>
            (c.email && c.email.toLowerCase() === contantData.email.toLowerCase()) ||
            (c.firstName.toLowerCase() === contantData.firstName.toLowerCase() &&
                c.lastName.toLowerCase() === contantData.lastName.toLowerCase() &&
                !contantData.email)
        );

        if (contactExists) {
            return {
                status: 409, message: 'Contact already exists'
            };
        }

        const contact = DBContacts.addContact(userId, contantData);
        console.log(`[Data Server] Contact created with id ${contact.id} for user ${userId}`);
        return { status: 201, message: 'Contact created', contact: contact };
    }

    function _handleSearch(userId, body) {
        const query = body?.query || '';
        const contacts = DBContacts.searchContact(userId, query);
        console.log(`[Data Server] Search for "${query}" returned ${contacts.length} contacts for user ${userId}`);
        return { status: 200, contacts: contacts };
    }

    function _handleUpdate(userId, contactId, body) {
        if (!body) return { status: 400, message: 'Missing request body' };

        const existingContact = DBContacts.getContactById(userId, contactId);
        if (!existingContact) {
            return { status: 404, message: 'Contact not found' };
        }

        if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return { status: 400, message: 'Valid email is required' };
        }

        const updatedContact = DBContacts.updateContact(userId, contactId, body);
        console.log(`[Data Server] Contact with id ${contactId} updated for user ${userId}`);
        return { status: 200, message: 'Contact updated', contact: updatedContact };

    }

    function _handleDelete(userId, contactId) {

        const existingContact = DBContacts.getContactById(userId, contactId);
        if (!existingContact) {
            return { status: 404, message: 'Contact not found' };
        }

        const success = DBContacts.deleteContact(userId, contactId);
        if (success) {
            console.log(`[Data Server] Contact with id ${contactId} deleted for user ${userId}`);
            return { status: 200, message: 'Contact deleted successfully' };
        } else {
            console.warn(`[Data Server] Failed to delete contact with id ${contactId} for user ${userId}`);
            return { status: 500, message: 'Failed to delete contact' };
        }
    }

    function init() {
        Network.register(ADDRESS, _handle);
        console.log(`[Data Server] Initialized and registered with Network as "${ADDRESS}"`);
    }

    init(); // start the server immediately

    return {
        // We could expose some internal functions here if needed, but for now
        // the server is self-contained and only interacts through the Network.
    };

})();
