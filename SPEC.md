# SPEC.md -- Implementation Blueprint for `martindavi.es`

**Target Builder**: Flash 3.8
**Deployment Target**: GitHub Pages (Static root, custom domain `martindavi.es`)
**Catalogue Reference**: `FAC-MD-000 // SYSTEM SPECIFICATION`

---

## 1. Architecture & File Tree

Zero-bloat, zero-build static architecture using Vanilla HTML5, CSS3 (Custom Properties + CSS Grid/Flexbox), and ES6+ JavaScript. Do not introduce npm, bundlers, or external JS frameworks.

### Required Repository Structure
```text
/
├── CNAME                      # Exact single line: martindavi.es
├── index.html                 # Semantic HTML5 single-page layout
├── css/
│   └── styles.css             # Bauhaus / Factory Records / Cassette Futurism design system
├── js/
│   └── main.js                # Theme toggle, JSON hydration, YouTube facade, Web3Forms handler
├── data/
│   ├── projects.json          # 4 seeded coding experiment entries
│   └── wrong-martin.json      # Pre-existing 11 YouTube Shorts entries (DO NOT MODIFY)
└── SPEC.md                    # This specification
```

---

## 2. Aesthetic Direction & Design System

**Visual Language**: Bauhaus / 1980s Factory Records (Peter Saville) / Cassette Futurism / Teenage Engineering technical manuals.
- **Structural Grid**: Exposed `1px solid` structural borders dividing sections, headers, metadata strips, and cards. Zero border-radius (`border-radius: 0px`) across all elements.
- **Industrial Labelling**: Every section, card, and interactive control carries a catalogue code (e.g., `FAC-MD-001`, `WM-01` to `WM-11`), hazard/index markers, and technical specification metadata bars.
- **Tactile Micro-Interactions**: Crisp inverted hover states, `2px` hard offset shadows on active/hover cards, and mechanical-feeling filter and theme switches.

### Color Tokens (CSS Custom Properties)

Default to **Light Mode** (warm archival paper & stark carbon ink), with a persistent `localStorage` toggle to **Dark Mode** (matte cassette shell & phosphor/orange accents) controlled via `data-theme="dark"` on `<html>`.

```css
:root {
  --bg-primary: #F4F1EA;       /* Warm archival paper */
  --bg-secondary: #EAE5DB;     /* Subtle panel contrast */
  --bg-card: #FAF8F3;          /* Crisp card surface */
  --ink-primary: #121212;      /* Stark carbon black */
  --ink-secondary: #4A4843;    /* Muted technical grey */
  --border-color: #121212;     /* Exposed 1px grid line */
  --accent: #FF4F00;           /* International Orange */
  --accent-contrast: #FFFFFF;
  --signal-ok: #008F5A;
  --signal-err: #D92B2B;
  --font-sans: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}

[data-theme="dark"] {
  --bg-primary: #121212;       /* Carbon cassette black */
  --bg-secondary: #1A1A1A;     /* Recessed panel */
  --bg-card: #181818;          /* Dark card surface */
  --ink-primary: #F4F1EA;      /* Off-white silk-screen ink */
  --ink-secondary: #A09C94;    /* Muted warm grey */
  --border-color: #33312E;     /* Exposed 1px dark grid line */
  --accent: #FF4F00;           /* International Orange */
  --accent-contrast: #121212;
}
```

### Typography
Load Google Fonts for `Inter` (`400`, `600`, `700`, `800`) and `JetBrains Mono` (`400`, `500`, `700`).
- **Headings**: `var(--font-sans)`, uppercase or tight tracking (`letter-spacing: -0.03em`), bold/heavy weights (`700`-`800`).
- **Body**: `var(--font-sans)`, `1rem` (`16px`), `line-height: 1.6`, comfortable measure (`65ch` max on prose).
- **Technical Metadata / Labels / Dates / Catalogue Numbers**: `var(--font-mono)`, `0.75rem`-`0.85rem`, uppercase where appropriate, `letter-spacing: 0.05em`.

---

## 3. Global Header & Chassis Bar

