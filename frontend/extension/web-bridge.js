/**
 * web-bridge.js - Runs on web app (localhost:3000)
 * Bridges communication between web app and extension
 */

// Check if chrome extension API is available
if (!window.chrome || !window.chrome.runtime) {
  console.warn('[WebBridge] Chrome extension API not available');
}

window.addEventListener('message', (event) => {
  // Only accept messages from same origin
  if (event.origin !== window.location.origin) return;

  const { type, payload } = event.data;

  // Handle apply position request
  if (type === 'APPLY_POSITION') {
    console.log('[WebBridge] Received apply position request:', payload);
    
    if (!window.chrome || !window.chrome.runtime) {
      console.error('[WebBridge] Chrome extension API not available - extension may not be installed');
      return;
    }
    
    // Send to extension
    try {
      chrome.runtime.sendMessage(
        {
          type: 'APPLY_POSITION',
          payload: payload,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('[WebBridge] Extension error:', chrome.runtime.lastError);
            return;
          }
          console.log('[WebBridge] Apply request sent to extension:', response);
        }
      );
    } catch (error) {
      console.error('[WebBridge] Failed to send message to extension:', error);
    }
  }
});

// Notify web app that extension is ready
window.postMessage({ type: 'EXTENSION_READY' }, '*');
console.log('[WebBridge] Loaded and listening for messages');

