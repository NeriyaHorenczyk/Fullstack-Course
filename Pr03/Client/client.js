
// ══════════════════════════════════════════════════════════════
// APP STATE - Global state management for current user, token, contacts, and selected contact ID
// - currentUser: the logged-in user's info (null if not logged in)
// - token: the authentication token for API requests (null if not logged in) i.e tok_1772642874750_v3yc03uq
// - contacts: the list of contacts loaded from the server after loadContacts() is called
// - selectedId: the ID of the currently selected contact (null if none)
// This state is used across different pages and components to manage what is displayed and how the app behaves.
// ══════════════════════════════════════════════════════════════
const AppState = {
  currentUser: null,
  token: null,
  contacts: [],
  selectedId: null,
};


// ══════════════════════════════════════════════════════════════
// SPA ROUTER - Simple client-side navigation by showing/hiding page sections
// ══════════════════════════════════════════════════════════════
function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
  console.log(`[App] navigated to: ${pageId}`);
}


// ══════════════════════════════════════════════════════════════
// LOADER
// ══════════════════════════════════════════════════════════════
function showLoader(message = 'Loading...') {
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('loader-message').textContent = message;
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
}


// ══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════════════════════
let toastTimer;

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast';
  if (type) toast.classList.add(type);
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}


// ══════════════════════════════════════════════════════════════
// FORM VALIDATION HELPERS
// ══════════════════════════════════════════════════════════════
function setError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors(...elementIds) {
  elementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function isEmpty(value) {
  return !value || !value.trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


// ══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════
function initLoginPage() {
  document.getElementById('go-register').addEventListener('click', e => {
    e.preventDefault();
    clearErrors('login-username-err', 'login-password-err', 'login-form-err');
    navigateTo('page-register');
  });

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    clearErrors('login-username-err', 'login-password-err', 'login-form-err');

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    let valid = true;
    if (isEmpty(username)) { setError('login-username-err', 'Username is required'); valid = false; }
    if (isEmpty(password)) { setError('login-password-err', 'Password is required'); valid = false; }
    if (!valid) return;

    showLoader('Signing in...');
    document.getElementById('login-btn').disabled = true;

    fajax({
      method: 'POST',
      url: 'auth-server/login',
      data: { username, password },

      success(res) {
        hideLoader();
        document.getElementById('login-btn').disabled = false;
        if (res.status === 200) {
          AppState.currentUser = res.user;
          AppState.token = res.token;
          document.getElementById('login-form').reset();
          navigateTo('page-app');
          updateWelcomeMessage();
          loadContacts();
        } else {
          setError('login-form-err', res.message || 'Login failed');
        }
      },

      error(err) {
        hideLoader();
        console.log(err);
        document.getElementById('login-btn').disabled = false;
        setError('login-form-err', err.message);
        console.error('[Login] error:', err);
      }
    });
  });
}


