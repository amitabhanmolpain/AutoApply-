/**
 * popup.js - Extension popup UI logic
 */

const statusContainer = document.getElementById('status-container');
const dataContainer = document.getElementById('data-container');
const openAppBtn = document.getElementById('open-app');
const refreshBtn = document.getElementById('refresh');

// Load and display data on popup open
loadAndDisplayData();

openAppBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000' });
});

refreshBtn.addEventListener('click', () => {
  loadAndDisplayData();
});

async function loadAndDisplayData() {
  chrome.storage.local.get(['currentApplication'], (result) => {
    const data = result.currentApplication;

    if (!data) {
      renderEmptyState();
      return;
    }

    renderData(data);
  });
}

function renderEmptyState() {
  statusContainer.innerHTML = `
    <div class="status inactive">
      <div class="status-dot"></div>
      <div>No active application session</div>
    </div>
  `;

  dataContainer.innerHTML = `
    <div class="empty">
      No data available yet.<br>
      Open the web portal, choose your role, and click Start Applying.
    </div>
  `;
}

function renderData(data) {
  // Render status
  statusContainer.innerHTML = `
    <div class="status">
      <div class="status-dot"></div>
      <div>Ready to autofill selected job portals</div>
    </div>
  `;

  // Render data
  const platformsList = (data.websites || []).map((site) => {
    const platformNames = {
      linkedin: 'LinkedIn',
      indeed: 'Indeed',
      intershala: 'Intershala',
      wellfound: 'Wellfound',
      naukri: 'Naukri'
    };
    return `<div class="badge">${platformNames[site] || site}</div>`;
  }).join('');

  const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown';
  const resumePreview = data.resume
    ? data.resume.substring(0, 200) + (data.resume.length > 200 ? '...' : '')
    : 'No resume loaded';

  dataContainer.innerHTML = `
    <section class="section">
      <h3>Position</h3>
      <div class="row">
        <div class="label">Target Role</div>
        <div class="value">${escapeHtml(data.position || 'Not specified')}</div>
      </div>
    </section>

    <section class="section">
      <h3>Resume</h3>
      <div class="row">
        <div class="label">File</div>
        <div class="value">${escapeHtml(data.fileName || 'Unknown')}</div>
      </div>
      <div class="resume">${escapeHtml(resumePreview)}</div>
    </section>

    <section class="section">
      <h3>Portals (${data.websites ? data.websites.length : 0})</h3>
      <div class="portals">
        ${platformsList || '<div class="value">No portals selected</div>'}
      </div>
    </section>

    <section class="section">
      <h3>Status</h3>
      <div class="row">
        <div class="label">State</div>
        <div class="value">${escapeHtml((data.status || 'pending').toUpperCase())}</div>
      </div>
      <div class="timestamp">Last synced: ${escapeHtml(timestamp)}</div>
    </section>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Auto-refresh data when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.currentApplication) {
    loadAndDisplayData();
  }
});

// Light periodic refresh in case popup stays open
setInterval(() => {
  loadAndDisplayData();
}, 3000);
