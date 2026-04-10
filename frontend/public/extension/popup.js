/**
 * popup.js - Extension popup UI logic
 */

const statusEl = document.getElementById('status');
const dataContainerEl = document.getElementById('data-container');
const platformsContainerEl = document.getElementById('platforms-container');
const openSettingsBtn = document.getElementById('open-settings');
const refreshBtn = document.getElementById('refresh');

// Load and display data on popup open
loadAndDisplayData();

openSettingsBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000/autofill' });
});

refreshBtn.addEventListener('click', () => {
  loadAndDisplayData();
});

async function loadAndDisplayData() {
  // Load from storage
  chrome.storage.local.get(['autofillData'], (result) => {
    const data = result.autofillData;

    if (!data) {
      statusEl.innerHTML = `
        <div class="status-dot"></div>
        <div class="status-text">No data configured</div>
      `;
      dataContainerEl.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #999;">
          <p style="font-size: 12px; margin-bottom: 10px;">No autofill data found</p>
          <p style="font-size: 11px; color: #bbb;">Click "Configure Profile" to set up your information</p>
        </div>
      `;
      platformsContainerEl.innerHTML = '';
      return;
    }

    // Show connected status
    statusEl.innerHTML = `
      <div class="status-dot"></div>
      <div class="status-text">✓ Data configured and ready</div>
    `;
    statusEl.classList.add('connected');

    // Display data preview
    const dataHtml = `
      <div class="data-item">
        <span class="data-label">Name</span>
        <span class="data-value">${data.name || '—'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Email</span>
        <span class="data-value">${data.email || '—'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Phone</span>
        <span class="data-value">${data.phone || '—'}</span>
      </div>
      <div class="data-item">
        <span class="data-label">Target Role</span>
        <span class="data-value">${data.targetRole || '—'}</span>
      </div>
    `;

    dataContainerEl.innerHTML = `<div class="data-preview">${dataHtml}</div>`;

    // Display platforms
    if (data.platforms) {
      const platformHtml = Object.entries(data.platforms)
        .map(([name, enabled]) => {
          const displayName = name === 'internshala' ? 'Internshala' : name.charAt(0).toUpperCase() + name.slice(1);
          return `
            <div class="platform-badge ${enabled ? 'active' : ''}">
              ${enabled ? '✓' : '○'} ${displayName}
            </div>
          `;
        })
        .join('');

      platformsContainerEl.innerHTML = `<div style="font-size: 11px; font-weight: 600; margin-bottom: 8px;">Platforms</div><div class="platforms">${platformHtml}</div>`;
    }
  });
}

// Auto-refresh data when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.autofillData) {
    console.log('[Popup] Data changed, reloading...');
    loadAndDisplayData();
  }
});
