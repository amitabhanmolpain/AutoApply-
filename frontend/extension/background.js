/**
 * background.js - Extension Service Worker (Manifest V3)
 * Handles storage and message routing
 */

// Listen for messages from web app via web-bridge
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_AUTOFILL_DATA') {
    console.log('[Background] Saving autofill data:', request.payload);
    
    // Save to chrome.storage
    chrome.storage.local.set({ autofillData: request.payload }, () => {
      sendResponse({ success: true, message: 'Data saved' });
      
      // Notify all content scripts about the update
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(
            tab.id,
            { type: 'AUTOFILL_DATA_UPDATED', payload: request.payload }
          ).catch(() => {
            // Ignore tabs where content script isn't injected
          });
        });
      });
    });
    return true; // Keep connection open for async response
  }

  if (request.type === 'CLEAR_AUTOFILL_DATA') {
    console.log('[Background] Clearing data');
    chrome.storage.local.remove(['autofillData'], () => {
      sendResponse({ success: true });
      
      // Notify all content scripts
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { type: 'DATA_CLEARED' }).catch(() => {});
        });
      });
    });
    return true;
  }

  if (request.type === 'GET_AUTOFILL_DATA') {
    chrome.storage.local.get(['autofillData'], (result) => {
      sendResponse({ data: result.autofillData || null });
    });
    return true;
  }
});

console.log('[Background] Service worker loaded');
