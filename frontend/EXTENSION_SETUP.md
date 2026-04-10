# 🚀 AutoApply Extension + Web App Setup Guide

Complete guide to set up the extension + web app integration.

## 📋 Prerequisites

- Google Chrome (Chromium-based browser)
- Node.js 18+ (for Next.js dev server)
- Basic understanding of Chrome extensions

---

## 🔧 Step 1: Start the Next.js Web App

```bash
cd frontend
npm install
npm run dev
```

The web app will run at: **http://localhost:3000**

---

## 📦 Step 2: Load the Chrome Extension

### 2.1 Open Chrome Extension Manager

1. Open Chrome and go to: `chrome://extensions`
2. Toggle on **"Developer mode"** (top right corner)

### 2.2 Load the Extension

1. Click **"Load unpacked"**
2. Navigate to: `frontend/public/extension/`
3. Select the folder and click "Open"

### ✓ Extension Loaded!

You should see "AutoApply" in your extensions list.

---

## 📝 Step 3: Configure Autofill Data

### 3.1 Go to Web App

1. Open http://localhost:3000/autofill in your browser
2. (If you see a navigation menu, click "Autofill" link)

### 3.2 Fill Your Information

Complete the form with:
- ✓ Full Name
- ✓ Email Address
- ✓ Phone Number
- ✓ Skills (comma-separated)
- ✓ Target Role (e.g., "Backend Intern")
- ✓ Select platforms (LinkedIn, Internshala, Wellfound, Indeed)
- Optional: Upload Resume

### 3.3 Save & Sync

Click **"Save & Sync with Extension"**

You should see: ✓ "Data synced with extension"

---

## 🎯 Step 4: Test Autofill

### 4.1 Open a Job Posting

Go to one of these sites and find a job application form:
- https://www.linkedin.com/jobs
- https://internshala.com/jobs
- https://wellfound.com/jobs
- https://indeed.com/jobs

### 4.2 Check Extension Popup

Click the AutoApply extension icon (top right)
- You should see your saved data
- Status should show: ✓ "Data configured and ready"

### 4.3 Watch the Magic

When you open the job application form:
1. Extension detects the form
2. Automatically fills: Name, Email, Phone
3. Check browser console for autofill status

**Open DevTools** (`Ctrl+Shift+I` / `Cmd+Option+I`) → Console tab to see:
```
[ContentScript] Detected LinkedIn job page
[LinkedIn] Starting autofill...
[LinkedIn] ✓ Filled name
[LinkedIn] ✓ Filled email
[LinkedIn] ✓ Filled phone
[LinkedIn] Autofill complete. Fields filled: 3
```

---

## 🔍 Troubleshooting

### Extension not detecting forms?

1. **Check Console Logs**
   - Open DevTools on job site: `Ctrl+Shift+I`
   - Go to Console tab
   - Look for `[ContentScript]` messages

2. **Verify Data Saved**
   - Go back to http://localhost:3000/autofill
   - Check "Data Preview" section
   - Click "Save & Sync" again

3. **Reload Extension**
   - Go to `chrome://extensions`
   - Find AutoApply
   - Click the reload icon

### Extension not appearing in toolbar?

1. Go to `chrome://extensions`
2. Find "AutoApply - Job Application Autofill"
3. Click the pin icon to add to toolbar

### Data not syncing?

1. Open DevTools on web app page
2. Go to Developer Console
3. Run: `localStorage.getItem('autofillData')`
4. Should see your data. If not, re-submit the form

---

## 🛠️ Development Tips

### View Storage Data

Open DevTools → Application → Local Storage → `http://localhost:3000`

Look for key: `autofillData`

### Test Extension Messaging

In web app console:
```javascript
// Check if extension is loaded
window.postMessage({ type: 'TEST_EXTENSION' }, '*');

// Manually trigger update
window.postMessage({
  type: 'AUTOFILL_DATA_UPDATED',
  payload: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '9999999999',
    skills: 'Python, React',
    targetRole: 'Backend Developer',
    platforms: { linkedin: true, internshala: true, wellfound: true, indeed: false }
  }
}, '*');
```

### Monitor Content Script

In job site console:
```javascript
// Check if autofill data is loaded
chrome.storage.local.get(['autofillData'], (result) => {
  console.log('Stored Data:', result.autofillData);
});

// Manually trigger autofill
document.dispatchEvent(new CustomEvent('readystatechange'));
```

---

## 📱 Extension Popup Features

Click the extension icon to:
- ✓ View saved profile data
- ✓ See selected platforms
- ✓ Open settings page
- ✓ Monitor connection status

---

## 🔒 Security Notes

- ✅ All data stored **locally** in browser
- ✅ No data sent to external servers
- ✅ No sensitive logging
- ✅ Only runs on specified job sites

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Extension not installed | Reload `chrome://extensions` and try "Load unpacked" again |
| No autofill happening | Check DevTools console for errors |
| "Extension not detected" message | Install extension and reload web app |
| Form fields not filling | Some custom forms may need manual mapping in `content.js` |
| LinkedIn forms not filling | LinkedIn may require login - try refreshing the page |

---

## 📚 File Structure

```
frontend/
├── app/
│   ├── autofill/
│   │   └── page.tsx          ← Autofill configuration page
│   ├── dashboard/
│   ├── settings/
│   └── ...
├── public/
│   └── extension/
│       ├── manifest.json      ← Extension config
│       ├── background.js      ← Service worker
│       ├── content.js         ← Autofill logic
│       ├── web-bridge.js      ← Web-to-extension bridge
│       ├── popup.html         ← Extension popup UI
│       ├── popup.js           ← Popup logic
│       ├── README.md          ← Extension docs
│       └── icons/             ← Extension icons
└── components/
    ├── navbar.tsx            ← Updated with /autofill link
    └── ...
```

---

## ✨ Features Overview

### Web App (`/autofill` page)
- ✓ Form to input personal info
- ✓ Platform selection checkboxes
- ✓ Resume upload (placeholder)
- ✓ Data preview
- ✓ Save & Sync button
- ✓ Clear data option
- ✓ Extension connection indicator

### Chrome Extension
- ✓ Auto-detect job application forms
- ✓ Fill Name, Email, Phone fields
- ✓ Works on LinkedIn, Internshala, Wellfound, Indeed
- ✓ Real-time sync with web app
- ✓ Popup UI with data preview
- ✓ Persistent chrome.storage
- ✓ Dynamic form monitoring

---

## 🚀 Next Steps

1. Try the autofill on different job sites
2. Check console logs to see detection logic
3. Customize field detection in `content.js` if needed
4. Add more job sites by updating `manifest.json` and `content.js`

---

## 📞 Support

For issues:
1. Check console logs first (`Ctrl+Shift+I`)
2. Review troubleshooting section above
3. Check extension has latest code (`chrome://extensions` → reload)
4. Verify data saved in localStorage

Happy job applying! 🎉