Sticky or fixed top structural bar with `1px solid var(--border-color)` bottom border:
- **Left cell**: Catalogue stamp `FAC-MD // SE8-LON` and site title `MARTIN DAVIES`.
- **Center cell**: Anchor navigation links (`01 // ABOUT`, `02 // EXPERIMENTS`, `03 // WRONG MARTIN`, `04 // CONTACT`).
- **Right cell**: High-contrast mechanical theme toggle button (`[ LIGHT / DARK ]` or `[ PAPER / CARBON ]`) with an orange indicator LED square.

---

## 4. Core Sections Specification

### Section 1: `01 // ABOUT ME`
- **Catalogue Ref**: `FAC-MD-010 // BIOGRAPHICAL SPECIFICATION`
- **Layout**: Asymmetric 2-column Bauhaus grid (`2fr 1fr` on desktop, stacked on mobile) separated by a `1px` vertical rule.
- **Left Column (Hero & Narrative)**:
  - Headline displaying **Martin Davies** with a high-impact sub-banner in `JetBrains Mono`.
  - Concise, engaging bio incorporating all key facts:
    - Based in **London SE8**.
    - **15+ years** leading science and technology event production at **New Scientist** and the **Royal Institution**.
    - **Cambridge Natural Sciences** alumnus.
    - **Google AI for Professionals** certified.
    - Builder of AI workflows and founder/creator of **PromptologyLabs**.
    - **Melodica player** and composer of unsolicited genre-hopping replies to misdirected emails.
- **Right Column (Technical Spec Sheet / Dossier Table)**:
  - Structured key-value grid with `1px` cell borders (`LOC: LONDON SE8 (51.48° N, 0.02° W)`, `ALMA MATER: CAMBRIDGE (NAT. SCI.)`, `DOMAIN: SCI/TECH PRODUCTION & AI SYSTEMS`, `CERT: GOOGLE AI FOR PROFESSIONALS`, `LAB: PROMPTOLOGYLABS`, `INSTRUMENT: MELODICA // SYNTHS`).

---

### Section 2: `02 // CODING EXPERIMENTS`
- **Catalogue Ref**: `FAC-MD-020 // R&D ARCHIVE`
- **Data Source**: Fetch from `./data/projects.json` (with an inline fallback array in `js/main.js` if opened via `file://` protocol).
- **Interactive Filter Bar**:
  - Generated dynamically or declared with buttons: `ALL`, `AI-AGENTS`, `WORKFLOWS`, `AUTOMATION`, `WEB-TOOLS`.
  - Clicking a tag filters the visible cards immediately and updates an active project counter (`SHOWING 4 / 4 UNITS`).
- **Seed Data (`data/projects.json`)**:
  Create `data/projects.json` with 4 structured items matching this schema:
  ```json
  [
    {
      "catalogue": "FAC-MD-021",
      "title": "Antigravity Custom Agent Skills",
      "category": "AI-AGENTS",
      "status": "ACTIVE",
      "summary": "Modular skill definitions, multi-step research protocols, and tool-use guardrails engineered for autonomous coding agents inside Antigravity IDE.",
      "tags": ["Antigravity IDE", "Agentic Workflows", "Prompt Engineering", "Markdown Specs"],
      "repoUrl": "https://github.com/martindavies",
      "liveUrl": "#experiments"
    },
    {
      "catalogue": "FAC-MD-022",
      "title": "PromptologyLabs Workflow Blueprints",
      "category": "WORKFLOWS",
      "status": "PRODUCTION",
      "summary": "Structured LLM pipelines and evaluation harnesses turning messy editorial, production, and research tasks into deterministic, repeatable outputs.",
      "tags": ["PromptologyLabs", "Gemini API", "Structured Output", "System Design"],
      "repoUrl": "https://github.com/martindavies",
      "liveUrl": "#experiments"
    },
    {
      "catalogue": "FAC-MD-023",
      "title": "Media & Event Automation Utilities",
      "category": "AUTOMATION",
      "status": "DEPLOYED",
      "summary": "Command-line Python and PowerShell utilities for batch audio/video processing, transcript formatting, and live-event asset packaging.",
      "tags": ["Python", "PowerShell", "FFmpeg", "CLI Automation"],
      "repoUrl": "https://github.com/martindavies",
      "liveUrl": "#experiments"
    },
    {
      "catalogue": "FAC-MD-024",
      "title": "Cassette-Futurist Web Micro-Tools",
      "category": "WEB-TOOLS",
      "status": "ONLINE",
      "summary": "Zero-dependency browser instruments, interactive calculators, and archival interfaces built with vanilla ES6 and strict Swiss grid typography.",
      "tags": ["Vanilla JS", "CSS Grid", "Zero-Bloat", "Web Audio"],
      "repoUrl": "https://github.com/martindavies",
      "liveUrl": "https://martindavi.es"
    }
  ]
  ```
