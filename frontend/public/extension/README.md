# AutoApply Chrome Extension

Automatically fill job application forms on LinkedIn, Internshala, Wellfound, and Indeed.

## Installation

### For Development:

1. Open `chrome://extensions` in Chrome
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `frontend/public/extension/` folder
5. ✓ Extension installed!

### How it works:

1. Go to http://localhost:3000/autofill
2. Fill in your profile information (name, email, phone, skills, target role)
3. Select the platforms where you want to apply
4. Click "Save & Sync with Extension"
5. Open a job listing on LinkedIn, Internshala, Wellfound, or Indeed
6. The extension automatically detects the application form and fills your data

## Features

- ✅ Autofill name, email, phone on job application forms
- ✅ Works on LinkedIn, Internshala, Wellfound, Indeed
- ✅ Real-time sync with web app
- ✅ Persistent storage using chrome.storage
- ✅ Dynamic form detection (works with dynamically loaded forms)
- ✅ Detailed console logs for debugging

## Technical Details

### Files

- **manifest.json** - Extension configuration (Manifest V3)
- **background.js** - Service worker (handles storage & messaging)
- **content.js** - Injected on job sites (autofill logic)
- **web-bridge.js** - Runs on web app (message bridge)
- **popup.html/popup.js** - Extension popup UI
- **icons/** - Extension icons

### Architecture

```
Web App (Next.js)
    ↓ postMessage
Web Bridge (web-bridge.js)
    ↓ chrome.runtime.sendMessage
Background (background.js)
    ↓ Storage & Tab messaging
Content Script (content.js) on job sites
    ↓ Auto-detect & autofill
Job application forms
```

## Debugging

1. Open Chrome DevTools on a job site (`Ctrl+Shift+I` or `Cmd+Option+I`)
2. Go to Console tab
3. Look for `[ContentScript]`, `[LinkedIn]`, etc. logs
4. Check "Autofill complete" message

### Example Log Output

```
[ContentScript] Loaded autofill data: {name: "John Doe", email: "john@example.com", ...}
[ContentScript] Checking URL: https://www.linkedin.com/jobs/view/1234567890/
[ContentScript] Detected LinkedIn job page
[LinkedIn] Starting autofill...
[LinkedIn] ✓ Filled name
[LinkedIn] ✓ Filled email
[LinkedIn] ✓ Filled phone
[LinkedIn] Autofill complete. Fields filled: 3
```

## Limitations

- Resume file upload is placeholder (requires backend handling)
- Some job sites have CORS restrictions on iframe content
- LinkedIn requires careful timing due to their security measures
- Complex custom forms might not be detected

## Future Improvements

- [ ] Actual resume file upload & injection
- [ ] AI-based form field intelligence
- [ ] Application history tracking
- [ ] Auto-submit with confirmation
- [ ] Multi-language support
- [ ] Custom templates for different role types

## Security

- No data sent to external servers
- All data stored locally in browser
- No logging of sensitive information
- Runs only on specified job sites

## Support

For issues or suggestions, check the console logs first to see if the form was detected correctly.