// ══════════════════════════════════════════════════════════════
// REGISTER PAGE
// ══════════════════════════════════════════════════════════════
function initRegisterPage() {
  document.getElementById('go-login').addEventListener('click', e => {
    e.preventDefault();
    clearErrors('reg-username-err', 'reg-email-err', 'reg-password-err', 'reg-confirm-err', 'reg-form-err');
    navigateTo('page-login');
  });

  document.getElementById('register-form').addEventListener('submit', e => {
    e.preventDefault();
    clearErrors('reg-username-err', 'reg-email-err', 'reg-password-err', 'reg-confirm-err', 'reg-form-err');

    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    let valid = true;
    if (isEmpty(username)) { setError('reg-username-err', 'Username is required'); valid = false; }
    else if (username.length < 3) { setError('reg-username-err', 'At least 3 characters'); valid = false; }
    if (isEmpty(email)) { setError('reg-email-err', 'Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setError('reg-email-err', 'Invalid email address'); valid = false; }
    if (isEmpty(password)) { setError('reg-password-err', 'Password is required'); valid = false; }
    else if (password.length < 6) { setError('reg-password-err', 'At least 6 characters'); valid = false; }
    if (password !== confirm) { setError('reg-confirm-err', 'Passwords do not match'); valid = false; }
    if (!valid) return;

    showLoader('Creating account...');
    document.getElementById('register-btn').disabled = true;

    fajax({
      method: 'POST',
      url: 'auth-server/users',
      data: { username, email, password },

      success(res) {
        if (res.status === 201) {
          fajax({
            method: 'POST',
            url: 'auth-server/login',
            data: { username, password },
            success(loginRes) {
              hideLoader();
              document.getElementById('register-btn').disabled = false;
              if (loginRes.status === 200) {
                AppState.currentUser = loginRes.user;
                AppState.token = loginRes.token;
                document.getElementById('register-form').reset();
                navigateTo('page-app');
                updateWelcomeMessage();
                loadContacts();
              } else {
                showToast('Account created! Please sign in.', 'success');
                document.getElementById('register-form').reset();
                navigateTo('page-login');
              }
            },
            error(err) {
              hideLoader();
              document.getElementById('register-btn').disabled = false;
              showToast('Account created! Please sign in.', 'success');
              document.getElementById('register-form').reset();
              navigateTo('page-login');
            }
          });
        } else {
          hideLoader();
          document.getElementById('register-btn').disabled = false;
          if (res.status === 409 && res.message === 'Username already exists') {
            setError('reg-username-err', 'username is already registered');
          } else {
            setError('reg-form-err', res.message || 'Registration failed');
          }
        }
      },

      error(err) {
        hideLoader();
        document.getElementById('register-btn').disabled = false;

        if (err && err.status === 409) {
          if (err.message && err.message.toLowerCase().includes('username')) {
            setError('reg-username-err', err.message);
          } else if (err.message && err.message.toLowerCase().includes('email')) {
            setError('reg-email-err', err.message);
          } else {
            setError('reg-form-err', err.message);
          }
        } else {
          const msg = err && err.message ? err.message : 'Network error — please try again';
          setError('reg-form-err', msg);
        }

        console.error('[Register] error:', err);
      }
    });
  });
}


// ══════════════════════════════════════════════════════════════
// APP PAGE
// ══════════════════════════════════════════════════════════════
function updateWelcomeMessage() {
  const el = document.getElementById('welcome-msg');
  if (el && AppState.currentUser) {
    el.textContent = `Hi, ${AppState.currentUser.username}`;
  }
}

function loadContacts() {
  showLoader('Loading contacts...');
  fajax({
    method: 'GET',
    url: 'data-server/contacts',
    data: { token: AppState.token },
    success(res) {
      hideLoader();
      if (res.status === 200) {
        AppState.contacts = res.contacts || [];
        renderContactList(AppState.contacts);
      } else {
        showToast('Failed to load contacts', 'error');
      }
    },
    error(err) {
      hideLoader();
      showToast('Network error loading contacts', 'error');
      console.error('[loadContacts] error:', err);
    }
  });
}

function renderContactList(contacts) {
  const ul = document.getElementById('contacts-ul');
  const empty = document.getElementById('list-empty');
  ul.innerHTML = '';

  if (!contacts || contacts.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.className = 'contact-item' + (contact.id === AppState.selectedId ? ' active' : '');
    li.dataset.id = contact.id;
    const initials = (contact.firstName[0] + contact.lastName[0]).toUpperCase();
    li.innerHTML = `
      <div class="contact-avatar">${initials}</div>
      <div class="contact-info">
        <div class="contact-name">${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</div>
        <div class="contact-sub">${escapeHtml(contact.email)}</div>
      </div>
    `;
    li.addEventListener('click', () => selectContact(contact.id));
    ul.appendChild(li);
  });
}

function selectContact(id) {
  AppState.selectedId = id;
  document.querySelectorAll('.contact-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
  const contact = AppState.contacts.find(c => c.id === id);
  if (contact) showDetailView(contact);
}

function showDetailView(contact) {
  document.getElementById('detail-empty').classList.add('hidden');
  document.getElementById('detail-form').classList.add('hidden');
  document.getElementById('detail-view').classList.remove('hidden');
  const initials = (contact.firstName[0] + contact.lastName[0]).toUpperCase();
  document.getElementById('view-avatar').textContent = initials;
  document.getElementById('view-name').textContent = `${contact.firstName} ${contact.lastName}`;
  document.getElementById('view-email').textContent = contact.email || '—';
  document.getElementById('view-phone').textContent = contact.phone || '—';
}

function showContactForm(contact = null) {
  document.getElementById('detail-empty').classList.add('hidden');
  document.getElementById('detail-view').classList.add('hidden');
  document.getElementById('detail-form').classList.remove('hidden');
  const isEdit = !!contact;
  document.getElementById('form-title').textContent = isEdit ? 'Edit Contact' : 'New Contact';
  document.getElementById('cf-id').value = contact?.id || '';
  document.getElementById('cf-firstname').value = contact?.firstName || '';
  document.getElementById('cf-lastname').value = contact?.lastName || '';
  document.getElementById('cf-email').value = contact?.email || '';
  document.getElementById('cf-phone').value = contact?.phone || '';
  clearErrors('cf-firstname-err', 'cf-lastname-err', 'cf-email-err', 'cf-form-err');
}


// ══════════════════════════════════════════════════════════════
// CONTACT FORM — SAVE
// ══════════════════════════════════════════════════════════════
function initContactForm() {
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    clearErrors('cf-firstname-err', 'cf-lastname-err', 'cf-email-err', 'cf-form-err');

    const id = document.getElementById('cf-id').value;
    const firstName = document.getElementById('cf-firstname').value.trim();
    const lastName = document.getElementById('cf-lastname').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();

    let valid = true;
    if (isEmpty(firstName)) { setError('cf-firstname-err', 'First name is required'); valid = false; }
    if (isEmpty(lastName)) { setError('cf-lastname-err', 'Last name is required'); valid = false; }
    //if (isEmpty(email)) { setError('cf-email-err', 'Email is required'); valid = false; }
    else if (!isValidEmail(email) && !isEmpty(email)) { setError('cf-email-err', 'Invalid email address'); valid = false; }
    if (!valid) return;

    const isEdit = !!id;
    showLoader(isEdit ? 'Updating...' : 'Saving...');
    document.getElementById('save-btn').disabled = true;

    fajax({
      method: isEdit ? 'PUT' : 'POST',
      url: isEdit ? `data-server/contacts/${id}` : 'data-server/contacts',
      data: { token: AppState.token, firstName, lastName, email, phone },

      success(res) {
        hideLoader();
        document.getElementById('save-btn').disabled = false;
        if (res.status === 200 || res.status === 201) {
          showToast(isEdit ? 'Contact updated!' : 'Contact added!', 'success');
          const savedId = res.contact?.id || id;
          loadContactsAndSelect(savedId);
        } else if (res.status === 409) {
          setError('cf-form-err', res.message || 'Contact already exists');
        } else {
          setError('cf-form-err', res.message || 'Save failed');
        }
      },

      error(err) {
        hideLoader();
        document.getElementById('save-btn').disabled = false;
        const msg = err && err.message ? err.message : 'Network error — please try again';
        setError('cf-form-err', msg);
        console.error('[Save] error:', err);
      }
    });
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    if (AppState.selectedId) {
      const contact = AppState.contacts.find(c => c.id === AppState.selectedId);
      if (contact) showDetailView(contact);
    } else {
      document.getElementById('detail-form').classList.add('hidden');
      document.getElementById('detail-empty').classList.remove('hidden');
    }
  });
}

