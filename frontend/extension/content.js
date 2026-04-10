/**
 * content.js - Autofill logic for job application sites
 * Fills forms with position and resume data received from extension
 */

let currentApplication = null;

// Listen for start autofill message from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'START_AUTOFILL') {
    currentApplication = request.payload;
    console.log('[ContentScript] Received autofill request on URL:', window.location.href);
    console.log('[ContentScript] Application data:', currentApplication);
    
    // Wait a moment for page to load if needed, then detect and autofill
    setTimeout(() => detectAndAutofill(), 1000);
    sendResponse({ success: true });
  } else {
    console.log('[ContentScript] Unknown message type:', request.type);
  }
});

// Main autofill detection and execution
async function detectAndAutofill() {
  if (!currentApplication) return;

  const url = window.location.href;
  console.log('[ContentScript] Checking URL:', url);

  if (url.includes('linkedin.com')) {
    console.log('[ContentScript] Detected LinkedIn job page');
    autofillLinkedIn();
  } else if (url.includes('indeed.com')) {
    console.log('[ContentScript] Detected Indeed job page');
    autofillIndeed();
  } else if (url.includes('internshala.com')) {
    console.log('[ContentScript] Detected Intershala job page');
    autofillIntershala();
  } else if (url.includes('wellfound.com')) {
    console.log('[ContentScript] Detected Wellfound job page');
    autofillWellfound();
  } else if (url.includes('naukri.com')) {
    console.log('[ContentScript] Detected Naukri job page');
    autofillNaukri();
  }
}

/**
 * Extract user info from resume text using basic regex
 */
function extractFromResume(resume) {
  const emailMatch = resume.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const phoneMatch = resume.match(/(\+\d{1,3}[-.\s]?\d{1,14}|[0-9]{10})/);
  const nameMatch = resume.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m);

  return {
    email: emailMatch ? emailMatch[1] : '',
    phone: phoneMatch ? phoneMatch[1] : '',
    name: nameMatch ? nameMatch[1] : '',
  };
}

function getCandidateProfile() {
  const fallback = extractFromResume(currentApplication.resume || '');
  const parsed = currentApplication.parsed_profile || {};

  return {
    name: parsed.full_name || parsed.name || fallback.name || '',
    firstName: parsed.first_name || '',
    lastName: parsed.last_name || '',
    email: parsed.email || fallback.email || '',
    phone: parsed.phone || fallback.phone || '',
    linkedin: parsed.linkedin || '',
    github: parsed.github || '',
    portfolio: parsed.portfolio || '',
    location: parsed.location || '',
    summary: parsed.summary || '',
    currentTitle: parsed.current_title || '',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
  };
}

