/**
 * FAC-MD-000 // CORE ARCHIVAL LOGIC & INTERACTION ENGINE
 * Target: Vanilla ES6, zero external libraries.
 * UK English spelling, no em dashes, strict ISO/UK dates without commas.
 */

'use strict';

// Web3Forms API Endpoint & Client Key
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = 'f186f71c-0c63-4ea6-b656-9c6cecf4888b';

// Inline Fallbacks for Local / Offline / file:// Environments
const FALLBACK_PROJECTS = [
  {
    "id": "FAC-EXP-01",
    "date": "October 2026",
    "title": "Antigravity Custom Agent Skills",
    "category": "Agentic Workflows",
    "status": "Active",
    "summary": "A collection of specialised agent skills built for Google Antigravity IDE to automate multi-step research and production tasks.",
    "details": "Includes dj-man (extracts Camelot key and BPM data to order DJ sets with verified harmonic transitions), sports-radar (compiles 24-hour UK broadcast schedules across mainstream and niche sports), cover-letter-man (tailors applications for UK publishing and science communication roles), and match-my-writing-style (analyses personal Workspace correspondence to strip out synthetic AI phrasing).",
    "tech": ["Google Antigravity", "Prompt Engineering", "JSON Schema", "Markdown"],
    "links": {
      "github": "https://github.com/martindavies-code"
    }
  },
  {
    "id": "FAC-EXP-02",
    "date": "August 2026",
    "title": "PromptologyLabs Reference Blueprints",
    "category": "Applied AI & Design",
    "status": "Live",
    "summary": "Structured prompt workflow blueprints and technical reference sheets designed for Google Gemini users.",
    "details": "Built during my 2026 sabbatical alongside the seven-course Google AI Professional Certificate. Combines Swiss typographic grid layouts with tested system instruction patterns to reduce repetitive rework in research and editorial pipelines.",
    "tech": ["Google Gemini", "System Instructions", "Information Design", "Etsy Digital"],
    "links": {
      "github": "https://github.com/martindavies-code"
    }
  },
  {
    "id": "FAC-EXP-03",
    "date": "July 2026",
    "title": "Windows 11 Media & Audio Pipeline Tools",
    "category": "Desktop Utilities",
    "status": "Active",
    "summary": "Native Python GUI wrappers and PowerShell automation scripts for batch media archiving and spatial audio inspection.",
    "details": "Created to bypass bloated third-party media managers on Windows 11. Wraps yt-dlp, gallery-dl, and FFmpeg into clean desktop workflows for batch downloading, metadata organisation, and verifying Dolby Atmos eARC passthrough on local .mkv and .mp4 containers.",
    "tech": ["Python", "PowerShell", "yt-dlp", "FFmpeg"],
    "links": {
      "github": "https://github.com/martindavies-code"
    }
  },
  {
    "id": "FAC-EXP-04",
    "date": "October 2026",
    "title": "Interactive Dashboards & UI Audit Standards",
    "category": "Frontend & Data",
    "status": "Active",
    "summary": "Zero-dependency data dashboards hosted on GitHub Pages, paired with an automated UI/UX audit skill.",
    "details": "Uses vanilla HTML5, CSS Grid, and ES6 JavaScript to publish fast, static data visualisations without framework overhead. Governed by a custom polish-dashboard skill that audits contrast ratios, grid geometry, and responsive breakpoints before deployment.",
    "tech": ["HTML5", "CSS Grid", "Vanilla JS", "GitHub Pages"],
    "links": {
      "github": "https://github.com/martindavies-code"
    }
  },
  {
    "id": "FAC-EXP-05",
    "date": "May 2026",
    "title": "OctaMED to Modern DAW Tracker Experiments",
    "category": "Audio & Music Tech",
    "status": "Archive",
    "summary": "Rapid audio sketching workflows for turning misdirected emails and topical sketches into finished tracks.",
    "details": "Started on an Amiga 1200 running OctaMED in the 1990s and evolved into a fast-turnaround production pipeline blending melodica recordings, 90s Eurodance synthesis, dub basslines, and generative vocal stems for YouTube Shorts and BBC Radio comedy submissions.",
    "tech": ["Audio Production", "Melodica", "Generative Audio", "YouTube Shorts"],
    "links": {
      "youtube": "https://youtube.com/shorts/OIk50i5G6s0"
    }
  }
];