function loadContactsAndSelect(contactId) {
  showLoader('Loading...');
  fajax({
    method: 'GET',
    url: 'data-server/contacts',
    data: { token: AppState.token },
    success(res) {
      hideLoader();
      if (res.status === 200) {
        AppState.contacts = res.contacts || [];
        renderContactList(AppState.contacts);
        if (contactId) selectContact(contactId);
      }
    },
    error() {
      hideLoader();
      showToast('Network error reloading contacts', 'error');
    }
  });
}


// ══════════════════════════════════════════════════════════════
// DELETE
// ══════════════════════════════════════════════════════════════
function initDeleteBtn() {
  document.getElementById('delete-btn').addEventListener('click', () => {
    const id = AppState.selectedId;
    if (!id) return;
    const contact = AppState.contacts.find(c => c.id === id);
    const name = contact ? `${contact.firstName} ${contact.lastName}` : 'this contact';
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    showLoader('Deleting...');
    fajax({
      method: 'DELETE',
      url: `data-server/contacts/${id}`,
      data: { token: AppState.token },
      success(res) {
        hideLoader();
        if (res.status === 200) {
          showToast('Contact deleted', 'success');
          AppState.selectedId = null;
          loadContacts();
          document.getElementById('detail-view').classList.add('hidden');
          document.getElementById('detail-empty').classList.remove('hidden');
        } else {
          showToast(res.message || 'Delete failed', 'error');
        }
      },
      error() {
        hideLoader();
        showToast('Network error — please try again', 'error');
      }
    });
  });
}


// ══════════════════════════════════════════════════════════════
// SEARCH
// ══════════════════════════════════════════════════════════════
function initSearch() {
  const input = document.getElementById('search-input');
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value.trim();
      if (!query) { renderContactList(AppState.contacts); return; }
      fajax({
        method: 'GET',
        url: 'data-server/contacts/search',
        data: { token: AppState.token, query },
        success(res) {
          if (res.status === 200) renderContactList(res.contacts);
        },
        error() {
          const q = query.toLowerCase();
          renderContactList(AppState.contacts.filter(c =>
            `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(q)
          ));
        }
      });
    }, 400);
  });
}


// ══════════════════════════════════════════════════════════════
// BUTTONS
// ══════════════════════════════════════════════════════════════
function initEditBtn() {
  document.getElementById('edit-btn').addEventListener('click', () => {
    const contact = AppState.contacts.find(c => c.id === AppState.selectedId);
    if (contact) showContactForm(contact);
  });
}

function initAddBtn() {
  document.getElementById('add-btn').addEventListener('click', () => {
    AppState.selectedId = null;
    document.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
    showContactForm(null);
  });
}


// ══════════════════════════════════════════════════════════════
// LOGOUT
// ══════════════════════════════════════════════════════════════
function initLogout() {
  document.getElementById('logout-btn').addEventListener('click', () => {
    fajax({
      method: 'DELETE',
      url: `auth-server/login/${AppState.token}`,
      data: { token: AppState.token },
      success() { },
      error() { }
    });
    AppState.currentUser = null;
    AppState.token = null;
    AppState.contacts = [];
    AppState.selectedId = null;
    document.getElementById('contacts-ul').innerHTML = '';
    document.getElementById('search-input').value = '';
    document.getElementById('detail-empty').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('detail-form').classList.add('hidden');
    navigateTo('page-login');
    showToast('Signed out successfully');
  });
}


// ══════════════════════════════════════════════════════════════
// UTILITY
// ══════════════════════════════════════════════════════════════
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initLoginPage();
  initRegisterPage();
  initContactForm();
  initDeleteBtn();
  initEditBtn();
  initAddBtn();
  initSearch();
  initLogout();
  navigateTo('page-login');
  console.log('[App] ✅ Client ready');
});
