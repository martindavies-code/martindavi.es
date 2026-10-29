// @ts-check
/**
 * MJD-MD-000 // CORE ARCHIVAL LOGIC & INTERACTION ENGINE
 * Target: Vanilla ES6, zero external libraries.
 * UK English spelling, no em dashes, strict ISO/UK dates without commas.
 * Hardened for production resilience, security sanitisation, and zero-leak concurrency.
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
    "summary": "Arrogant artists who thought they could top the actual Beatles but nevertheless didn't disgrace themselves.",
    "url": "https://open.spotify.com/playlist/4hnCZBij1qGdPZRAiE71T0?si=bbcabaaf94d8430f",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84b2d6d1d19aaf56a5c22443c5"
  },
  {
    "id": "MJD-PL-02",
    "title": "Shh! Library music that goes off",
    "genre": "Vintage Production & Funk",
    "summary": "Obscure archive cues, driving library rhythms, and heavy analogue breaks that have no business hitting this hard.",
    "url": "https://open.spotify.com/playlist/4csU0MIgjxpyqKM7Px644N?si=d5c9ff2ba955438e",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84c5a4f4f9a815020bc6bd10f5"
  },
  {
    "id": "MJD-PL-03",
    "title": "Thomas the Skank Engine",
    "genre": "2-Tone & Third Wave Ska",
    "summary": "Full-throttle skanking rhythms, brass stabs, and uptempo offbeats engineered for maximum velocity.",
    "url": "https://open.spotify.com/playlist/6mC7gndFXdtk3LJLbUDVgj?si=a791a47a7f1a4987",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8419cd7276e06ba1bc8c390162"
  },
  {
    "id": "MJD-PL-04",
    "title": "Motherflipping House",
    "genre": "Classic & Acid House",
    "summary": "A sprawling anthology of raw Chicago 808s, soaring piano riffs, and late-night warehouse euphoria.",
    "url": "https://open.spotify.com/playlist/2BwxWj5Fu2jEYrINWq5328?si=e49ef1dda702411e",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84bfeff31b761f35a007a19b9a"
  },
  {
    "id": "MJD-PL-05",
    "title": "One note bangers",
    "genre": "Monotone Minimalism",
    "summary": "Unapologetic masterclasses in hypnosis: tracks that lock into a single unrelenting pitch and ride it into orbit.",
    "url": "https://open.spotify.com/playlist/7qL4TX5jWjdoATM7w0r09A?si=c8491926a3c84303",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da843dd31a8ee47e06721412d08b"
  },
  {
    "id": "MJD-PL-06",
    "title": "These songs have the same name! And! Crucially! They are great!",
    "genre": "Homonymic Pop & Rock",
    "summary": "Clusters of completely unrelated tracks that share the exact same title, with zero filler permitted.",
    "url": "https://open.spotify.com/playlist/3zmO1LfAtNKjO7XRbBPZjn?si=095998b5e9774b73",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84126fd21a35ada78fae9727df"
  },
  {
    "id": "MJD-PL-07",
    "title": "Beats to get shit done to",
    "genre": "High-Focus Propulsive Beats",
    "summary": "Driving electronic rhythms, sharp basslines, and zero-distraction momentum for long terminal sessions.",
    "url": "https://open.spotify.com/playlist/5BEXMpfmmhUrK6eDIAHkPl?si=f6ee7b698af14c72",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8430794a4ef7fe5bf725ff2108"
  },
  {
    "id": "MJD-PL-08",
    "title": "The artist name is also in the song title!",
    "genre": "Self-Referential Anthems",
    "summary": "The ultimate recursive meta-tracklist: Talk Talk by Talk Talk, Bad Company by Bad Company, and beyond.",
    "url": "https://open.spotify.com/playlist/5iGsDPKitxHPFh56PZC1Sv?si=ca128496fe874803",
    "cover": "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84805d4d1a45912bcbb28ab80c"
  }
];

// App State
/** @type {any[]} */
let projectsData = [];
/** @type {any[]} */
let wrongMartinData = [];
/** @type {any[]} */
let playlistsData = [];

