/**
 * background.js - Extension Service Worker (Manifest V3)
 * Handles storage and message routing for apply position requests
 */

// Listen for messages from web app via web-bridge
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Message received from:', sender.url);
  
  if (request.type === 'APPLY_POSITION') {
    console.log('[Background] Received apply position request:', request.payload);
    
    const applicationData = {
      position: request.payload.position,
      resume: request.payload.resume,
      fileName: request.payload.fileName,
      websites: request.payload.websites,
      timestamp: request.payload.timestamp,
      status: 'pending', // pending / completed / failed
    };

    // Save to chrome.storage
    chrome.storage.local.set({ currentApplication: applicationData }, () => {
      console.log('[Background] Application data saved to storage');
      try {
        sendResponse({ success: true, message: 'Apply request received' });
      } catch (error) {
        console.error('[Background] Could not send response:', error);
      }
      
      // Notify all content scripts to start autofilling on specified websites
      chrome.tabs.query({}, (tabs) => {
        console.log('[Background] Querying', tabs.length, 'tabs');
        let sentCount = 0;
        
        tabs.forEach((tab) => {
          // Check if tab is on one of the target websites
          const targetWebsites = applicationData.websites;
          let isTargetWebsite = false;
          
          if (targetWebsites.includes('linkedin') && tab.url.includes('linkedin.com')) {
            isTargetWebsite = true;
          } else if (targetWebsites.includes('indeed') && tab.url.includes('indeed.com')) {
            isTargetWebsite = true;
          } else if (targetWebsites.includes('intershala') && tab.url.includes('internshala.com')) {
            isTargetWebsite = true;
          } else if (targetWebsites.includes('wellfound') && tab.url.includes('wellfound.com')) {
            isTargetWebsite = true;
          } else if (targetWebsites.includes('naukri') && tab.url.includes('naukri.com')) {
            isTargetWebsite = true;
          }
          
          if (isTargetWebsite) {
            console.log('[Background] Sending autofill request to tab:', tab.id, tab.url);
            chrome.tabs.sendMessage(
              tab.id,
              { 
                type: 'START_AUTOFILL', 
                payload: applicationData 
              }
            ).then((response) => {
              sentCount++;
              console.log('[Background] Message sent successfully to tab', tab.id);
            }).catch((error) => {
              console.error('[Background] Failed to send message to tab', tab.id, ':', error);
            });
          }
        });
        
        console.log('[Background] Autofill requests sent to', sentCount, 'tabs');
      });
    });
    return true; // Keep connection open for async response
  }

  if (request.type === 'GET_CURRENT_APPLICATION') {
    chrome.storage.local.get(['currentApplication'], (result) => {
      sendResponse({ data: result.currentApplication || null });
    });
    return true;
  }
});

console.log('[Background] Service worker loaded and listening for messages');