const FALLBACK_WRONG_MARTIN = [
  {
    "id": "OIk50i5G6s0",
    "date": "28 October 2026",
    "title": "98 Park Road Blackpool (Access Code)",
    "recipient": "Orbis Protect & RAM RE Property Advisors",
    "genre": "Blackpool Grime",
    "blurb": "Sent a daily security access code for a property in Blackpool. Replied with a grime track inspired by Blackpool's finest and mid-90s rides on the Big One.",
    "url": "https://youtube.com/shorts/OIk50i5G6s0"
  },
  {
    "id": "Z-TMFaZ3zMA",
    "date": "3 July 2026",
    "title": "Corporate Debt Invoice #31053436",
    "recipient": "Blackpool Council Corporate Debt Team",
    "genre": "90s Eurotechno",
    "blurb": "Chased for a housing services invoice at 89 Park Road, Blackpool. Sent a 90s Eurotechno banger to cheer up the debt team after they apologised.",
    "url": "https://youtube.com/shorts/Z-TMFaZ3zMA"
  },
  {
    "id": "KuB0ttpxOGk",
    "date": "5 June 2026",
    "title": "44 White Street, East Gosford",
    "recipient": "Belle Property (NSW, Australia)",
    "genre": "Antipodean Pop",
    "blurb": "An Australian estate agent followed up after inspecting 'my' home for sale in East Gosford.",
    "url": "https://youtube.com/shorts/KuB0ttpxOGk"
  },
  {
    "id": "ghBa_4nWZXs",
    "date": "2 May 2026",
    "title": "Coed-Y-Mwstwr Golf Club Registration",
    "recipient": "Club Secretary, Bridgend",
    "genre": "Clubhouse Groove",
    "blurb": "Billed £145 for Welsh golf club membership. I live in London and don't play golf, though the secretary now owes me a pint in South Wales.",
    "url": "https://youtube.com/shorts/ghBa_4nWZXs"
  },
  {
    "id": "JJBr4ifUx0k",
    "date": "2 May 2026",
    "title": "Tree Surgery Quotation & T&Cs",
    "recipient": "DH Tree Services Ltd",
    "genre": "Arborist Anthem",
    "blurb": "Sent a quotation and terms for tree surgery. They loved the video, even if I turned down the T&Cs.",
    "url": "https://youtube.com/shorts/JJBr4ifUx0k"
  },
  {
    "id": "REU7E_LFO4g",
    "date": "28 April 2026",
    "title": "Phishing Alert Follow-Up",
    "recipient": "Rev'd Jen",
    "genre": "Parish Synth",
    "blurb": "A vicar wrote to warn that an earlier email from her account was a phishing scam.",
    "url": "https://youtube.com/shorts/REU7E_LFO4g"
  },
  {
    "id": "bloQ4W-Yii4",
    "date": "20 April 2026",
    "title": "Half-Term Swimming Time Change",
    "recipient": "Dunottar School Estates",
    "genre": "Poolside Electronic",
    "blurb": "Asked if Ruth and I could move our Wednesday 8pm swim session to 3pm during half-term.",
    "url": "https://youtube.com/shorts/bloQ4W-Yii4"
  },
  {
    "id": "BodhwN1eMNg",
    "date": "20 April 2026",
    "title": "TEACUPs Future Music Projects",
    "recipient": "John Stafford & The TEACUPs",
    "genre": "Ensemble Remix",
    "blurb": "Copied into a batch of sheet music for an amateur music group's upcoming repertoire.",
    "url": "https://youtube.com/shorts/BodhwN1eMNg"
  },
  {
    "id": "Gnq8ufUQGcg",
    "date": "17 April 2026",
    "title": "Jaguar Land Rover Air Vents Proof",
    "recipient": "Stratstone Milton Keynes JLR",
    "genre": "Showroom Dub",
    "blurb": "Sent photographic and video evidence that a vehicle's air vents were functioning as intended.",
    "url": "https://youtube.com/shorts/Gnq8ufUQGcg"
  },
  {
    "id": "CpVKoZjK6rA",
    "date": "2 April 2026",
    "title": "Devizes to Westminster Canoe Sponsorship",
    "recipient": "ThruDark Marketing & Finance",
    "genre": "Endurance Beats",
    "blurb": "Looped into a sponsorship thread meant for canoeist Martin Deaves. Connected them with the right Martin first, then dropped the track.",
    "url": "https://youtube.com/shorts/CpVKoZjK6rA"
  },
  {
    "id": "IX8mW3_-ODQ",
    "date": "25 March 2026",
    "title": "Indoor Bowling Summer Season",
    "recipient": "Tony Tooley",
    "genre": "Green-Side Diss Track",
    "blurb": "Invited to sign up for summer indoor bowls friendly matches. 'You're going down Tooley.'",
    "url": "https://youtube.com/shorts/IX8mW3_-ODQ"
  }
];

// App State
let projectsData = [];
let wrongMartinData = [];
let activeFilter = 'ALL';