/* --- Custom Error Hierarchy --- */
class ValidationError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class TransientNetworkError extends Error {
  /**
   * @param {string} message
   * @param {number} [status]
   */
  constructor(message, status = 500) {
    super(message);
    this.name = 'TransientNetworkError';
    this.status = status;
  }
}

/* --- Structured Diagnostic Logger --- */
/**
 * Log structured diagnostic events with sensitive credential redaction.
 * @param {'info' | 'warn' | 'error'} level
 * @param {string} code
 * @param {string} message
 * @param {Record<string, unknown>} [meta]
 * @returns {Record<string, unknown>}
 */
function logEvent(level, code, message, meta = {}) {
  const sanitizedMeta = { ...meta };
  if (sanitizedMeta.access_key) sanitizedMeta.access_key = '[REDACTED]';
  if (sanitizedMeta.email) sanitizedMeta.email = '[REDACTED]';

  const record = {
    timestamp: new Date().toISOString(),
    level,
    code,
    message,
    ...sanitizedMeta
  };

  if (level === 'error') {
    console.error(`[MJD-ARCHIVE][${code}]`, message, sanitizedMeta);
  } else if (level === 'warn') {
    console.warn(`[MJD-ARCHIVE][${code}]`, message, sanitizedMeta);
  } else {
    console.log(`[MJD-ARCHIVE][${code}]`, message, sanitizedMeta);
  }

  return record;
}

/* --- Pure Domain Utilities & Sanitisation --- */

/**
 * Escapes HTML entity characters in a string.
 * @param {unknown} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates and sanitises a URL to prevent javascript: or data: XSS injection.
 * Whitelists https:, http:, or internal relative anchor paths.
 * @param {unknown} url
 * @param {boolean} [allowRelative=true]
 * @returns {string}
 */
function sanitizeUrl(url, allowRelative = true) {
  if (typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';

  if (allowRelative && (trimmed.startsWith('#') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../'))) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
    // Malformed URL, fail safe
  }

  return '#';
}

/**
 * Strictly validates a YouTube video identifier string against allowed base64url characters.
 * @param {unknown} id
 * @returns {boolean}
 */
function isValidVideoId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{6,15}$/.test(id);
}

/**
 * Safe local storage reader that catches SecurityError / DOMException.
 * @param {Storage | null | undefined} storage
 * @param {string} key
 * @param {string} defaultValue
 * @returns {string}
 */
function safeGetStorage(storage, key, defaultValue) {
  try {
    if (!storage) return defaultValue;
    const value = storage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (err) {
    logEvent('warn', 'STORAGE_READ_FAILED', 'Failed to read from storage', { key, error: String(err) });
    return defaultValue;
  }
}

/**
 * Safe local storage writer that catches SecurityError / DOMException.
 * @param {Storage | null | undefined} storage
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
function safeSetStorage(storage, key, value) {
  try {
    if (!storage) return false;
    storage.setItem(key, value);
    return true;
  } catch (err) {
    logEvent('warn', 'STORAGE_WRITE_FAILED', 'Failed to write to storage', { key, error: String(err) });
    return false;
  }
}

/**
 * Normalises theme values to strictly 'light' or 'dark'.
 * @param {unknown} value
 * @returns {'light' | 'dark'}
 */
function normalizeTheme(value) {
  return value === 'dark' ? 'dark' : 'light';
}

/**
 * Resolves catalogue link labels for project cards.
 * @param {string} key
 * @returns {string}
 */
function resolveLinkLabel(key) {
  const k = key.toLowerCase();
  if (k === 'nfl') return 'NFL RADAR // GITHUB &nearr;';
  if (k === 'nba') return 'NBA LIVE // GITHUB &nearr;';
  if (k === 'ufc') return 'UFC AUDIT // GITHUB &nearr;';
  if (k === 'tdf') return 'TDF POINTS // GITHUB &nearr;';
  if (k === 'github') return 'GITHUB // REPO &nearr;';
  if (k === 'youtube') return 'YOUTUBE // SHORT &nearr;';
  if (k === 'live' || k === 'demo') return 'LAUNCH // LIVE &nearr;';
  return `${escapeHtml(key.toUpperCase())} // ACCESS &nearr;`;
}

/**
 * Validates and normalises contact form data fields.
 * @param {Record<string, unknown>} raw
 * @returns {{ name: string, email: string, subject: string, message: string }}
 */
function validateContactPayload(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new ValidationError('Invalid transmission payload structure.');
  }

  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const email = typeof raw.email === 'string' ? raw.email.trim() : '';
  const subject = typeof raw.subject === 'string' ? raw.subject.trim() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';

  if (!name) throw new ValidationError('Name is required before transmitting.');
  if (name.length > 100) throw new ValidationError('Name exceeds maximum limit of 100 characters.');

  if (!email) throw new ValidationError('Email is required before transmitting.');
  if (email.length > 254) throw new ValidationError('Email exceeds maximum limit of 254 characters.');

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Please provide a valid return email address.');
  }

  if (subject.length > 200) throw new ValidationError('Subject exceeds maximum limit of 200 characters.');

  if (!message) throw new ValidationError('Message content is required before transmitting.');
  if (message.length > 5000) throw new ValidationError('Message exceeds maximum limit of 5000 characters.');

  return {
    name,
    email,
    subject: subject || 'General Transmission',
    message
  };
}

