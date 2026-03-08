
class FXMLHttpRequest {

  // How many times to retry if the network drops the message
  static MAX_RETRIES = 3;

  constructor() {

    // ── Properties that mirror real XHR ──────────────────────
    this.readyState = 0;     // 0 = not opened yet, 1 = opened, 4 = done
    this.status = 0;     // HTTP-style status: 200, 201, 400, 401...
    this.responseText = '';    // the raw response as a JSON string
    this.response = null;  // the parsed response object

    // ── Event handlers — set by the caller ───────────────────
    this.onload = null;   // called when response arrives successfully
    this.onerror = null;   // called when network fails completely
    this.onreadystatechange = null;  // called every time readyState changes

    // ── Internal state (private to this object) ───────────────
    this._method = '';    // GET / POST / PUT / DELETE
    this._serverAddr = '';    // e.g. "auth-server"
    this._resource = '';    // e.g. "contacts"
    this._id = null;  // e.g. "42" or null
    this._retries = 0;     // how many times we've retried so far
  }


  // This is the first step — tell FAJAX what kind of request
  //
  // method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  // url:    'auth-server/login'  or  'data-server/contacts/42'
  // ─────────────────────────────────────────────────────────────
  open(method, url) {
    this._method = method.toUpperCase();

    // Parse the URL into its parts
    // 'data-server/contacts/42'  →  ['data-server', 'contacts', '42']
    const parts = url.split('/');
    this._serverAddr = parts[0];                      // 'data-server'
    this._resource = parts[1] || '';                // 'contacts'
    this._id = parts[2] !== undefined         // '42' or null
      ? parts[2]
      : null;

    // Update readyState to 1 = OPENED
    this.readyState = 1;
    this._fireEvent('onreadystatechange');

    console.log(`[FAJAX] open() → ${this._method} ${url}`);
  }


  // This is the second step — actually send the request.
  // body is a JSON string for POST/PUT, or null for GET/DELETE.
  // ─────────────────────────────────────────────────────────────
  send(body = null) {

    // Guard: make sure open() was called first
    if (this.readyState !== 1) {
      console.error('[FAJAX] ❌ send() called before open()!');
      return;
    }

    this._retries = 0;           // reset retry counter
    this._transmit(body);        // start the transmission
  }


  // Builds the envelope and sends it through the Network.
  // This is separated from send() so we can call it again on retry.
  // ─────────────────────────────────────────────────────────────
  _transmit(body) {
    const self = this;  // save reference to this for use inside callbacks

    // Build the payload — this is what the server will receive
    const payload = {
      method: this._method,
      resource: this._resource,
      id: this._id,
      body: body ? JSON.parse(body) : null,
    };

    // Build the envelope — this is what the Network handles
    const envelope = {
      to: this._serverAddr,
      payload,

      // ── Called when server responds successfully ───────────
      onDeliver(response) {
        console.log(`[FAJAX] ✅ Response received:`, response);

        // Update our properties — just like real XHR does
        self.readyState = 4;  // 4 = DONE
        self.status = response.status || 200;
        self.responseText = JSON.stringify(response);
        self.response = response;

        self._fireEvent('onreadystatechange');

        // Call onload — this is what the client code listens to
        self._fireEvent('onload');
      },

      // ── Called if network drops the message ────────────────
      onDrop(reason) {
        self._retries++;
        console.warn(`[FAJAX] 🚫 Dropped! Retry ${self._retries}/${FXMLHttpRequest.MAX_RETRIES} — reason: ${reason}`);

        if (self._retries < FXMLHttpRequest.MAX_RETRIES) {
          // Wait a moment then try again
          setTimeout(() => {
            self._transmit(body);
          }, 500);

        } else {
          // We've retried too many times — give up
          console.error(`[FAJAX] ❌ Max retries reached. Giving up.`);
          self.readyState = 4;
          self.status = 0;  // 0 means network failure
          self._fireEvent('onreadystatechange');
          self._fireEvent('onerror');
        }
      }
    };

    // Hand the envelope to the Network
    console.log(`[FAJAX] 📤 Sending envelope to Network...`);
    Network.send(envelope);
  }


  // Safely calls an event handler if it has been set.
  // ─────────────────────────────────────────────────────────────
  _fireEvent(eventName) {
    if (typeof this[eventName] === 'function') {
      this[eventName]();
    }
  }
}


// ══════════════════════════════════════════════════════════════
// fajax()  —  convenience wrapper function
// ══════════════════════════════════════════════════════════════

function fajax({ method = 'GET', url, data = null, success, error }) {

  const xhr = new FXMLHttpRequest();
  xhr.open(method, url);

  xhr.onload = () => {
    // status 200–299 = success, anything else = server-side error
    if (xhr.status >= 200 && xhr.status < 300) {
      if (typeof success === 'function') success(xhr.response);
    } else {
      if (typeof error === 'function') {
        error(xhr.response || { status: xhr.status, message: 'Server error' });
      }
    }
  };

  xhr.onerror = () => {
    if (typeof error === 'function') {
      error({ status: 0, message: 'Network error: message dropped after max retries' });
    }
  };

  // Serialize data to JSON string if provided
  xhr.send(data ? JSON.stringify(data) : null);

  return xhr;  // return in case caller wants to reference it
}