/* --- Theme Management --- */
function initTheme() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const labelEl = document.getElementById('theme-label');

  const savedTheme = localStorage.getItem('fac_md_theme') || 'light';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('fac_md_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (labelEl) {
      labelEl.textContent = theme === 'dark' ? 'CARBON' : 'PAPER';
    }
  }
}

/* --- Section 02: Coding Experiments --- */
async function loadProjects() {
  const container = document.getElementById('projects-grid');
  try {
    const res = await fetch('./data/projects.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    projectsData = await res.json();
  } catch (err) {
    console.warn('Projects fetch failed, employing inline fallback archive:', err);
    projectsData = FALLBACK_PROJECTS;
  }
  renderProjects();
  initFilters();
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  const counterEl = document.getElementById('project-counter');
  if (!container) return;

  const filtered = activeFilter === 'ALL'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  if (counterEl) {
    counterEl.textContent = `SHOWING ${filtered.length} / ${projectsData.length} UNITS`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="loading-state">NO EXPERIMENTS FOUND FOR CATEGORY [${escapeHtml(activeFilter)}]</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const itemId = item.id || item.catalogue || 'FAC-EXP';
    const itemDate = item.date || '';
    const itemStatus = (item.status || 'Active').toUpperCase();
    const itemTech = item.tech || item.tags || [];

    // Parse external links
    const linkKeys = item.links ? Object.keys(item.links) : [];
    let linksHtml = '';
    const isSingleLink = linkKeys.length === 1;

    if (linkKeys.length > 0) {
      linksHtml = linkKeys.map(key => {
        const url = item.links[key];
        let label = 'LINK &nearr;';
        if (key.toLowerCase() === 'github') label = 'GITHUB // REPO &nearr;';
        else if (key.toLowerCase() === 'youtube') label = 'YOUTUBE // SHORT &nearr;';
        else if (key.toLowerCase() === 'live' || key.toLowerCase() === 'demo') label = 'LAUNCH // LIVE &nearr;';
        else label = `${key.toUpperCase()} // ACCESS &nearr;`;

        return `<a href="${escapeHtml(url)}" class="card-link" target="_blank" rel="noopener noreferrer">${label}</a>`;
      }).join('');
    } else if (item.repoUrl || item.liveUrl) {
      linksHtml = `
        ${item.repoUrl ? `<a href="${escapeHtml(item.repoUrl)}" class="card-link" target="_blank" rel="noopener noreferrer">SOURCE // REPO &nearr;</a>` : ''}
        ${item.liveUrl ? `<a href="${escapeHtml(item.liveUrl)}" class="card-link">LAUNCH // SPEC &nearr;</a>` : ''}
      `;
    } else {
      linksHtml = `<span class="card-link">INTERNAL SPECIFICATION</span>`;
    }

    return `
      <article class="project-card" data-category="${escapeHtml(item.category)}">
        <div class="card-top-bar">
          <div class="card-cat-group">
            <span class="card-cat">${escapeHtml(itemId)}</span>
            ${itemDate ? `<span class="card-date">${escapeHtml(itemDate)}</span>` : ''}
          </div>
          <span class="card-status">[${escapeHtml(itemStatus)}]</span>
        </div>
        <div class="card-content">
          <div class="card-category-tag">${escapeHtml(item.category)}</div>
          <h3 class="card-title">${escapeHtml(item.title)}</h3>
          <p class="card-summary">${escapeHtml(item.summary)}</p>
          ${item.details ? `
            <div class="card-details">
              <p>${escapeHtml(item.details)}</p>
            </div>
          ` : ''}
          <div class="card-tags">
            ${itemTech.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
        <div class="card-links ${isSingleLink ? 'single-link' : ''}">
          ${linksHtml}
        </div>
      </article>
    `;
  }).join('');
}

function initFilters() {
  const filterContainer = document.getElementById('project-filters');
  if (!filterContainer) return;

  const categories = ['ALL', ...new Set(projectsData.map(p => p.category).filter(Boolean))];

  filterContainer.innerHTML = categories.map(cat => {
    const isActive = cat === activeFilter;
    return `<button class="filter-btn ${isActive ? 'active' : ''}" data-filter="${escapeHtml(cat)}" type="button">${escapeHtml(cat.toUpperCase())}</button>`;
  }).join('');

  filterContainer.onclick = (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.getAttribute('data-filter') || 'ALL';
    renderProjects();
  };
}

/* --- Section 03: The Wrong Martin Davies (Shorts Gallery) --- */
async function loadWrongMartin() {
  const container = document.getElementById('wrong-martin-grid');
  try {
    const res = await fetch('./data/wrong-martin.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    wrongMartinData = await res.json();
  } catch (err) {
    console.warn('Wrong Martin fetch failed, employing inline fallback archive:', err);
    wrongMartinData = FALLBACK_WRONG_MARTIN;
  }
  renderWrongMartin();
}

function renderWrongMartin() {
  const container = document.getElementById('wrong-martin-grid');
  if (!container) return;

  container.innerHTML = wrongMartinData.map((item, index) => {
    const paddedIndex = `WM-${String(index + 1).padStart(2, '0')}`;
    const escapedTitle = escapeHtml(item.title);
    const escapedRecipient = escapeHtml(item.recipient);
    const escapedGenre = escapeHtml(item.genre);
    const escapedBlurb = escapeHtml(item.blurb);
    const escapedUrl = escapeHtml(item.url);
    const videoId = escapeHtml(item.id);
    const dateStr = escapeHtml(item.date);

    return `
      <article class="short-card" id="card-${videoId}">
        <div class="short-card-header">
          <span class="short-index">${paddedIndex}</span>
          <span class="short-date">${dateStr}</span>
        </div>

        <!-- 9:16 Media Stage with Click-to-Play Facade -->
        <div class="stage-wrapper">
          <button
            class="yt-facade"
            type="button"
            data-video-id="${videoId}"
            data-title="${escapedTitle}"
            aria-label="Play YouTube Short: ${escapedTitle}">
            <img
              src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg"
              alt="Thumbnail for ${escapedTitle}"
              loading="lazy"
              decoding="async"
              width="480"
              height="854">
            <div class="play-overlay">
              <span class="play-badge">
                <span class="play-icon">&#9654;</span> PLAY SHORTS
              </span>
            </div>
            <span class="genre-tag">${escapedGenre}</span>
          </button>
        </div>

        <div class="short-card-body">
          <h3 class="short-title">${escapedTitle}</h3>
          <div class="short-recipient">TO: <strong>${escapedRecipient}</strong></div>
          <p class="short-blurb">${escapedBlurb}</p>
        </div>

        <div class="short-footer">
          <a href="${escapedUrl}" target="_blank" rel="noopener noreferrer" class="yt-fallback-link">
            WATCH ON YOUTUBE &nearr;
          </a>
        </div>
      </article>
    `;
  }).join('');

  // Event Delegation for YouTube Facades
  container.addEventListener('click', (e) => {
    const facadeBtn = e.target.closest('.yt-facade');
    if (!facadeBtn) return;

    const videoId = facadeBtn.getAttribute('data-video-id');
    const title = facadeBtn.getAttribute('data-title') || 'YouTube Short';
    const stageWrapper = facadeBtn.closest('.stage-wrapper');

    if (!stageWrapper || !videoId) return;

    // Swap facade button with responsive, autoplaying iframe
    stageWrapper.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
        title="${title}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        style="width: 100%; height: 100%; border: 0; display: block;">
      </iframe>
    `;
  });
}

/* --- Section 04: Contact Form (Web3Forms Async Submission) --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !statusEl || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot
    const botcheck = form.querySelector('input[name="botcheck"]');
    if (botcheck && botcheck.checked) {
      console.warn('Bot detected via honeypot.');
      return;
    }

    const formData = new FormData(form);
    const object = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!object.name || !object.email || !object.message) {
      showStatus('PLEASE COMPLETE ALL REQUIRED FIELDS BEFORE TRANSMITTING.', 'error');
      return;
    }

    // Ensure access key is present
    object.access_key = WEB3FORMS_ACCESS_KEY;

    // UI state: submitting
    submitBtn.disabled = true;
    showStatus('[ STATUS: TRANSMITTING PACKET... ]', 'sending');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(object)
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        showStatus('[ STATUS 200: TRANSMISSION RECEIVED. THANK YOU. ]', 'success');
        form.reset();
      } else {
        const errorMsg = result.message || 'TRANSMISSION FAILED. PLEASE RETRY OR MESSAGE VIA BLUESKY.';
        showStatus(`[ STATUS ERR: ${errorMsg.toUpperCase()} ]`, 'error');
      }
    } catch (err) {
      console.error('Transmission error:', err);
      showStatus('[ STATUS ERR: NETWORK ANOMALY. PLEASE RETRY OR MESSAGE VIA BLUESKY. ]', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showStatus(text, type) {
    statusEl.className = 'form-status active';
    statusEl.classList.add(`status-${type}`);
    statusEl.textContent = text;
  }
}

/* --- Utility Helper --- */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* --- DOM Ready Initialisation --- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadProjects();
  loadWrongMartin();
  initContactForm();
});
