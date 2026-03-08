const Network = (() => {

  // ── Settings ─────────────────────────────────────────────────
  const MIN_DELAY = 1000;   
  const MAX_DELAY = 3000;   
  const DROP_PROB = 0.15

  // ── Server Registry ───────────────────────────────────────────
  // This is like a phone book: { "auth-server": handlerFunction, ... }
  const _servers = {};

  // ─────────────────────────────────────────────────────────────
  // REGISTER
  // Called by each server when it starts up.
  // address: a string like "auth-server" or "data-server"
  // handler: the function to call when a message arrives for this server
  // ─────────────────────────────────────────────────────────────
  function register(address, handler) {
    _servers[address] = handler;
    console.log(`[Network] ✅ Server registered at address: "${address}"`);
  }

  // ─────────────────────────────────────────────────────────────
  // The client calls this to send a message to a server.
  // ─────────────────────────────────────────────────────────────
  function send(envelope) {
    const delay   = _randomDelay();
    const dropped = _isDropped();

    console.log(
      `[Network] 📤 Sending to "${envelope.to}" | delay: ${delay}ms | ${dropped ? '🚫 WILL BE DROPPED' : '✅ will be delivered'}`
    );

    // setTimeout simulates the travel time across the network
    setTimeout(() => {

      if (dropped) {
        console.warn(`[Network] 🚫 Message to "${envelope.to}" was dropped!`);
        if (typeof envelope.onDrop === 'function') {
          envelope.onDrop('Message dropped by network');
        }
        return;
      }

      // Look up the server in our registry
      const serverHandler = _servers[envelope.to];

      if (!serverHandler) {
        console.error(`[Network] ❌ No server found at address "${envelope.to}"`);
        if (typeof envelope.onDrop === 'function') {
          envelope.onDrop(`No server at address "${envelope.to}"`);
        }
        return;
      }

      // Deliver to server — we clone the payload so the server
      // can't accidentally modify the client's original data
      console.log(`[Network] 📬 Delivered to "${envelope.to}"`);
      serverHandler({
        ...envelope,
        payload: _deepClone(envelope.payload)
      });

    }, delay);
  }

  function respond(responseEnvelope) {
    const delay   = _randomDelay();
    const dropped = _isDropped();

    console.log(
      `[Network] 📥 Response traveling back | delay: ${delay}ms | ${dropped ? '🚫 WILL BE DROPPED' : '✅ will arrive'}`
    );

    setTimeout(() => {

      if (dropped) {
        console.warn(`[Network] 🚫 Response was dropped on the way back!`);
        if (typeof responseEnvelope.onDrop === 'function') {
          responseEnvelope.onDrop('Response dropped by network');
        }
        return;
      }

      console.log(`[Network] 📬 Response delivered to client`);
      if (typeof responseEnvelope.onDeliver === 'function') {
        responseEnvelope.onDeliver(_deepClone(responseEnvelope.response));
      }

    }, delay);
  }

  // ── Private Helpers ───────────────────────────────────────────

  function _randomDelay() {
    return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
  }

  function _isDropped() {
    return Math.random() < DROP_PROB;
  }

  function _deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── Public API ────────────────────────────────────────────────
  return { register, send, respond };

})();