- **Card Anatomy**:
  - Top strip: Catalogue code (`FAC-MD-021`) on left, status badge (`[ACTIVE]`) on right.
  - Body: Title, concise summary, and monospace tag pills.
  - Footer strip: Split `1px` cells for `SOURCE // REPO ↗` and `LAUNCH // SPEC ↗`.

---

### Section 3: `03 // THE WRONG MARTIN DAVIES`
- **Catalogue Ref**: `FAC-MD-030 // MISDIRECTED MAIL TRANSMISSIONS`
- **Premise Header Block**:
  - Must prominently feature the exact premise quote:
    > "Because I registered a common name on Gmail early, I get strangers' invoices, car repair videos, and bowls fixtures. I reply with custom songs."
  - Include metadata counters: `ADDRESSES: martin.davies@gmail.com // martindavies@gmail.com`, `TRANSMISSIONS LOGGED: 11`, `FORMAT: 9:16 VERTICAL AUDIO-VISUAL SHORTS`.
- **Data Source**: Fetch from `./data/wrong-martin.json` (with an inline fallback copy of the 11 items in `js/main.js` so the page works seamlessly even if opened locally without a server).
- **Responsive 9:16 Vertical Card Gallery**:
  - CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))` with `1px` shared or crisp bordered cards.
  - Each card renders:
    1. **Top Catalogue Bar**: Index (`WM-01` through `WM-11`, zero-padded in array order) + `item.date`.
    2. **9:16 Media Stage (`aspect-ratio: 9 / 16`)**:
       - **CRITICAL PERFORMANCE REQUIREMENT (Click-to-Play Facade)**:
         - On initial render, **DO NOT** insert any `<iframe>` elements.
         - Render a container `<button class="yt-facade" type="button" data-video-id="{item.id}" aria-label="Play video: {item.title}">` styled to `aspect-ratio: 9 / 16; width: 100%; position: relative; overflow: hidden; background: #000;`.
         - Inside the facade button:
           - `<img src="https://i.ytimg.com/vi/{item.id}/hqdefault.jpg" alt="{item.title} thumbnail" loading="lazy" decoding="async">` (`width: 100%; height: 100%; object-fit: cover;`).
           - A Bauhaus/Factory-styled play button overlay centered on the stage (`[ ▶ PLAY TRANSMISSION ]` or geometric orange square with crisp play triangle) plus a genre stamp badge (`{item.genre}`) in the corner.
         - **Click Handler**: When clicked, replace the `.yt-facade` button's inner content (or swap the element) with:
           ```html
           <iframe
             src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
             title="${title}"
             frameborder="0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
             allowfullscreen
             style="width:100%;height:100%;border:0;display:block;">
           </iframe>
           ```
    3. **Card Metadata Panel**:
       - **Genre Pill**: `item.genre` in `var(--accent)` / monospace.
       - **Title**: `item.title` (`h3`).
       - **Recipient Line**: `TO: {item.recipient}` in `JetBrains Mono`.
       - **Blurb**: `item.blurb`.
       - **Direct Link Footer**: `<a href="{item.url}" target="_blank" rel="noopener noreferrer">WATCH ON YOUTUBE ↗</a>`.

---

