/**
 * web-bridge.js - Runs on web app (localhost:3000)
 * Bridges communication between web app and extension
 */

window.addEventListener('message', (event) => {
  // Only accept messages from same origin
  if (event.origin !== window.location.origin) return;

  const { type, payload } = event.data;

  // Handle autofill data updates from web app
  if (type === 'AUTOFILL_DATA_UPDATED') {
    console.log('[WebBridge] Received autofill data:', payload);
    
    // Send to extension
    chrome.runtime.sendMessage(
      {
        type: 'SAVE_AUTOFILL_DATA',
        payload: payload,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log('[WebBridge] Extension not installed');
          return;
        }
        console.log('[WebBridge] Data sent to extension:', response);
      }
    );
  }

  // Handle clear data
  if (type === 'AUTOFILL_DATA_CLEARED') {
    console.log('[WebBridge] Clearing data');
    chrome.runtime.sendMessage({ type: 'CLEAR_AUTOFILL_DATA' });
  }

  // Test message from extension check
  if (type === 'TEST_EXTENSION') {
    console.log('[WebBridge] Extension test received');
  }
});

// Notify web app that extension is ready
window.postMessage({ type: 'EXTENSION_READY' }, '*');
console.log('[WebBridge] Loaded on web app');
