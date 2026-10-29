/**
 * MJD-MD-000 // CORE ARCHIVAL LOGIC & INTERACTION ENGINE
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
    "id": "MJD-EXP-01",
    "date": "October 2026",
    "title": "Interactive Dashboards",
    "category": "Frontend & Data",
    "status": "Active",
    "summary": "Zero-dependency static data dashboards hosted on GitHub Pages, delivering sub-second visual analytics for NFL tactical field positions, NBA shot charts, UFC judging scorecards, and cycling competitions.",
    "details": "Engineered with vanilla ES6 and CSS Grid without framework overhead. Showcases four live deployments: the NFL Live tactical radar and win probability engine, the NBA Live court shot chart and Scorigami tracker, an empirical scorecard audit of 31,881 UFC rounds evaluating judge dissent rates, and the Tour de France Points Classification radar. Audited with custom contrast and responsive geometry rules before deployment.",
    "tech": ["HTML5", "CSS Grid", "Vanilla JS", "GitHub Pages", "Data Analytics"],
    "links": {
      "nfl": "https://github.com/martindavies-code/nfl-live-dashboard",
      "nba": "https://github.com/martindavies-code/nba-live-dashboard",
      "ufc": "https://github.com/martindavies-code/ufc-judging-analysis",
      "tdf": "https://github.com/martindavies-code/tdf-dashboard"
    }
  },
  {
    "id": "MJD-EXP-02",
    "date": "October 2026",
    "title": "Antigravity Custom Agent Skills",
    "category": "Agentic Workflows",
    "status": "Active",
    "summary": "A collection of specialised agent skills built for Google Antigravity IDE to automate multi-step research and production tasks.",
    "details": "Includes dj-man (extracts Camelot key and BPM data to order DJ sets with verified harmonic transitions), sports-radar (compiles 24-hour UK broadcast schedules across mainstream and niche sports), and match-my-writing-style (analyses personal Workspace correspondence to strip out synthetic AI phrasing).",
    "tech": ["Google Antigravity", "Prompt Engineering", "JSON Schema", "Markdown"]
  },
  {
    "id": "MJD-EXP-03",
    "date": "August 2026",
    "title": "PromptologyLabs Reference Blueprints",
    "category": "Applied AI & Design",
    "status": "Live",
    "summary": "Structured prompt workflow blueprints and technical reference sheets designed for Google Gemini users.",
    "details": "Built during my 2026 sabbatical alongside the seven-course Google AI Professional Certificate. Combines modular information design with tested system instruction patterns to reduce repetitive rework in research and editorial pipelines.",
    "tech": ["Google Gemini", "System Instructions", "Information Design", "Etsy Digital"]
  },
  {
    "id": "MJD-EXP-04",
    "date": "July 2026",
    "title": "Windows 11 Media & Audio Pipeline Tools",
    "category": "Desktop Utilities",
    "status": "Active",
    "summary": "Native Python GUI wrappers and PowerShell automation scripts for batch media archiving and spatial audio inspection.",
    "details": "Created to bypass bloated third-party media managers on Windows 11. Wraps yt-dlp, gallery-dl, and FFmpeg into clean desktop workflows for batch downloading, metadata organisation, and verifying Dolby Atmos eARC passthrough on local .mkv and .mp4 containers.",
    "tech": ["Python", "PowerShell", "yt-dlp", "FFmpeg"]
  }
];

const FALLBACK_WRONG_MARTIN = [
  {
    "id": "IX8mW3_-ODQ",
    "date": "25 March 2026",
    "title": "Indoor Bowling Summer Season (Watch The Wood Hit The Jack)",
    "recipient": "Tony Tooley",
    "genre": "Green-Side Diss Track",
    "featured": true,
    "blurb": "Invited to sign up for summer indoor bowls friendly matches. Replied with 'Watch the wood hit the jack' -- you're going down, Tooley.",
    "url": "https://youtube.com/shorts/IX8mW3_-ODQ"
  },
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
  }
];

const FALLBACK_PLAYLISTS = [
  {
    "id": "MJD-PL-01",
    "title": "I think I am better at music than Paul McCartney",
    "genre": "Beatles Competitor Complex",
    "tracks": "Curated Selection",
    "summary": "Arrogant artists who thought they could top the actual Beatles but nevertheless didn't disgrace themselves.",
    "url": "https://open.spotify.com/playlist/4hnCZBij1qGdPZRAiE71T0?si=bbcabaaf94d8430f",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84b2d6d1d19aaf56a5c22443c5"
  },
  {
    "id": "MJD-PL-02",
    "title": "Shh! Library music that goes off",
    "genre": "Vintage Production & Funk",
    "tracks": "20 Tracks",
    "summary": "Obscure archive cues, driving library rhythms, and heavy analogue breaks that have no business hitting this hard.",
    "url": "https://open.spotify.com/playlist/4csU0MIgjxpyqKM7Px644N?si=d5c9ff2ba955438e",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84c5a4f4f9a815020bc6bd10f5"
  },
  {
    "id": "MJD-PL-03",
    "title": "Thomas the Skank Engine",
    "genre": "2-Tone & Third Wave Ska",
    "tracks": "26 Tracks",
    "summary": "Full-throttle skanking rhythms, brass stabs, and uptempo offbeats engineered for maximum velocity.",
    "url": "https://open.spotify.com/playlist/6mC7gndFXdtk3LJLbUDVgj?si=a791a47a7f1a4987",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8419cd7276e06ba1bc8c390162"
  },
  {
    "id": "MJD-PL-04",
    "title": "Motherfucking House",
    "genre": "Classic & Acid House",
    "tracks": "119 Tracks",
    "summary": "A sprawling anthology of raw Chicago 808s, soaring piano riffs, and late-night warehouse euphoria.",
    "url": "https://open.spotify.com/playlist/2BwxWj5Fu2jEYrINWq5328?si=e49ef1dda702411e",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84e67d49571fa24e26621127ce"
  },
  {
    "id": "MJD-PL-05",
    "title": "One note bangers",
    "genre": "Monotone Minimalism",
    "tracks": "17 Tracks",
    "summary": "Unapologetic masterclasses in hypnosis: tracks that lock into a single unrelenting pitch and ride it into orbit.",
    "url": "https://open.spotify.com/playlist/7qL4TX5jWjdoATM7w0r09A?si=c8491926a3c84303",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da843dd31a8ee47e06721412d08b"
  },
  {
    "id": "MJD-PL-06",
    "title": "These songs have the same name! And! Crucially! They are great!",
    "genre": "Homonymic Pop & Rock",
    "tracks": "96 Tracks",
    "summary": "Clusters of completely unrelated tracks that share the exact same title, with zero filler permitted.",
    "url": "https://open.spotify.com/playlist/3zmO1LfAtNKjO7XRbBPZjn?si=095998b5e9774b73",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84126fd21a35ada78fae9727df"
  },
  {
    "id": "MJD-PL-07",
    "title": "Beats to get shit done to",
    "genre": "High-Focus Propulsive Beats",
    "tracks": "33 Tracks",
    "summary": "Driving electronic rhythms, sharp basslines, and zero-distraction momentum for long terminal sessions.",
    "url": "https://open.spotify.com/playlist/5BEXMpfmmhUrK6eDIAHkPl?si=f6ee7b698af14c72",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8487fe6764c76be0d7a411cbed"
  },
  {
    "id": "MJD-PL-08",
    "title": "The artist name is also in the song title!",
    "genre": "Self-Referential Anthems",
    "tracks": "44 Tracks",
    "summary": "The ultimate recursive meta-tracklist: Talk Talk by Talk Talk, Bad Company by Bad Company, and beyond.",
    "url": "https://open.spotify.com/playlist/5iGsDPKitxHPFh56PZC1Sv?si=ca128496fe874803",
    "cover": "https://mosaic.scdn.co/640/ab67616d00001e020b74e9fcbe76d8245535a207ab67616d00001e0219b6a0ae303eef6370e4ee83ab67616d00001e025901aaa980d3e714bf01171cab67616d00001e0275cec6ca2727d5717f195c40"
  },
  {
    "id": "MJD-PL-09",
    "title": "Electrodiscohousemusic",
    "genre": "French Touch & Cosmic Disco",
    "tracks": "67 Tracks",
    "summary": "Glittering vocoders, compressed bass grooves, and four-to-the-floor euphoria from Paris to Chicago.",
    "url": "https://open.spotify.com/playlist/0W39nohRmhWO5fpq9CcCCz?si=d19234be1c2942bd",
    "cover": "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84b869d8503b9a0b16f41fbcfc"
  }
];

// App State
let projectsData = [];
let wrongMartinData = [];
let playlistsData = [];

/* --- Theme Management --- */
function initTheme() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const optLight = document.getElementById('theme-opt-light');
  const optDark = document.getElementById('theme-opt-dark');

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
    const isDark = theme === 'dark';
    root.setAttribute('data-theme', theme);

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
      toggleBtn.setAttribute(
        'aria-label',
        isDark
          ? 'Dark mode active. Click to switch to light mode.'
          : 'Light mode active. Click to switch to dark mode.'
      );
      toggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    if (optLight && optDark) {
      if (isDark) {
        optDark.classList.add('active');
        optDark.classList.remove('inactive');
        optLight.classList.remove('active');
        optLight.classList.add('inactive');
      } else {
        optLight.classList.add('active');
        optLight.classList.remove('inactive');
        optDark.classList.remove('active');
        optDark.classList.add('inactive');
      }
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
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  const counterEl = document.getElementById('project-counter');
  if (!container) return;

  if (counterEl) {
    counterEl.textContent = `${projectsData.length} R&D UNITS`;
  }

  if (projectsData.length === 0) {
    container.innerHTML = `<div class="loading-state">NO EXPERIMENTS FOUND</div>`;
    return;
  }

  container.innerHTML = projectsData.map(item => {
    const itemId = item.id || item.catalogue || 'MJD-EXP';
    const itemDate = item.date || '';
    const itemStatus = (item.status || 'Active').toUpperCase();
    const itemTech = item.tech || item.tags || [];

    // Parse external links (only rendered when explicit links exist)
    const linkKeys = item.links ? Object.keys(item.links) : [];
    let linksSectionHtml = '';

    if (linkKeys.length > 0) {
      const isSingleLink = linkKeys.length === 1;
      const linksHtml = linkKeys.map(key => {
        const url = item.links[key];
        const k = key.toLowerCase();
        let label = 'LINK &nearr;';
        if (k === 'nfl') label = 'NFL RADAR // GITHUB &nearr;';
        else if (k === 'nba') label = 'NBA LIVE // GITHUB &nearr;';
        else if (k === 'ufc') label = 'UFC AUDIT // GITHUB &nearr;';
        else if (k === 'tdf') label = 'TDF POINTS // GITHUB &nearr;';
        else if (k === 'github') label = 'GITHUB // REPO &nearr;';
        else if (k === 'youtube') label = 'YOUTUBE // SHORT &nearr;';
        else if (k === 'live' || k === 'demo') label = 'LAUNCH // LIVE &nearr;';
        else label = `${key.toUpperCase()} // ACCESS &nearr;`;

        return `<a href="${escapeHtml(url)}" class="card-link" target="_blank" rel="noopener noreferrer">${label}</a>`;
      }).join('');

      linksSectionHtml = `
        <div class="card-links ${isSingleLink ? 'single-link' : ''}">
          ${linksHtml}
        </div>
      `;
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
        ${linksSectionHtml}
      </article>
    `;
  }).join('');
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
    const isFeatured = Boolean(item.featured);

    return `
      <article class="short-card ${isFeatured ? 'featured' : ''}" id="card-${videoId}">
        ${isFeatured ? `
          <div class="featured-banner">
            <span>&#9733; CREATOR&apos;S PICK // FAVOURITE SONG</span>
            <span>[FEATURED]</span>
          </div>
        ` : ''}
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

/* --- Section 04: Curated Spotify Playlists --- */
async function loadPlaylists() {
  const container = document.getElementById('playlists-grid');
  try {
    const res = await fetch('./data/playlists.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    playlistsData = await res.json();
  } catch (err) {
    console.warn('Playlists fetch failed, employing inline fallback archive:', err);
    playlistsData = FALLBACK_PLAYLISTS;
  }
  renderPlaylists();
}

function renderPlaylists() {
  const container = document.getElementById('playlists-grid');
  const counterEl = document.getElementById('playlist-counter');
  if (!container) return;

  if (counterEl) {
    counterEl.textContent = `${playlistsData.length} SOUND ARCHIVES`;
  }

  container.innerHTML = playlistsData.map(item => {
    const escapedId = escapeHtml(item.id);
    const escapedTitle = escapeHtml(item.title);
    const escapedGenre = escapeHtml(item.genre);
    const escapedTracks = escapeHtml(item.tracks);
    const escapedSummary = escapeHtml(item.summary);
    const escapedUrl = escapeHtml(item.url);
    const escapedCover = escapeHtml(item.cover);

    return `
      <article class="playlist-card" id="card-${escapedId}">
        <div class="playlist-top-bar">
          <span class="playlist-cat">${escapedId}</span>
          <span class="playlist-tracks">${escapedTracks}</span>
        </div>

        <div class="playlist-cover-wrapper">
          <img
            src="${escapedCover}"
            alt="Cover artwork for ${escapedTitle}"
            class="playlist-cover-img"
            loading="lazy"
            decoding="async"
            width="640"
            height="640">
        </div>

        <div class="playlist-body">
          <div class="playlist-genre">${escapedGenre}</div>
          <h3 class="playlist-title">${escapedTitle}</h3>
          <p class="playlist-desc">${escapedSummary}</p>
        </div>

        <div class="playlist-footer">
          <a
            href="${escapedUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="spotify-btn"
            aria-label="Open ${escapedTitle} on Spotify">
            OPEN IN SPOTIFY &nearr;
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/* --- Section 05: Contact Form (Web3Forms Async Submission) --- */
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
  loadPlaylists();
  initContactForm();
});
