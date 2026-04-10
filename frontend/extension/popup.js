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
  chrome.storage.local.get(['currentApplication', 'currentProfile'], (result) => {
    const data = result.currentApplication;
    let profile = result.currentProfile;

    const parsedMissing = !(data?.parsed_profile || profile?.parsed_profile);

    if (parsedMissing) {
      fetch('http://localhost:5000/api/profile/parsed')
        .then((res) => (res.ok ? res.json() : null))
        .then((parsedRes) => {
          if (parsedRes?.parsed_profile) {
            profile = {
              parsed_profile: parsedRes.parsed_profile,
              fileName: data?.fileName || profile?.fileName || 'Resume uploaded',
              timestamp: new Date().toISOString(),
            };

            chrome.storage.local.set({ currentProfile: profile }, () => {
              renderData(data, profile);
            });
            return;
          }

          if (!data && !profile) {
            renderEmptyState();
            return;
          }

          renderData(data, profile);
        })
        .catch(() => {
          if (!data && !profile) {
            renderEmptyState();
            return;
          }
          renderData(data, profile);
        });
      return;
    }

    if (!data && !profile) {
      renderEmptyState();
      return;
    }

    renderData(data, profile);
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

function renderData(data, profile) {
  const parsedProfile = data?.parsed_profile || profile?.parsed_profile || null;
  const activeData = data || {};

  // Render status
  statusContainer.innerHTML = `
    <div class="status">
      <div class="status-dot"></div>
      <div>${data ? 'Ready to autofill selected job portals' : 'Profile synced from uploaded resume'}</div>
    </div>
  `;

  // Render data
  const platformsList = (activeData.websites || []).map((site) => {
    const platformNames = {
      linkedin: 'LinkedIn',
      indeed: 'Indeed',
      intershala: 'Intershala',
      wellfound: 'Wellfound',
      naukri: 'Naukri'
    };
    return `<div class="badge">${platformNames[site] || site}</div>`;
  }).join('');

  const timestamp = (activeData.timestamp || profile?.timestamp)
    ? new Date(activeData.timestamp || profile?.timestamp).toLocaleString()
    : 'Unknown';
  const resumePreview = activeData.resume
    ? activeData.resume.substring(0, 200) + (activeData.resume.length > 200 ? '...' : '')
    : 'No resume loaded';

  const skills = Array.isArray(parsedProfile?.skills) ? parsedProfile.skills.join(', ') : 'Not available';
  const experience = Array.isArray(parsedProfile?.experience)
    ? parsedProfile.experience.map((exp) => `${exp.title || ''} @ ${exp.company || ''}`).filter(Boolean).join(' | ') || 'Not available'
    : 'Not available';
  const education = Array.isArray(parsedProfile?.education)
    ? parsedProfile.education.map((edu) => `${edu.degree || ''} ${edu.institution ? `(${edu.institution})` : ''}`).join(' | ') || 'Not available'
    : 'Not available';
  const projects = Array.isArray(parsedProfile?.projects)
    ? parsedProfile.projects.map((proj) => proj.name || '').filter(Boolean).join(' | ') || 'Not available'
    : 'Not available';
  const certifications = Array.isArray(parsedProfile?.certifications)
    ? parsedProfile.certifications.join(', ') || 'Not available'
    : 'Not available';

  dataContainer.innerHTML = `
    <section class="section">
      <h3>Position</h3>
      <div class="row">
        <div class="label">Target Role</div>
        <div class="value">${escapeHtml(activeData.position || parsedProfile?.current_title || 'Not specified')}</div>
      </div>
    </section>

    <section class="section">
      <h3>Resume</h3>
      <div class="row">
        <div class="label">File</div>
        <div class="value">${escapeHtml(activeData.fileName || profile?.fileName || 'Unknown')}</div>
      </div>
      <div class="resume">${escapeHtml(resumePreview)}</div>
    </section>

    <section class="section">
      <h3>Portals (${activeData.websites ? activeData.websites.length : 0})</h3>
      <div class="portals">
        ${platformsList || '<div class="value">No portals selected</div>'}
      </div>
    </section>

    <section class="section">
      <h3>Extracted Profile</h3>
      <div class="row"><div class="label">Full Name</div><div class="value">${escapeHtml(parsedProfile?.full_name || 'Not available')}</div></div>
      <div class="row"><div class="label">First Name</div><div class="value">${escapeHtml(parsedProfile?.first_name || 'Not available')}</div></div>
      <div class="row"><div class="label">Last Name</div><div class="value">${escapeHtml(parsedProfile?.last_name || 'Not available')}</div></div>
      <div class="row"><div class="label">Email</div><div class="value">${escapeHtml(parsedProfile?.email || 'Not available')}</div></div>
      <div class="row"><div class="label">Phone</div><div class="value">${escapeHtml(parsedProfile?.phone || 'Not available')}</div></div>
      <div class="row"><div class="label">LinkedIn</div><div class="value">${escapeHtml(parsedProfile?.linkedin || 'Not available')}</div></div>
      <div class="row"><div class="label">GitHub</div><div class="value">${escapeHtml(parsedProfile?.github || 'Not available')}</div></div>
      <div class="row"><div class="label">Portfolio</div><div class="value">${escapeHtml(parsedProfile?.portfolio || 'Not available')}</div></div>
      <div class="row"><div class="label">Location</div><div class="value">${escapeHtml(parsedProfile?.location || 'Not available')}</div></div>
      <div class="row"><div class="label">Current Title</div><div class="value">${escapeHtml(parsedProfile?.current_title || 'Not available')}</div></div>
      <div class="row"><div class="label">Summary</div><div class="value">${escapeHtml(parsedProfile?.summary || 'Not available')}</div></div>
      <div class="row"><div class="label">Skills</div><div class="value">${escapeHtml(skills)}</div></div>
      <div class="row"><div class="label">Experience</div><div class="value">${escapeHtml(experience)}</div></div>
      <div class="row"><div class="label">Education</div><div class="value">${escapeHtml(education)}</div></div>
      <div class="row"><div class="label">Projects</div><div class="value">${escapeHtml(projects)}</div></div>
      <div class="row"><div class="label">Certifications</div><div class="value">${escapeHtml(certifications)}</div></div>
    </section>

    <section class="section">
      <h3>Status</h3>
      <div class="row">
        <div class="label">State</div>
        <div class="value">${escapeHtml((activeData.status || 'synced').toUpperCase())}</div>
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
  if (changes.currentApplication || changes.currentProfile) {
    loadAndDisplayData();
  }
});

// Light periodic refresh in case popup stays open
setInterval(() => {
  loadAndDisplayData();
}, 3000);