/* --- Resilient Network Fetch Layer --- */

/**
 * Executes a fetch request with an explicit AbortController timeout ceiling.
 * @param {string} url
 * @param {RequestInit} [options={}]
 * @param {number} [timeoutMs=5000]
 * @param {typeof fetch} [customFetch=fetch]
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 5000, customFetch = fetch) {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeoutId = setTimeout(() => {
    controller.abort(new TransientNetworkError(`Request timed out after ${timeoutMs}ms`, 408));
  }, timeoutMs);

  try {
    const mergedOptions = { ...options, signal };
    const response = await customFetch(url, mergedOptions);
    return response;
  } catch (err) {
    if (err && (/** @type {any} */ (err).name === 'AbortError' || err instanceof TransientNetworkError)) {
      throw new TransientNetworkError(`Request timed out after ${timeoutMs}ms`, 408);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches JSON with automatic retry on transient failures and exponential backoff.
 * @param {string} url
 * @param {RequestInit} [options={}]
 * @param {{ timeoutMs?: number, maxRetries?: number, baseDelayMs?: number }} [config={}]
 * @param {typeof fetch} [customFetch=fetch]
 * @returns {Promise<any>}
 */
async function fetchJsonWithRetry(url, options = {}, { timeoutMs = 5000, maxRetries = 2, baseDelayMs = 200 } = {}, customFetch = fetch) {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs, customFetch);
      if (!res.ok) {
        if (res.status === 408 || res.status === 429 || res.status >= 500) {
          throw new TransientNetworkError(`Server returned transient status ${res.status}`, res.status);
        }
        throw new ValidationError(`HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      lastError = err;
      if (err instanceof ValidationError || attempt === maxRetries) {
        throw err;
      }
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 50;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/* --- Pure HTML Template Builders --- */

/**
 * Generates markup for a project card.
 * @param {any} item
 * @returns {string}
 */
function buildProjectCardHtml(item) {
  const itemId = item.id || item.catalogue || 'MJD-EXP';
  const itemDate = item.date || '';
  const itemStatus = (item.status || 'Active').toUpperCase();
  const itemTech = Array.isArray(item.tech) ? item.tech : (Array.isArray(item.tags) ? item.tags : []);

  const linkKeys = item.links && typeof item.links === 'object' ? Object.keys(item.links) : [];
  let linksSectionHtml = '';

  if (linkKeys.length > 0) {
    const isSingleLink = linkKeys.length === 1;
    const linksHtml = linkKeys.map(key => {
      const rawUrl = item.links[key];
      const safeUrl = sanitizeUrl(rawUrl, true);
      const label = resolveLinkLabel(key);
      return `<a href="${escapeHtml(safeUrl)}" class="card-link" target="_blank" rel="noopener noreferrer">${label}</a>`;
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
          ${itemTech.map((/** @type {string} */ t) => `<span class="tag-pill">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
      ${linksSectionHtml}
    </article>
  `;
}

/**
 * Generates markup for a Wrong Martin Short card.
 * @param {any} item
 * @param {number} index
 * @returns {string}
 */
function buildShortCardHtml(item, index) {
  const paddedIndex = `WM-${String(index + 1).padStart(2, '0')}`;
  const escapedTitle = escapeHtml(item.title);
  const escapedRecipient = escapeHtml(item.recipient);
  const escapedGenre = escapeHtml(item.genre);
  const escapedBlurb = escapeHtml(item.blurb);
  const safeUrl = sanitizeUrl(item.url, true);
  const videoId = isValidVideoId(item.id) ? item.id : '';
  const dateStr = escapeHtml(item.date);
  const isFeatured = Boolean(item.featured);

  return `
    <article class="short-card ${isFeatured ? 'featured' : ''}" id="card-${escapeHtml(videoId || paddedIndex)}">
      <div class="short-card-header ${isFeatured ? 'featured-header' : ''}">
        <span class="short-index">
          ${paddedIndex}
          ${isFeatured ? '<span class="featured-tag">&#9733; FAVOURITE</span>' : ''}
        </span>
        <span class="short-date">${dateStr}</span>
      </div>

      <div class="stage-wrapper">
        ${isFeatured ? `
          <div class="featured-stage-ribbon" aria-label="Creator's Pick: Favourite Song">
            <span>&#9733; CREATOR&apos;S PICK // FAVOURITE SONG</span>
          </div>
        ` : ''}
        <button
          class="yt-facade"
          type="button"
          data-video-id="${escapeHtml(videoId)}"
          data-title="${escapedTitle}"
          aria-label="Play YouTube Short: ${escapedTitle}">
          <img
            src="${videoId ? `https://i.ytimg.com/vi/${escapeHtml(videoId)}/hqdefault.jpg` : ''}"
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
        <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" class="yt-fallback-link">
          WATCH ON YOUTUBE &nearr;
        </a>
      </div>
    </article>
  `;
}

/**
 * Generates markup for the Wrong Martin 12th card (Submission Terminal).
 * @returns {string}
 */
function buildSubmissionCardHtml() {
  return `
    <article class="short-card submission-card" id="card-dispatch-submission">
      <div class="short-card-header">
        <span class="short-index">WM-12</span>
        <span class="short-date">INCOMING LOG</span>
      </div>

      <div class="stage-wrapper submission-stage">
        <div class="submission-terminal">
          <div class="terminal-signal-circle">
            <span class="radar-dot">&#9679;</span>
          </div>
          <div class="terminal-meta-tag">CLEARING HOUSE // AWAITING DISPATCH</div>
          <div class="terminal-callout">YOUR MISDIRECTED EMAIL COULD BE NEXT</div>
        </div>
        <span class="genre-tag">AWAITING AUDIO RESPONSE</span>
      </div>

      <div class="short-card-body">
        <h3 class="short-title">The Next Wrong Martin Davies</h3>
        <div class="short-recipient">TO: <strong>Accidental Senders Everywhere</strong></div>
        <p class="short-blurb">
          Did someone copy you in on Blackpool council tax, Welsh golf subscriptions, or tree felling? Send it through and it may become the next custom reply track.
        </p>
      </div>

      <div class="short-footer">
        <a href="#contact" class="yt-fallback-link dispatch-submit-link">
          REPORT MISDIRECTED EMAIL &darr;
        </a>
      </div>
    </article>
  `;
}

/**
 * Generates markup for a Spotify playlist card.
 * @param {any} item
 * @returns {string}
 */
function buildPlaylistCardHtml(item) {
  const escapedId = escapeHtml(item.id);
  const escapedTitle = escapeHtml(item.title);
  const escapedGenre = escapeHtml(item.genre);
  const escapedSummary = escapeHtml(item.summary);
  const safeUrl = sanitizeUrl(item.url, true);
  const safeCover = sanitizeUrl(item.cover, true);

  return `
    <article class="playlist-card" id="card-${escapedId}">
      <div class="playlist-top-bar">
        <span class="playlist-cat">${escapedId}</span>
      </div>

      <div class="playlist-cover-wrapper">
        <img
          src="${escapeHtml(safeCover)}"
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
          href="${escapeHtml(safeUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="spotify-btn"
          aria-label="Open ${escapedTitle} on Spotify">
          OPEN IN SPOTIFY &nearr;
        </a>
      </div>
    </article>
  `;
}

/**
 * Replaces a YouTube facade with an accessible, auto-playing iframe using DOM API elements.
 * @param {HTMLElement | null} stageWrapper
 * @param {string} videoId
 * @param {string} title
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @returns {boolean}
 */
function swapYoutubeFacade(stageWrapper, videoId, title, doc = (typeof document !== 'undefined' ? document : null)) {
  if (!stageWrapper || !isValidVideoId(videoId) || !doc) return false;

  const safeTitle = typeof title === 'string' && title.trim() ? title.trim() : 'YouTube Short';

  const iframe = doc.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = safeTitle;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  iframe.style.display = 'block';

  stageWrapper.replaceChildren(iframe);
  return true;
}

/* --- Section Controller Initialisers --- */

/**
 * Initialises theme management with safe storage handling and accessibility labels.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @param {Storage | null} [storage=(typeof localStorage !== 'undefined' ? localStorage : null)]
 */
function initTheme(doc = (typeof document !== 'undefined' ? document : null), storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!doc) return;
  const root = doc.documentElement;
  const toggleBtn = doc.getElementById('theme-toggle');
  const optLight = doc.getElementById('theme-opt-light');
  const optDark = doc.getElementById('theme-opt-dark');

  const rawTheme = safeGetStorage(storage, 'fac_md_theme', 'light');
  const initialTheme = normalizeTheme(rawTheme);
  applyTheme(initialTheme);

  if (toggleBtn && !toggleBtn.dataset.listenerBound) {
    toggleBtn.dataset.listenerBound = 'true';
    toggleBtn.addEventListener('click', () => {
      const currentTheme = normalizeTheme(root.getAttribute('data-theme') || 'light');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      safeSetStorage(storage, 'fac_md_theme', newTheme);
    });
  }

  /**
   * @param {'light' | 'dark'} theme
   */
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

/**
 * Loads projects archive with resilient fallback.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @param {typeof fetch | null} [customFetch=(typeof fetch !== 'undefined' ? fetch : null)]
 */
async function loadProjects(doc = (typeof document !== 'undefined' ? document : null), customFetch = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!customFetch) return;
  try {
    projectsData = await fetchJsonWithRetry('./data/projects.json', {}, { timeoutMs: 4000, maxRetries: 2 }, customFetch);
  } catch (err) {
    logEvent('warn', 'PROJECTS_FETCH_FALLBACK', 'Projects fetch failed; deploying fallback archive', { error: String(err) });
    projectsData = FALLBACK_PROJECTS;
  }
  renderProjects(doc);
}

/**
 * Renders projects grid.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 */
function renderProjects(doc = (typeof document !== 'undefined' ? document : null)) {
  if (!doc) return;
  const container = doc.getElementById('projects-grid');
  const counterEl = doc.getElementById('project-counter');
  if (!container) return;

  if (counterEl) {
    counterEl.textContent = `${projectsData.length} R&D UNITS`;
  }

  if (projectsData.length === 0) {
    container.innerHTML = `<div class="loading-state">NO EXPERIMENTS FOUND</div>`;
    return;
  }

  container.innerHTML = projectsData.map(buildProjectCardHtml).join('');
}

/**
 * Loads Wrong Martin transmissions with resilient fallback.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @param {typeof fetch | null} [customFetch=(typeof fetch !== 'undefined' ? fetch : null)]
 */
async function loadWrongMartin(doc = (typeof document !== 'undefined' ? document : null), customFetch = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!customFetch) return;
  try {
    wrongMartinData = await fetchJsonWithRetry('./data/wrong-martin.json', {}, { timeoutMs: 4000, maxRetries: 2 }, customFetch);
  } catch (err) {
    logEvent('warn', 'WRONG_MARTIN_FETCH_FALLBACK', 'Wrong Martin fetch failed; deploying fallback archive', { error: String(err) });
    wrongMartinData = FALLBACK_WRONG_MARTIN;
  }
  renderWrongMartin(doc);
}

/**
 * Renders Wrong Martin grid and binds click delegation idempotently.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 */
function renderWrongMartin(doc = (typeof document !== 'undefined' ? document : null)) {
  if (!doc) return;
  const container = doc.getElementById('wrong-martin-grid');
  if (!container) return;

  const cardsHtml = wrongMartinData.map(buildShortCardHtml).join('');
  const submissionCardHtml = buildSubmissionCardHtml();

  container.innerHTML = cardsHtml + submissionCardHtml;

  // Idempotent Event Delegation for YouTube Facades
  if (!container.dataset.listenerBound) {
    container.dataset.listenerBound = 'true';
    container.addEventListener('click', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      const facadeBtn = target.closest('.yt-facade');
      if (!facadeBtn) return;

      const videoId = facadeBtn.getAttribute('data-video-id') || '';
      const title = facadeBtn.getAttribute('data-title') || 'YouTube Short';
      const stageWrapper = /** @type {HTMLElement | null} */ (facadeBtn.closest('.stage-wrapper'));

      swapYoutubeFacade(stageWrapper, videoId, title, doc);
    });
  }
}

/**
 * Loads playlists archive with resilient fallback.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @param {typeof fetch | null} [customFetch=(typeof fetch !== 'undefined' ? fetch : null)]
 */
async function loadPlaylists(doc = (typeof document !== 'undefined' ? document : null), customFetch = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!customFetch) return;
  try {
    playlistsData = await fetchJsonWithRetry('./data/playlists.json', {}, { timeoutMs: 4000, maxRetries: 2 }, customFetch);
  } catch (err) {
    logEvent('warn', 'PLAYLISTS_FETCH_FALLBACK', 'Playlists fetch failed; deploying fallback archive', { error: String(err) });
    playlistsData = FALLBACK_PLAYLISTS;
  }
  renderPlaylists(doc);
}

/**
 * Renders playlists grid.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 */
function renderPlaylists(doc = (typeof document !== 'undefined' ? document : null)) {
  if (!doc) return;
  const container = doc.getElementById('playlists-grid');
  const counterEl = doc.getElementById('playlist-counter');
  if (!container) return;

  if (counterEl) {
    counterEl.textContent = `${playlistsData.length} SOUND ARCHIVES`;
  }

  container.innerHTML = playlistsData.map(buildPlaylistCardHtml).join('');
}

/**
 * Initialises contact form submission handler with concurrency lock and input validation.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @param {typeof fetch | null} [customFetch=(typeof fetch !== 'undefined' ? fetch : null)]
 */
function initContactForm(doc = (typeof document !== 'undefined' ? document : null), customFetch = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!doc || !customFetch) return;
  const form = /** @type {HTMLFormElement | null} */ (doc.getElementById('contact-form'));
  const statusEl = doc.getElementById('form-status');
  const submitBtn = /** @type {HTMLButtonElement | null} */ (doc.getElementById('submit-btn'));

  if (!form || !statusEl || !submitBtn) return;
  if (form.dataset.listenerBound) return;
  form.dataset.listenerBound = 'true';

  let isSubmitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      logEvent('warn', 'FORM_CONCURRENT_SUBMIT_BLOCKED', 'Blocked concurrent form submission attempt');
      return;
    }

    // Check honeypot
    const botcheck = /** @type {HTMLInputElement | null} */ (form.querySelector('input[name="botcheck"]'));
    if (botcheck && botcheck.checked) {
      logEvent('warn', 'FORM_BOT_DETECTED', 'Submission aborted via honeypot trigger');
      return;
    }

    const formData = new FormData(form);
    const rawObject = Object.fromEntries(formData.entries());

    let payload;
    try {
      payload = validateContactPayload(rawObject);
    } catch (err) {
      const msg = err instanceof ValidationError ? err.message : 'Please complete all required fields.';
      showStatus(`[ STATUS ERR: ${msg.toUpperCase()} ]`, 'error');
      return;
    }

    // Attach verified access key
    const submissionBody = {
      ...payload,
      access_key: WEB3FORMS_ACCESS_KEY
    };

    isSubmitting = true;
    submitBtn.disabled = true;
    form.setAttribute('aria-busy', 'true');
    showStatus('[ STATUS: TRANSMITTING PACKET... ]', 'sending');

    try {
      const response = await fetchWithTimeout(
        WEB3FORMS_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(submissionBody)
        },
        10000,
        customFetch
      );

      const result = await response.json();

      if (response.status === 200 && result.success) {
        showStatus('[ STATUS 200: TRANSMISSION RECEIVED. THANK YOU. ]', 'success');
        form.reset();
      } else {
        const errorMsg = result && result.message
          ? result.message
          : 'TRANSMISSION FAILED. PLEASE RETRY OR MESSAGE VIA BLUESKY.';
        showStatus(`[ STATUS ERR: ${errorMsg.toUpperCase()} ]`, 'error');
      }
    } catch (err) {
      logEvent('error', 'CONTACT_TRANSMISSION_FAILED', 'Transmission packet failed', { error: String(err) });
      const errorMsg = err instanceof TransientNetworkError
        ? 'TRANSMISSION TIMEOUT. PLEASE RETRY OR MESSAGE VIA BLUESKY.'
        : 'NETWORK ANOMALY. PLEASE RETRY OR MESSAGE VIA BLUESKY.';
      showStatus(`[ STATUS ERR: ${errorMsg} ]`, 'error');
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });

  /**
   * @param {string} text
   * @param {'sending' | 'success' | 'error'} type
   */
  function showStatus(text, type) {
    if (statusEl) {
      statusEl.className = 'form-status active';
      statusEl.classList.add(`status-${type}`);
      statusEl.textContent = text;
    }
  }
}

/**
 * Boots the entire application lifecycle concurrently with isolated failure boundaries.
 * @param {Document | null} [doc=(typeof document !== 'undefined' ? document : null)]
 * @param {Storage | null} [storage=(typeof localStorage !== 'undefined' ? localStorage : null)]
 * @param {typeof fetch | null} [customFetch=(typeof fetch !== 'undefined' ? fetch : null)]
 */
async function bootApp(doc = (typeof document !== 'undefined' ? document : null), storage = (typeof localStorage !== 'undefined' ? localStorage : null), customFetch = (typeof fetch !== 'undefined' ? fetch : null)) {
  if (!doc) return;
  initTheme(doc, storage);
  initContactForm(doc, customFetch);

  await Promise.allSettled([
    loadProjects(doc, customFetch),
    loadWrongMartin(doc, customFetch),
    loadPlaylists(doc, customFetch)
  ]);
}

/* --- DOM Ready Initialisation --- */
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootApp(document));
  } else {
    bootApp(document);
  }
}

/* --- Node.js Test / Module Exports --- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ValidationError,
    TransientNetworkError,
    logEvent,
    escapeHtml,
    sanitizeUrl,
    isValidVideoId,
    safeGetStorage,
    safeSetStorage,
    normalizeTheme,
    resolveLinkLabel,
    validateContactPayload,
    fetchWithTimeout,
    fetchJsonWithRetry,
    buildProjectCardHtml,
    buildShortCardHtml,
    buildSubmissionCardHtml,
    buildPlaylistCardHtml,
    swapYoutubeFacade,
    initTheme,
    loadProjects,
    renderProjects,
    loadWrongMartin,
    renderWrongMartin,
    loadPlaylists,
    renderPlaylists,
    initContactForm,
    bootApp,
    FALLBACK_PROJECTS,
    FALLBACK_WRONG_MARTIN,
    FALLBACK_PLAYLISTS,
    WEB3FORMS_ENDPOINT,
    WEB3FORMS_ACCESS_KEY
  };
}