function fillTextInput(input, value) {
  if (!input || !value || input.value) return false;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function fillByKeyword(keywords, value) {
  if (!value) return 0;
  let count = 0;
  const elements = document.querySelectorAll('input, textarea');

  elements.forEach((el) => {
    const text = [
      el.getAttribute('name') || '',
      el.getAttribute('id') || '',
      el.getAttribute('placeholder') || '',
      el.getAttribute('aria-label') || '',
    ].join(' ').toLowerCase();

    if (keywords.some((k) => text.includes(k.toLowerCase()))) {
      if (fillTextInput(el, value)) count++;
    }
  });

  return count;
}

/**
 * LinkedIn Autofill
 */
function autofillLinkedIn() {
  const userInfo = getCandidateProfile();
  console.log('[LinkedIn] Starting autofill with position:', currentApplication.position);

  let fieldsFound = 0;

  // Fill position-related fields
  const positionInputs = document.querySelectorAll(
    'input[aria-label*="desired job title" i], input[placeholder*="job title" i], input[name*="position" i]'
  );
  positionInputs.forEach((input) => {
    if (!input.value && currentApplication.position) {
      input.value = currentApplication.position;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled position');
    }
  });

  // Fill name fields
  const nameInputs = document.querySelectorAll(
    'input[name*="name" i], input[aria-label*="first name" i], input[placeholder*="name" i]'
  );
  nameInputs.forEach((input) => {
    if (fillTextInput(input, userInfo.name)) {
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled name');
    }
  });

  // Fill email
  const emailInputs = document.querySelectorAll(
    'input[type="email"], input[name*="email" i], input[aria-label*="email" i]'
  );
  emailInputs.forEach((input) => {
    if (fillTextInput(input, userInfo.email)) {
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled email');
    }
  });

  // Fill phone
  const phoneInputs = document.querySelectorAll(
    'input[type="tel"], input[name*="phone" i], input[aria-label*="phone" i]'
  );
  phoneInputs.forEach((input) => {
    if (fillTextInput(input, userInfo.phone)) {
      fieldsFound++;
      console.log('[LinkedIn] ✓ Filled phone');
    }
  });

  fieldsFound += fillByKeyword(['linkedin'], userInfo.linkedin);
  fieldsFound += fillByKeyword(['github'], userInfo.github);
  fieldsFound += fillByKeyword(['portfolio', 'website', 'personal site'], userInfo.portfolio);
  fieldsFound += fillByKeyword(['location', 'city'], userInfo.location);

  console.log('[LinkedIn] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Indeed Autofill
 */
function autofillIndeed() {
  const userInfo = getCandidateProfile();
  console.log('[Indeed] Starting autofill with position:', currentApplication.position);

  let fieldsFound = 0;

  // Fill position
  const positionInputs = document.querySelectorAll(
    'input[aria-label*="job title" i], input[placeholder*="job title" i]'
  );
  positionInputs.forEach((input) => {
    if (!input.value) {
      input.value = currentApplication.position;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      fieldsFound++;
      console.log('[Indeed] ✓ Filled position');
    }
  });

  // Fill other fields
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
  inputs.forEach((input) => {
    const label = input.getAttribute('aria-label')?.toLowerCase() || '';
    const name = input.getAttribute('name')?.toLowerCase() || '';

    if (!input.value) {
      if ((label.includes('name') || name.includes('name')) && userInfo.name) {
        input.value = userInfo.name;
        fieldsFound++;
      } else if ((label.includes('email') || name.includes('email')) && userInfo.email) {
        input.value = userInfo.email;
        fieldsFound++;
      } else if ((label.includes('phone') || name.includes('phone')) && userInfo.phone) {
        input.value = userInfo.phone;
        fieldsFound++;
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('[Indeed] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Wellfound Autofill
 */
function autofillWellfound() {
  const userInfo = getCandidateProfile();
  console.log('[Wellfound] Starting autofill');

  let fieldsFound = 0;
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

  inputs.forEach((input) => {
    if (!input.value) {
      const placeholder = input.placeholder?.toLowerCase() || '';
      const label = input.getAttribute('aria-label')?.toLowerCase() || '';

      if ((placeholder.includes('position') || label.includes('position')) && currentApplication.position) {
        input.value = currentApplication.position;
        fieldsFound++;
      } else if ((placeholder.includes('name') || label.includes('name')) && userInfo.name) {
        input.value = userInfo.name;
        fieldsFound++;
      } else if ((placeholder.includes('email') || label.includes('email')) && userInfo.email) {
        input.value = userInfo.email;
        fieldsFound++;
      } else if ((placeholder.includes('phone') || label.includes('phone')) && userInfo.phone) {
        input.value = userInfo.phone;
        fieldsFound++;
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('[Wellfound] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Intershala Autofill
 */
function autofillIntershala() {
  const userInfo = getCandidateProfile();
  console.log('[Intershala] Starting autofill');

  let fieldsFound = 0;

  // Internshala uses specific field structures
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

  inputs.forEach((input) => {
    if (!input.value) {
      const name = input.name?.toLowerCase() || '';
      const id = input.id?.toLowerCase() || '';
      const placeholder = input.placeholder?.toLowerCase() || '';

      if ((name.includes('position') || name.includes('job_title')) && currentApplication.position) {
        input.value = currentApplication.position;
        fieldsFound++;
      } else if ((name.includes('name') || id.includes('name')) && userInfo.name) {
        input.value = userInfo.name;
        fieldsFound++;
      } else if ((name.includes('email') || input.type === 'email') && userInfo.email) {
        input.value = userInfo.email;
        fieldsFound++;
      } else if ((name.includes('phone') || placeholder.includes('phone')) && userInfo.phone) {
        input.value = userInfo.phone;
        fieldsFound++;
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Auto-click apply button if found
  setTimeout(() => {
    const applyBtn = document.querySelector('button[class*="apply"], button:contains("Apply")');
    if (applyBtn && fieldsFound > 0) {
      console.log('[Intershala] Found apply button, ready to click');
    }
  }, 500);

  console.log('[Intershala] Autofill complete. Fields filled:', fieldsFound);
}

/**
 * Naukri Autofill
 */
function autofillNaukri() {
  const userInfo = getCandidateProfile();
  console.log('[Naukri] Starting autofill');

  let fieldsFound = 0;
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

  inputs.forEach((input) => {
    if (!input.value) {
      const name = input.name?.toLowerCase() || '';
      const id = input.id?.toLowerCase() || '';
      const placeholder = input.placeholder?.toLowerCase() || '';
      const label = input.getAttribute('aria-label')?.toLowerCase() || '';

      if ((name.includes('position') || placeholder.includes('position') || label.includes('position')) && currentApplication.position) {
        input.value = currentApplication.position;
        fieldsFound++;
      } else if ((name.includes('name') || id.includes('name') || placeholder.includes('name')) && userInfo.name) {
        input.value = userInfo.name;
        fieldsFound++;
      } else if ((input.type === 'email' || name.includes('email')) && userInfo.email) {
        input.value = userInfo.email;
        fieldsFound++;
      } else if ((name.includes('phone') || placeholder.includes('phone')) && userInfo.phone) {
        input.value = userInfo.phone;
        fieldsFound++;
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  console.log('[Naukri] Autofill complete. Fields filled:', fieldsFound);
}

console.log('[ContentScript] Loaded on:', window.location.href);

// Monitor for dynamic content (forms loaded after page load)
const observer = new MutationObserver(() => {
  clearTimeout(observer.timeout);
  observer.timeout = setTimeout(() => {
    if (currentApplication) {
      detectAndAutofill();
    }
  }, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

