/**
 * content.js - Autofill logic for job application sites
 * Runs on LinkedIn, Internshala, Wellfound, Indeed
 */

let autofillData = null;

// Load autofill data on page load
chrome.storage.local.get(['autofillData'], (result) => {
  autofillData = result.autofillData;
  console.log('[ContentScript] Loaded autofill data:', autofillData);
  
  // Try to autofill on page load
  if (autofillData) {
    setTimeout(() => detectAndAutofill(), 1000);
  }
});

// Listen for data updates from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'AUTOFILL_DATA_UPDATED') {
    autofillData = request.payload;
    console.log('[ContentScript] Data updated:', autofillData);
    detectAndAutofill();
    sendResponse({ success: true });
  }

  if (request.type === 'DATA_CLEARED') {
    autofillData = null;
    console.log('[ContentScript] Data cleared');
    sendResponse({ success: true });
  }
});

// Main autofill detection and execution
async function detectAndAutofill() {
  const url = window.location.href;
  console.log('[ContentScript] Checking URL:', url);

  if (url.includes('linkedin.com/jobs') || url.includes('linkedin.com/jobs/')) {
    console.log('[ContentScript] Detected LinkedIn job page');
    autofillLinkedIn();
  } else if (url.includes('internshala.com/jobs')) {
    console.log('[ContentScript] Detected Internshala job page');
    autofillInternshala();
  } else if (url.includes('wellfound.com/jobs') || url.includes('wellfound.com/role/')) {
    console.log('[ContentScript] Detected Wellfound job page');
    autofillWellfound();
  } else if (url.includes('indeed.com/jobs')) {
    console.log('[ContentScript] Detected Indeed job page');
    autofillIndeed();
  }
}

/**
 * LinkedIn Autofill
 */
function autofillLinkedIn() {
  if (!autofillData) return;

  console.log('[LinkedIn] Starting autofill...');

  // Look for application form modal
  const modals = document.querySelectorAll('[role="dialog"], .modal, [class*="modal"], [class*="form"]');
  console.log('[LinkedIn] Found', modals.length, 'potential form containers');

  let fieldsFound = 0;

  // Name field
  const nameInputs = document.querySelectorAll(
    'input[name*="name" i], input[aria-label*="name" i], input[placeholder*="name" i]'
  );
  nameInputs.forEach((input) => {
    if (!input.value && autofillData.name) {
      input.value = autofillData.name;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled name');
    }
  });

  // Email field
  const emailInputs = document.querySelectorAll(
    'input[type="email"], input[name*="email" i], input[aria-label*="email" i]'
  );
  emailInputs.forEach((input) => {
    if (!input.value && autofillData.email) {
      input.value = autofillData.email;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled email');
    }
  });

  // Phone field
  const phoneInputs = document.querySelectorAll(
    'input[type="tel"], input[type="phone"], input[name*="phone" i], input[aria-label*="phone" i]'
  );
  phoneInputs.forEach((input) => {
    if (!input.value && autofillData.phone) {
      input.value = autofillData.phone;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled phone');
    }
  });

  console.log('[LinkedIn] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Internshala Autofill
 */
function autofillInternshala() {
  if (!autofillData) return;

  console.log('[Internshala] Starting autofill...');
  let fieldsFound = 0;

  // Internshala uses different field structure
  // Name
  const nameInput = document.querySelector(
    'input[name="full_name"], input[placeholder="Full Name"], input[id*="name"]'
  );
  if (nameInput && autofillData.name) {
    nameInput.value = autofillData.name;
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    fieldsFound++;
    console.log('[Internshala] ✓ Filled name');
  }

  // Email
  const emailInput = document.querySelector(
    'input[name="email"], input[type="email"], input[placeholder="Email"]'
  );
  if (emailInput && autofillData.email) {
    emailInput.value = autofillData.email;
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    fieldsFound++;
    console.log('[Internshala] ✓ Filled email');
  }

  // Phone
  const phoneInput = document.querySelector(
    'input[name="phone"], input[type="tel"], input[placeholder*="Phone"]'
  );
  if (phoneInput && autofillData.phone) {
    phoneInput.value = autofillData.phone;
    phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
    fieldsFound++;
    console.log('[Internshala] ✓ Filled phone');
  }

  // Auto-click apply button
  setTimeout(() => {
    const applyBtn = document.querySelector(
      'button[text*="Apply"], button[class*="apply"], button:contains("Apply")'
    );
    if (applyBtn && fieldsFound > 0) {
      console.log('[Internshala] Auto-clicking apply button');
      applyBtn.click();
    }
  }, 500);

  console.log('[Internshala] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Wellfound Autofill
 */
function autofillWellfound() {
  if (!autofillData) return;

  console.log('[Wellfound] Starting autofill...');
  let fieldsFound = 0;

  // Wellfound form fields
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');

  inputs.forEach((input) => {
    const placeholder = input.placeholder.toLowerCase();
    const label = input.getAttribute('aria-label')?.toLowerCase() || '';

    // Name
    if ((placeholder.includes('name') || label.includes('name')) && autofillData.name) {
      if (!input.value) {
        input.value = autofillData.name;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fieldsFound++;
        console.log('[Wellfound] ✓ Filled name');
      }
    }

    // Email
    if ((placeholder.includes('email') || label.includes('email')) && autofillData.email) {
      if (!input.value) {
        input.value = autofillData.email;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fieldsFound++;
        console.log('[Wellfound] ✓ Filled email');
      }
    }

    // Phone
    if ((placeholder.includes('phone') || label.includes('phone')) && autofillData.phone) {
      if (!input.value) {
        input.value = autofillData.phone;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fieldsFound++;
        console.log('[Wellfound] ✓ Filled phone');
      }
    }
  });

  console.log('[Wellfound] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Indeed Autofill
 */
function autofillIndeed() {
  if (!autofillData) return;

  console.log('[Indeed] Starting autofill...');
  let fieldsFound = 0;

  // Indeed form fields
  const inputs = document.querySelectorAll(
    'input[class*="application"], input[type="text"], input[type="email"]'
  );

  inputs.forEach((input) => {
    if (!input.value) {
      const name = input.name?.toLowerCase() || '';
      const id = input.id?.toLowerCase() || '';

      // Name
      if ((name.includes('name') || id.includes('name')) && autofillData.name) {
        input.value = autofillData.name;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fieldsFound++;
        console.log('[Indeed] ✓ Filled name');
      }

      // Email
      if ((name.includes('email') || id.includes('email')) && autofillData.email) {
        input.value = autofillData.email;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fieldsFound++;
        console.log('[Indeed] ✓ Filled email');
      }

      // Phone
      if ((name.includes('phone') || id.includes('phone')) && autofillData.phone) {
        input.value = autofillData.phone;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fieldsFound++;
        console.log('[Indeed] ✓ Filled phone');
      }
    }
  });

  console.log('[Indeed] Autofill complete. Fields filled:', fieldsFound);
}

console.log('[ContentScript] Loaded on:', window.location.href);

// Monitor for dynamic content (forms loaded after page load)
const observer = new MutationObserver(() => {
  // Debounce autofill attempts
  clearTimeout(observer.timeout);
  observer.timeout = setTimeout(() => {
    if (autofillData) {
      detectAndAutofill();
    }
  }, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
