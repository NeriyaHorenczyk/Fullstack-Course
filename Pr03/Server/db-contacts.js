

const DBContacts = (() => {


    // Internal helper functions for managing contacts in localStorage

    // Each user's contacts are stored under a key like "cm_contacts_userId"
    function _key(userId) {
        return `cm_contacts_${userId}`;
    }


    // Loads the contacts for a given user from localStorage.
    function _load(userId) {
        try {
            const raw = localStorage.getItem(_key(userId));
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error(`Failed to load contacts for user ${userId} from localStorage:`, e);
            return [];
        }
    }

    // Saves the contacts for a given user to localStorage.
    function _save(userId, contacts) {
        localStorage.setItem(_key(userId), JSON.stringify(contacts));
    }

    // Generates a unique ID for a contact
    function _generateId() {
        return 'c_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }


    // Public API for managing contacts
    
    function getAllContacts(userId) {
        return _load(userId);
    }

    function getContactById(userId, contactId) {
        const contact = _load(userId).find(c => c.id === contactId);
        
        if (!contact) {
            console.warn(`Contact with id ${contactId} not found for user ${userId}`);
            return null;
        }

        return contact;
    }

    function addContact(userId, contactData) {
        const contacts = _load(userId);
        
        const newContact = {
            id: _generateId(),
            userId: userId,
            firstName: contactData.firstName || '',
            lastName: contactData.lastName || '',
            email: contactData.email,
            phone: contactData.phone || '',
        };
        
        contacts.push(newContact);
        _save(userId, contacts);
        return newContact;
    }

    function updateContact(userId, contactId, newData) {
        const contacts = _load(userId);
        const contactIndex = contacts.findIndex(c => c.id === contactId);
        
        if (contactIndex === -1) {
            console.warn(`Contact with id ${contactId} not found for user ${userId}`);
            return null;
        }

        const allowedFields = ['firstName', 'lastName', 'email', 'phone'];

        allowedFields.forEach(field => {
            if (newData[field] !== undefined) {
                contacts[contactIndex][field] = newData[field];
            }
        });

        _save(userId, contacts);
        console.log(`Contact with id ${contactId} updated for user ${userId}`);
        return contacts[contactIndex];
    }

    function deleteContact(userId, contactId) {
        const contacts = _load(userId);
        const index = contacts.findIndex(c => c.id === contactId);

        if (index === -1) {
            console.warn(`Contact with id ${contactId} not found for user ${userId}`);
            return false;
        }

        contacts.splice(index, 1);
        _save(userId, contacts);
        console.log(`Contact with id ${contactId} deleted for user ${userId}`);
        return true;
    }

    function searchContact(userId, query) {
        const contacts = _load(userId);
    
        // If query is empty or just whitespace, return all contacts
        if (!query || !query.trim()) return contacts;

        const lowerQuery = query.toLowerCase().trim();

        const results = contacts.filter(contact => {
      // Check every searchable field
      return (
        contact.firstName.toLowerCase().includes(lowerQuery) ||
        contact.lastName.toLowerCase().includes(lowerQuery)  ||
        contact.email.toLowerCase().includes(lowerQuery)     ||
        contact.phone.toLowerCase().includes(lowerQuery)
      );
    });

        console.log(`Search for "${query}" returned ${results.length} contacts for user ${userId}`);
        return results;
    }

    return {
        getAllContacts,
        getContactById,
        addContact,
        updateContact,
        deleteContact,
        searchContact
    };

})();