### Section 4: `04 // CONTACT ME`
- **Catalogue Ref**: `FAC-MD-040 // EXTERNAL COMMUNICATIONS`
- **Layout**: 2-column asymmetric split (`3fr 2fr` on desktop, stacked on mobile).
- **Left Column -- Web3Forms Dispatch Terminal**:
  - Endpoint: `POST https://api.web3forms.com/submit`
  - Define a clearly marked JavaScript constant at the top of `js/main.js`:
    ```js
    const WEB3FORMS_ACCESS_KEY = 'f186f71c-0c63-4ea6-b656-9c6cecf4888b';
    ```
  - Also include `<input type="hidden" name="access_key" value="f186f71c-0c63-4ea6-b656-9c6cecf4888b">` inside the `<form>` element.
  - Include honeypot spam protection: `<input type="checkbox" name="botcheck" class="hidden" style="display:none;" tabindex="-1" autocomplete="off">`.
  - Required fields with visible monospace labels:
    - `NAME // SENDER` (`name="name"`, `required`)
    - `EMAIL // RETURN ADDRESS` (`type="email"`, `name="email"`, `required`)
    - `SUBJECT // CLASSIFICATION` (`name="subject"`, `required` -- e.g., placeholder `"Event Production / AI Workflows / I am actually looking for another Martin Davies"`)
    - `MESSAGE // TRANSMISSION BODY` (`<textarea name="message" rows="5" required></textarea>`)
  - Submit button: `TRANSMIT MESSAGE →`
  - **Client-Side Async Submission & Status Feedback**:
    - Intercept `submit` event with `fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(formDataObj) })`.
    - Show clear, accessible status states in a dedicated `.form-status` banner (`role="status"`, `aria-live="polite"`):
      - `SENDING`: `[ STATUS: TRANSMITTING PACKET... ]`
      - `SUCCESS`: `[ STATUS 200: TRANSMISSION RECEIVED. THANK YOU. ]` (and reset form)
      - `ERROR`: `[ STATUS ERR: TRANSMISSION FAILED. PLEASE RETRY OR MESSAGE VIA BLUESKY. ]`
- **Right Column -- Bluesky Handle Card & Notice**:
  - Prominent Factory-style dossier card linking to Bluesky:
    - **Platform**: `BLUESKY // SOCIAL NETWORK`
    - **Handle**: `@martindavi.es`
    - **URL**: `https://bsky.app/profile/martindavi.es`
    - **Call to Action**: Large full-width mechanical button `CONNECT ON BLUESKY ↗` (`target="_blank" rel="noopener noreferrer"`).
  - Include a dry-humour archival notice box below:
    - `NOTE FOR LOST SENDERS: If you are trying to pay a Welsh golf club subscription, book tree surgery, or arrange indoor bowls with Tony Tooley, you probably have the wrong Martin Davies -- but feel free to send it anyway if you want a theme tune.`

---

## 5. Footer & Deployment Files

- **Footer**: Full-width structural bar with catalogue stamp `FAC-MD-999 // END OF SPECIFICATION`, copyright `© MARTIN DAVIES // LONDON SE8`, and a `BACK TO TOP ↑` anchor link.
- **`CNAME`**: Create `/CNAME` at the repository root containing strictly:
  ```text
  martindavi.es
  ```

---

## 6. Acceptance Checklist for Flash 3.8
1. [ ] Create `CNAME` with `martindavi.es`.
2. [ ] Create `data/projects.json` with the 4 specified coding experiment entries.
3. [ ] Keep `data/wrong-martin.json` intact with all 11 YouTube Shorts entries.
4. [ ] Build `index.html`, `css/styles.css`, and `js/main.js` adhering strictly to the Bauhaus / Factory Records / Cassette Futurism aesthetic (`#F4F1EA`, `#121212`, `#FF4F00`, exposed `1px` borders, `Inter` + `JetBrains Mono`, dark/light mode toggle).
5. [ ] Verify 0 iframes exist in the DOM on initial page load; clicking any 9:16 card thumbnail swaps in the auto-playing YouTube embed iframe.
6. [ ] Verify the Web3Forms form uses `f186f71c-0c63-4ea6-b656-9c6cecf4888b` and displays live client-side status feedback alongside the Bluesky (`https://bsky.app/profile/martindavi.es`) card.
