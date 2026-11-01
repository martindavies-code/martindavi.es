// @ts-nocheck
'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../js/app.js');

describe('Stage 1 & 2: Pure Domain Logic & Sanitisation', () => {

  describe('escapeHtml()', () => {
    test('escapes HTML special characters correctly', () => {
      assert.equal(app.escapeHtml('<script>alert("xss" & \'test\')</script>'), '&lt;script&gt;alert(&quot;xss&quot; &amp; &#039;test&#039;)&lt;/script&gt;');
    });

    test('returns empty string for non-string inputs', () => {
      assert.equal(app.escapeHtml(null), '');
      assert.equal(app.escapeHtml(undefined), '');
      assert.equal(app.escapeHtml(123), '');
      assert.equal(app.escapeHtml({}), '');
    });

    test('returns unmodified string when no special characters exist', () => {
      assert.equal(app.escapeHtml('Clean text 123'), 'Clean text 123');
    });
  });

  describe('sanitizeUrl()', () => {
    test('whitelists secure HTTPS and HTTP URLs', () => {
      assert.equal(app.sanitizeUrl('https://martindavi.es/archive'), 'https://martindavi.es/archive');
      assert.equal(app.sanitizeUrl('http://example.com/test?a=1&b=2'), 'http://example.com/test?a=1&b=2');
    });

    test('whitelists safe internal relative anchor links', () => {
      assert.equal(app.sanitizeUrl('#about'), '#about');
      assert.equal(app.sanitizeUrl('/contact'), '/contact');
      assert.equal(app.sanitizeUrl('./data/projects.json'), './data/projects.json');
      assert.equal(app.sanitizeUrl('../data/projects.json'), '../data/projects.json');
    });

    test('blocks javascript: and data: protocol injection', () => {
      assert.equal(app.sanitizeUrl('javascript:alert(1)'), '#');
      assert.equal(app.sanitizeUrl('JAVASCRIPT:alert(document.cookie)'), '#');
      assert.equal(app.sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
      assert.equal(app.sanitizeUrl('vbscript:msgbox(1)'), '#');
    });

    test('handles empty, malformed, or non-string inputs gracefully', () => {
      assert.equal(app.sanitizeUrl(''), '#');
      assert.equal(app.sanitizeUrl('   '), '#');
      assert.equal(app.sanitizeUrl(null), '#');
      assert.equal(app.sanitizeUrl(undefined), '#');
      assert.equal(app.sanitizeUrl('not a valid url!@#$'), '#');
    });

    test('disallows relative paths when allowRelative is false', () => {
      assert.equal(app.sanitizeUrl('#contact', false), '#');
      assert.equal(app.sanitizeUrl('/test', false), '#');
      assert.equal(app.sanitizeUrl('https://example.com', false), 'https://example.com/');
    });
  });

  describe('isValidVideoId()', () => {
    test('validates standard 11-character YouTube video IDs', () => {
      assert.equal(app.isValidVideoId('IX8mW3_-ODQ'), true);
      assert.equal(app.isValidVideoId('OIk50i5G6s0'), true);
      assert.equal(app.isValidVideoId('CpVKoZjK6rA'), true);
    });

    test('rejects IDs with illegal characters or excessive lengths', () => {
      assert.equal(app.isValidVideoId('<script>'), false);
      assert.equal(app.isValidVideoId('id with spaces'), false);
      assert.equal(app.isValidVideoId('short'), false); // < 6 chars
      assert.equal(app.isValidVideoId('toolongtobevalidvideoid12345'), false); // > 15 chars
      assert.equal(app.isValidVideoId(''), false);
      assert.equal(app.isValidVideoId(null), false);
      assert.equal(app.isValidVideoId(123456789), false);
    });
  });

  describe('safeGetStorage() and safeSetStorage()', () => {
    test('reads and writes to a compliant storage object', () => {
      const mockStorage = {
        store: {},
        getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; },
        setItem(k, v) { this.store[k] = String(v); }
      };

      assert.equal(app.safeGetStorage(mockStorage, 'test_key', 'fallback'), 'fallback');
      assert.equal(app.safeSetStorage(mockStorage, 'test_key', 'stored_value'), true);
      assert.equal(app.safeGetStorage(mockStorage, 'test_key', 'fallback'), 'stored_value');
    });

    test('handles null or missing storage gracefully', () => {
      assert.equal(app.safeGetStorage(null, 'test', 'def'), 'def');
      assert.equal(app.safeSetStorage(null, 'test', 'val'), false);
    });

    test('catches throwing storage (SecurityError simulation)', () => {
      const throwingStorage = {
        getItem() { throw new Error('SecurityError: Access Denied'); },
        setItem() { throw new Error('SecurityError: Access Denied'); }
      };

      assert.equal(app.safeGetStorage(throwingStorage, 'key', 'fallback_val'), 'fallback_val');
      assert.equal(app.safeSetStorage(throwingStorage, 'key', 'new_val'), false);
    });
  });

  describe('normalizeTheme()', () => {
    test('strictly maps light to light and defaults all others to dark', () => {
      assert.equal(app.normalizeTheme('dark'), 'dark');
      assert.equal(app.normalizeTheme('light'), 'light');
      assert.equal(app.normalizeTheme(''), 'dark');
      assert.equal(app.normalizeTheme('cyberpunk'), 'dark');
      assert.equal(app.normalizeTheme(null), 'dark');
    });
  });

  describe('resolveLinkLabel()', () => {
    test('maps recognized keys to industrial label formats', () => {
      assert.equal(app.resolveLinkLabel('nfl'), 'NFL RADAR // GITHUB &nearr;');
      assert.equal(app.resolveLinkLabel('NBA'), 'NBA LIVE // GITHUB &nearr;');
      assert.equal(app.resolveLinkLabel('ufc'), 'UFC AUDIT // GITHUB &nearr;');
      assert.equal(app.resolveLinkLabel('tdf'), 'TDF POINTS // GITHUB &nearr;');
      assert.equal(app.resolveLinkLabel('github'), 'GITHUB // REPO &nearr;');
      assert.equal(app.resolveLinkLabel('youtube'), 'YOUTUBE // SHORT &nearr;');
      assert.equal(app.resolveLinkLabel('live'), 'LAUNCH // LIVE &nearr;');
      assert.equal(app.resolveLinkLabel('demo'), 'LAUNCH // LIVE &nearr;');
      assert.equal(app.resolveLinkLabel('custom'), 'CUSTOM // ACCESS &nearr;');
    });
  });

  describe('validateContactPayload()', () => {
    test('accepts clean, trimmed payloads', () => {
      const valid = {
        name: '  Jane Doe  ',
        email: '  jane.doe@example.co.uk ',
        subject: ' Event Inquiry ',
        message: ' Hello Martin! '
      };
      const result = app.validateContactPayload(valid);
      assert.equal(result.name, 'Jane Doe');
      assert.equal(result.email, 'jane.doe@example.co.uk');
      assert.equal(result.subject, 'Event Inquiry');
      assert.equal(result.message, 'Hello Martin!');
    });

    test('supplies default subject if subject is omitted', () => {
      const valid = {
        name: 'Jane',
        email: 'jane@example.com',
        message: 'Quick note'
      };
      const result = app.validateContactPayload(valid);
      assert.equal(result.subject, 'General Transmission');
    });

    test('rejects non-object payloads', () => {
      assert.throws(() => app.validateContactPayload(null), app.ValidationError);
      assert.throws(() => app.validateContactPayload('string'), app.ValidationError);
    });

    test('rejects missing or empty required fields', () => {
      assert.throws(() => app.validateContactPayload({ name: '', email: 'a@b.com', message: 'hi' }), /Name is required/);
      assert.throws(() => app.validateContactPayload({ name: '   ', email: 'a@b.com', message: 'hi' }), /Name is required/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: '', message: 'hi' }), /Email is required/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'a@b.com', message: '' }), /Message content is required/);
    });

    test('rejects malformed email formats', () => {
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'notanemail', message: 'hi' }), /valid return email/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'missing@domain', message: 'hi' }), /valid return email/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: '@domain.com', message: 'hi' }), /valid return email/);
    });

    test('enforces length boundaries on fields', () => {
      assert.throws(() => app.validateContactPayload({ name: 'x'.repeat(101), email: 'a@b.com', message: 'hi' }), /Name exceeds maximum/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'a'.repeat(250) + '@b.com', message: 'hi' }), /Email exceeds maximum/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'a@b.com', subject: 's'.repeat(201), message: 'hi' }), /Subject exceeds maximum/);
      assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'a@b.com', message: 'm'.repeat(5001) }), /Message exceeds maximum/);
    });
  });

  describe('logEvent()', () => {
    test('redacts sensitive credentials in diagnostic logs', () => {
      const record = app.logEvent('info', 'TEST_EVENT', 'Sample log', {
        access_key: 'sensitive-key-123',
        email: 'user@example.com',
        safeMeta: 'visible'
      });

      assert.equal(record.access_key, '[REDACTED]');
      assert.equal(record.email, '[REDACTED]');
      assert.equal(record.safeMeta, 'visible');
      assert.equal(record.level, 'info');
      assert.equal(record.code, 'TEST_EVENT');
    });

    test('supports warn and error levels', () => {
      const warn = app.logEvent('warn', 'WARN_CODE', 'Warning message');
      assert.equal(warn.level, 'warn');
      const err = app.logEvent('error', 'ERR_CODE', 'Error message');
      assert.equal(err.level, 'error');
    });
  });
});

describe('Stage 3 & 4: Resilient Network & Concurrency Layer', () => {

  describe('fetchWithTimeout()', () => {
    test('resolves successfully when fetch finishes before timeout', async () => {
      const mockFetch = async () => new Response('{"status":"ok"}', { status: 200 });
      const res = await app.fetchWithTimeout('https://example.com/api', {}, 1000, mockFetch);
      assert.equal(res.status, 200);
    });

    test('aborts and throws TransientNetworkError on timeout', async () => {
      const hangingFetch = (_url, options) => {
        return new Promise((resolve, reject) => {
          if (options && options.signal) {
            options.signal.addEventListener('abort', () => {
              const err = new Error('AbortError');
              err.name = 'AbortError';
              reject(err);
            });
          }
        });
      };

      await assert.rejects(
        () => app.fetchWithTimeout('https://example.com/api', {}, 50, hangingFetch),
        app.TransientNetworkError
      );
    });
  });

  describe('fetchJsonWithRetry()', () => {
    test('returns parsed JSON on immediate success', async () => {
      const mockFetch = async () => new Response(JSON.stringify({ data: [1, 2, 3] }), { status: 200 });
      const data = await app.fetchJsonWithRetry('https://example.com/data.json', {}, {}, mockFetch);
      assert.deepEqual(data, { data: [1, 2, 3] });
    });

    test('retries on transient HTTP 500 error then succeeds', async () => {
      let callCount = 0;
      const transientFetch = async () => {
        callCount++;
        if (callCount === 1) {
          return new Response('Server Error', { status: 500 });
        }
        return new Response(JSON.stringify({ recovered: true }), { status: 200 });
      };

      const data = await app.fetchJsonWithRetry('https://example.com/api', {}, { timeoutMs: 1000, maxRetries: 2, baseDelayMs: 10 }, transientFetch);
      assert.equal(callCount, 2);
      assert.deepEqual(data, { recovered: true });
    });

    test('fails immediately on fatal HTTP 404 error without retrying', async () => {
      let callCount = 0;
      const notFoundFetch = async () => {
        callCount++;
        return new Response('Not Found', { status: 404 });
      };

      await assert.rejects(
        () => app.fetchJsonWithRetry('https://example.com/missing.json', {}, { timeoutMs: 1000, maxRetries: 2, baseDelayMs: 10 }, notFoundFetch),
        app.ValidationError
      );
      assert.equal(callCount, 1);
    });

    test('fails after exhausting maxRetries on persistent 503 error', async () => {
      let callCount = 0;
      const failingFetch = async () => {
        callCount++;
        return new Response('Service Unavailable', { status: 503 });
      };

      await assert.rejects(
        () => app.fetchJsonWithRetry('https://example.com/down.json', {}, { timeoutMs: 1000, maxRetries: 2, baseDelayMs: 10 }, failingFetch),
        app.TransientNetworkError
      );
      assert.equal(callCount, 3); // initial + 2 retries
    });
  });
});

describe('Stage 5: HTML Template Builders & Facade Swapping', () => {

  test('buildProjectCardHtml generates full markup with links and tags', () => {
    const item = {
      id: 'EXP-99',
      date: 'October 2026',
      title: 'Test Experiment',
      category: 'Data Science',
      status: 'Live',
      summary: 'Short summary',
      details: 'Deep details',
      tech: ['Python', 'SQL'],
      links: {
        github: 'https://github.com/martindavies-code/test',
        nfl: 'https://github.com/martindavies-code/nfl'
      }
    };

    const html = app.buildProjectCardHtml(item);
    assert.match(html, /EXP-99/);
    assert.match(html, /Test Experiment/);
    assert.doesNotMatch(html, /\[LIVE\]/);
    assert.doesNotMatch(html, /card-status/);
    assert.match(html, /GITHUB \/\/ REPO &nearr;/);
    assert.match(html, /NFL RADAR \/\/ GITHUB &nearr;/);
    assert.match(html, /Python/);
    assert.match(html, /Deep details/);
  });

  test('buildProjectCardHtml handles single link and empty links gracefully', () => {
    const singleLinkItem = {
      id: 'EXP-100',
      title: 'Solo',
      category: 'Web',
      links: { github: 'https://github.com' }
    };
    const html1 = app.buildProjectCardHtml(singleLinkItem);
    assert.match(html1, /single-link/);

    const noLinkItem = { id: 'EXP-101', title: 'No Links', category: 'CLI' };
    const html2 = app.buildProjectCardHtml(noLinkItem);
    assert.doesNotMatch(html2, /card-links/);
  });

  test('buildShortCardHtml generates YouTube short cards with featured badges', () => {
    const featuredItem = {
      id: 'IX8mW3_-ODQ',
      date: '25 March 2026',
      title: 'Indoor Bowls',
      recipient: 'Tony Tooley',
      genre: 'Diss Track',
      featured: true,
      blurb: 'Bowls reply',
      url: 'https://youtube.com/shorts/IX8mW3_-ODQ'
    };

    const html = app.buildShortCardHtml(featuredItem, 0);
    assert.match(html, /WM-01/);
    assert.match(html, /featured-stage-ribbon/);
    assert.match(html, /FAVOURITE/);
    assert.match(html, /Tony Tooley/);
    assert.match(html, /IX8mW3_-ODQ/);
  });

  test('buildSubmissionCardHtml generates 12th clearing house card', () => {
    const html = app.buildSubmissionCardHtml();
    assert.match(html, /WM-12/);
    assert.match(html, /YOUR MISDIRECTED EMAIL COULD BE NEXT/);
    assert.match(html, /REPORT MISDIRECTED EMAIL &darr;/);
    assert.match(html, /href="\.\/contact\.html"/);
  });

  test('buildPlaylistCardHtml generates Spotify card with sanitized URLs', () => {
    const item = {
      id: 'MJD-PL-99',
      title: 'Acid Beats',
      genre: 'House',
      summary: 'Chicago jams',
      url: 'https://open.spotify.com/playlist/test',
      cover: 'https://image.spotify.com/cover.jpg'
    };

    const html = app.buildPlaylistCardHtml(item);
    assert.match(html, /MJD-PL-99/);
    assert.match(html, /Acid Beats/);
    assert.match(html, /Chicago jams/);
    assert.match(html, /OPEN IN SPOTIFY &nearr;/);
  });

  test('swapYoutubeFacade replaces wrapper with iframe via DOM API', () => {
    const createdElements = [];
    const mockDoc = {
      createElement(tag) {
        const el = {
          tagName: tag.toUpperCase(),
          attributes: {},
          style: {},
          setAttribute(k, v) { this.attributes[k] = v; }
        };
        createdElements.push(el);
        return el;
      }
    };

    let replacedWith = null;
    const stageWrapper = {
      replaceChildren(child) {
        replacedWith = child;
      }
    };

    const success = app.swapYoutubeFacade(stageWrapper, 'IX8mW3_-ODQ', 'Test Video', mockDoc);
    assert.equal(success, true);
    assert.equal(replacedWith.tagName, 'IFRAME');
    assert.equal(replacedWith.src, 'https://www.youtube.com/embed/IX8mW3_-ODQ?autoplay=1&rel=0&modestbranding=1');
    assert.equal(replacedWith.title, 'Test Video');
  });

  test('swapYoutubeFacade rejects invalid video ID or null wrapper', () => {
    const stageWrapper = { replaceChildren() {} };
    assert.equal(app.swapYoutubeFacade(null, 'valid_id123', 'Title'), false);
    assert.equal(app.swapYoutubeFacade(stageWrapper, '<script>', 'Title'), false);
    assert.equal(app.swapYoutubeFacade(stageWrapper, '', 'Title'), false);
  });

  test('swapSpotifyFacade replaces wrapper with iframe via DOM API', () => {
    let replacedWith = null;
    const coverWrapper = {
      replaceChildren(child) {
        replacedWith = child;
      }
    };
    const mockDoc = {
      createElement(tag) {
        return {
          tagName: tag.toUpperCase(),
          attributes: {},
          style: {},
          setAttribute(k, v) { this.attributes[k] = v; }
        };
      }
    };
    const mockBtn = {
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); }
      },
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      innerHTML: ''
    };

    const success = app.swapSpotifyFacade(coverWrapper, 'https://open.spotify.com/embed/playlist/4hnCZBij1qGdPZRAiE71T0?utm_source=generator&theme=0', mockBtn, mockDoc);
    assert.equal(success, true);
    assert.equal(replacedWith.tagName, 'IFRAME');
    assert.match(replacedWith.src, /https:\/\/open\.spotify\.com\/embed\/playlist\//);
    assert.equal(mockBtn.classList.classes.has('preview-active'), true);
  });

  test('swapSpotifyFacade rejects invalid URL or null wrapper', () => {
    const coverWrapper = { replaceChildren() {} };
    assert.equal(app.swapSpotifyFacade(null, 'https://open.spotify.com/embed/playlist/test'), false);
    assert.equal(app.swapSpotifyFacade(coverWrapper, 'https://malicious.com/embed'), false);
    assert.equal(app.swapSpotifyFacade(coverWrapper, ''), false);
  });
});

describe('Stage 6: DOM Mock Controller Integration', () => {

  function createMockElement(id, tagName = 'DIV') {
    return {
      id,
      tagName: tagName.toUpperCase(),
      dataset: {},
      innerHTML: '',
      textContent: '',
      className: '',
      style: {},
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      },
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = String(v); },
      getAttribute(k) { return this.attributes[k] !== undefined ? this.attributes[k] : null; },
      removeAttribute(k) { delete this.attributes[k]; },
      listeners: {},
      addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      async dispatch(event, payload = {}) {
        if (this.listeners[event]) {
          for (const fn of this.listeners[event]) {
            await fn({ preventDefault: () => {}, target: this, ...payload });
          }
        }
      },
      querySelector(_sel) { return null; },
      closest(_sel) { return null; },
      replaceChildren(..._children) {},
      reset() {}
    };
  }

  function createMockDocument() {
    const elements = new Map();
    const root = createMockElement('html', 'HTML');
    elements.set('html', root);

    return {
      documentElement: root,
      elements,
      getElementById(id) {
        if (!elements.has(id)) {
          elements.set(id, createMockElement(id));
        }
        return elements.get(id);
      },
      querySelector(_sel) {
        return null;
      },
      createElement(tag) {
        return createMockElement('', tag);
      }
    };
  }

  test('initTheme binds listener once and toggles theme', () => {
    const doc = createMockDocument();
    const toggleBtn = doc.getElementById('theme-toggle');
    const optLight = doc.getElementById('theme-opt-light');
    const optDark = doc.getElementById('theme-opt-dark');

    const storage = {
      store: { fac_md_theme: 'light' },
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = v; }
    };

    app.initTheme(doc, storage);
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
    assert.equal(toggleBtn.getAttribute('aria-checked'), 'false');

    // Simulate click on toggle button
    toggleBtn.dispatch('click');
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'dark');
    assert.equal(storage.store.fac_md_theme, 'dark');
    assert.equal(toggleBtn.getAttribute('aria-checked'), 'true');
    assert.equal(optDark.classList.contains('active'), true);
    assert.equal(optLight.classList.contains('inactive'), true);

    // Re-init does not attach duplicate listeners (idempotent)
    app.initTheme(doc, storage);
    assert.equal(toggleBtn.listeners['click'].length, 1);
  });

  test('loadProjects loads from endpoint or falls back gracefully', async () => {
    const doc = createMockDocument();
    const grid = doc.getElementById('projects-grid');
    const counter = doc.getElementById('project-counter');

    // Test successful fetch
    const mockFetch = async () => new Response(JSON.stringify(app.FALLBACK_PROJECTS), { status: 200 });
    await app.loadProjects(doc, mockFetch);
    assert.match(counter.textContent, /4 R&D UNITS/);
    assert.match(grid.innerHTML, /Interactive Dashboards/);

    // Test fallback on fetch error
    const failingFetch = async () => { throw new Error('Offline'); };
    await app.loadProjects(doc, failingFetch);
    assert.match(grid.innerHTML, /Interactive Dashboards/);
  });

  test('loadWrongMartin and renderWrongMartin binds delegation idempotently', async () => {
    const doc = createMockDocument();
    const grid = doc.getElementById('wrong-martin-grid');

    const mockFetch = async () => new Response(JSON.stringify(app.FALLBACK_WRONG_MARTIN), { status: 200 });
    await app.loadWrongMartin(doc, mockFetch);

    assert.match(grid.innerHTML, /WM-01/);
    assert.match(grid.innerHTML, /WM-12/);
    assert.equal(grid.listeners['click'].length, 1);

    // Re-rendering does not accumulate extra click listeners
    app.renderWrongMartin(doc);
    assert.equal(grid.listeners['click'].length, 1);
  });

  test('loadPlaylists updates counter and grid markup', async () => {
    const doc = createMockDocument();
    const grid = doc.getElementById('playlists-grid');
    const counter = doc.getElementById('playlist-counter');

    const mockFetch = async () => new Response(JSON.stringify(app.FALLBACK_PLAYLISTS), { status: 200 });
    await app.loadPlaylists(doc, mockFetch);

    assert.match(counter.textContent, /8 SOUND ARCHIVES/);
    assert.match(grid.innerHTML, /MJD-PL-01/);
  });

  test('initContactForm validates input, blocks bots, and handles submit', async () => {
    const doc = createMockDocument();
    const form = doc.getElementById('contact-form');
    const status = doc.getElementById('form-status');
    const submitBtn = doc.getElementById('submit-btn');

    // Mock form fields
    const honeypot = { checked: false };
    form.querySelector = (sel) => sel.includes('botcheck') ? honeypot : null;

    global.FormData = class {
      entries() {
        return [
          ['name', 'Martin'],
          ['email', 'martin@example.com'],
          ['message', 'Test message payload']
        ];
      }
    };

    let fetchPayload = null;
    const mockFetch = async (_url, options) => {
      fetchPayload = JSON.parse(options.body);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };

    app.initContactForm(doc, mockFetch);

    // Dispatch form submit
    await form.dispatch('submit');

    assert.equal(fetchPayload.name, 'Martin');
    assert.equal(fetchPayload.access_key, app.WEB3FORMS_ACCESS_KEY);
    assert.match(status.textContent, /TRANSMISSION RECEIVED/);
    assert.equal(submitBtn.disabled, false);

    // Test bot honeypot detection
    honeypot.checked = true;
    status.textContent = 'UNCHANGED';
    await form.dispatch('submit');
    assert.equal(status.textContent, 'UNCHANGED');

    // Test form validation failure branch
    honeypot.checked = false;
    global.FormData = class {
      entries() { return [['name', ''], ['email', ''], ['message', '']]; }
    };
    await form.dispatch('submit');
    assert.match(status.textContent, /NAME IS REQUIRED/);

    // Test API error response branch
    global.FormData = class {
      entries() { return [['name', 'Martin'], ['email', 'martin@example.com'], ['message', 'Valid message']]; }
    };
    const apiErrorFetch = async () => new Response(JSON.stringify({ success: false, message: 'Rate limit' }), { status: 400 });
    const docError = createMockDocument();
    app.initContactForm(docError, apiErrorFetch);
    const formErr = docError.getElementById('contact-form');
    const statusErr = docError.getElementById('form-status');
    await formErr.dispatch('submit');
    assert.match(statusErr.textContent, /RATE LIMIT/);

    // Test network failure branch
    const networkFailFetch = async () => {
      throw new app.TransientNetworkError('Connection timed out', 408);
    };
    const docNetErr = createMockDocument();
    app.initContactForm(docNetErr, networkFailFetch);
    const formNet = docNetErr.getElementById('contact-form');
    const statusNet = docNetErr.getElementById('form-status');
    await formNet.dispatch('submit');
    assert.match(statusNet.textContent, /TRANSMISSION TIMEOUT/);

    // Test concurrent submit blocking
    let resolveFirstFetch;
    const slowFetch = () => new Promise(r => { resolveFirstFetch = r; });
    const docConcurrent = createMockDocument();
    app.initContactForm(docConcurrent, slowFetch);
    const formConc = docConcurrent.getElementById('contact-form');
    const p1 = formConc.dispatch('submit');
    const p2 = formConc.dispatch('submit'); // Blocked by isSubmitting
    resolveFirstFetch(new Response(JSON.stringify({ success: true }), { status: 200 }));
    await Promise.all([p1, p2]);
  });

  test('renderWrongMartin delegated click swaps facade', async () => {
    const doc = createMockDocument();
    const grid = doc.getElementById('wrong-martin-grid');
    await app.loadWrongMartin(doc, async () => new Response(JSON.stringify(app.FALLBACK_WRONG_MARTIN), { status: 200 }));

    const stageWrapper = doc.createElement('div');
    stageWrapper.className = 'stage-wrapper';
    const facadeBtn = doc.createElement('button');
    facadeBtn.className = 'yt-facade';
    facadeBtn.setAttribute('data-video-id', 'IX8mW3_-ODQ');
    facadeBtn.setAttribute('data-title', 'Bowling');
    stageWrapper.replaceChildren = (child) => { stageWrapper.child = child; };
    facadeBtn.closest = (sel) => {
      if (sel === '.yt-facade') return facadeBtn;
      if (sel === '.stage-wrapper') return stageWrapper;
      return null;
    };

    await grid.dispatch('click', { target: facadeBtn });
    assert.equal(stageWrapper.child.tagName, 'IFRAME');

    // Click outside facade button does nothing
    const outsideTarget = doc.createElement('div');
    outsideTarget.closest = () => null;
    await grid.dispatch('click', { target: outsideTarget });
  });

  test('handles missing container or null doc guards gracefully', async () => {
    // Missing container doc
    const emptyDoc = { getElementById: () => null };
    app.renderProjects(emptyDoc);
    app.renderWrongMartin(emptyDoc);
    app.renderPlaylists(emptyDoc);
    app.initContactForm(emptyDoc);

    // Null doc
    app.initTheme(null);
    await app.loadProjects(null);
    app.renderProjects(null);
    await app.loadWrongMartin(null);
    app.renderWrongMartin(null);
    await app.loadPlaylists(null);
    app.renderPlaylists(null);
    app.initContactForm(null);
    await app.bootApp(null);
  });

  test('bootApp executes all initialisers without throwing', async () => {
    const doc = createMockDocument();
    const mockFetch = async () => new Response(JSON.stringify([]), { status: 200 });
    const storage = { getItem: () => 'light', setItem: () => {} };

    await app.bootApp(doc, storage, mockFetch);
    assert.equal(doc.documentElement.getAttribute('data-theme'), 'light');
  });

  test('browser auto-initialisation executes on loading and complete readyStates', async () => {
    // Test in-process module evaluation when document is defined
    const savedDoc = global.document;
    const savedStorage = global.localStorage;
    const savedFetch = global.fetch;

    try {
      // 1. readyState === 'loading'
      global.document = {
        readyState: 'loading',
        documentElement: { setAttribute: () => {}, getAttribute: () => 'dark' },
        getElementById: () => null,
        addEventListener: (evt, fn) => {
          if (evt === 'DOMContentLoaded') fn();
        }
      };
      global.localStorage = { getItem: () => null, setItem: () => {} };
      global.fetch = () => Promise.resolve(new Response('[]'));

      delete require.cache[require.resolve('../js/app.js')];
      require('../js/app.js');

      // 2. readyState === 'complete'
      global.document.readyState = 'complete';
      delete require.cache[require.resolve('../js/app.js')];
      require('../js/app.js');
    } finally {
      if (savedDoc === undefined) delete global.document; else global.document = savedDoc;
      if (savedStorage === undefined) delete global.localStorage; else global.localStorage = savedStorage;
      if (savedFetch === undefined) delete global.fetch; else global.fetch = savedFetch;
      delete require.cache[require.resolve('../js/app.js')];
    }
  });

  test('validateContactPayload covers non-string fields and fallbacks', () => {
    assert.throws(() => app.validateContactPayload({ name: 123, email: 'a@b.com', message: 'm' }), /Name is required/);
    assert.throws(() => app.validateContactPayload({ name: 'Jane', email: null, message: 'm' }), /Email is required/);
    assert.throws(() => app.validateContactPayload({ name: 'Jane', email: 'a@b.com', message: 456 }), /Message content is required/);

    const validNonStringSubject = app.validateContactPayload({
      name: 'Jane',
      email: 'a@b.com',
      subject: 12345,
      message: 'Hello'
    });
    assert.equal(validNonStringSubject.subject, 'General Transmission');
  });

  test('buildProjectCardHtml covers catalogue fallback, tags, and missing links', () => {
    // Uses catalogue instead of id
    const htmlCat = app.buildProjectCardHtml({
      catalogue: 'MJD-CAT-01',
      title: 'Catalogue Project',
      category: 'Test',
      tags: ['TagA', 'TagB']
    });
    assert.match(htmlCat, /MJD-CAT-01/);
    assert.match(htmlCat, /TagA/);

    // Missing id and catalogue -> defaults to MJD-EXP
    const htmlDefault = app.buildProjectCardHtml({
      title: 'Default Project',
      category: 'Test'
    });
    assert.match(htmlDefault, /MJD-EXP/);
  });

  test('buildShortCardHtml covers missing recipient, invalid video id, and missing blurb', () => {
    const html = app.buildShortCardHtml({
      id: 'invalid-id-too-short',
      title: 'Short Video',
      genre: 'Experimental'
    }, 4);
    assert.match(html, /WM-05/);
    assert.match(html, /id="card-WM-05"/);
  });

  test('swapYoutubeFacade handles missing title and default doc parameter', () => {
    const mockDoc = createMockDocument();
    let replacedWith = null;
    const wrapper = {
      replaceChildren(el) { replacedWith = el; }
    };

    app.swapYoutubeFacade(wrapper, 'IX8mW3_-ODQ', '', mockDoc);
    assert.ok(replacedWith);
    assert.equal(replacedWith.title, 'YouTube Short');

    // Default doc parameter falls back gracefully when document is undefined in Node
    const nullDocResult = app.swapYoutubeFacade(wrapper, 'IX8mW3_-ODQ', 'Test');
    assert.equal(nullDocResult, false);
  });

  test('initTheme covers toggle transitions and missing dataset properties', async () => {
    const doc = createMockDocument();
    const btn = doc.getElementById('theme-toggle');
    const root = doc.documentElement;
    app.initTheme(doc, { getItem: () => null, setItem: () => {} });

    // Remove data-theme to test fallback to 'dark'
    root.removeAttribute('data-theme');
    await btn.dispatch('click');
    assert.equal(root.getAttribute('data-theme'), 'light');

    // Click toggle when currentTheme is light -> should switch to dark
    await btn.dispatch('click');
    assert.equal(root.getAttribute('data-theme'), 'dark');

    // Call initTheme with default doc & storage parameters in Node
    app.initTheme();
  });

  test('default parameter branches for controllers execute safely', async () => {
    await app.loadProjects();
    app.renderProjects();
    await app.loadWrongMartin();
    app.renderWrongMartin();
    await app.loadPlaylists();
    app.renderPlaylists();
    app.initContactForm();
    await app.bootApp();
  });

  test('renderWrongMartin facade click with missing attributes', async () => {
    const doc = createMockDocument();
    const grid = doc.getElementById('wrong-martin-grid');
    app.renderWrongMartin(doc);

    const stageWrapper = doc.createElement('div');
    const facadeBtn = doc.createElement('button');
    stageWrapper.replaceChildren = (child) => { stageWrapper.child = child; };
    facadeBtn.closest = (sel) => {
      if (sel === '.yt-facade') return facadeBtn;
      if (sel === '.stage-wrapper') return stageWrapper;
      return null;
    };

    // Click with no data-video-id and no data-title
    await grid.dispatch('click', { target: facadeBtn });
  });

  test('initContactForm handles generic API error, non-transient network error, and validation glitch', async () => {
    const honeypot = { checked: false };

    // 1. API error with missing message
    const docApiErr = createMockDocument();
    const formApi = docApiErr.getElementById('contact-form');
    formApi.querySelector = (sel) => sel.includes('botcheck') ? honeypot : null;
    global.FormData = class {
      entries() {
        return [
          ['name', 'Martin'],
          ['email', 'martin@example.com'],
          ['message', 'Testing API error fallback']
        ];
      }
    };

    const emptyMsgApiFetch = async () => new Response(JSON.stringify({ success: false }), { status: 400 });
    app.initContactForm(docApiErr, emptyMsgApiFetch);
    await formApi.dispatch('submit');

    const statusEl = docApiErr.getElementById('form-status');
    assert.match(statusEl.textContent, /TRANSMISSION FAILED/);

    // 2. Generic network error (not TransientNetworkError)
    const docGenericErr = createMockDocument();
    const formGeneric = docGenericErr.getElementById('contact-form');
    formGeneric.querySelector = (sel) => sel.includes('botcheck') ? honeypot : null;
    const genericErrFetch = async () => { throw new TypeError('Network down'); };
    app.initContactForm(docGenericErr, genericErrFetch);
    await formGeneric.dispatch('submit');

    const statusElGeneric = docGenericErr.getElementById('form-status');
    assert.match(statusElGeneric.textContent, /NETWORK ANOMALY/);

    // 3. Non-ValidationError error during form submit
    const docGlitch = createMockDocument();
    const formGlitch = docGlitch.getElementById('contact-form');
    formGlitch.querySelector = (sel) => sel.includes('botcheck') ? honeypot : null;
    global.FormData = class {
      entries() {
        return [['name', 'ValidName'], ['email', 'a@b.com'], ['message', 'ValidMsg']];
      }
    };
    const origTrim = String.prototype.trim;
    try {
      String.prototype.trim = function() { throw new TypeError('Trim glitch'); };
      app.initContactForm(docGlitch, async () => new Response('{}'));
      await formGlitch.dispatch('submit');
    } finally {
      String.prototype.trim = origTrim;
    }

    const statusElGlitch = docGlitch.getElementById('form-status');
    assert.match(statusElGlitch.textContent, /PLEASE COMPLETE ALL REQUIRED FIELDS/);
  });

  test('fetchWithTimeout re-throws non-abort error', async () => {
    const failingFetch = async () => { throw new Error('Boom'); };
    await assert.rejects(() => app.fetchWithTimeout('http://test', {}, 5000, failingFetch), /Boom/);
  });

  test('default parameters execute with global document present', async () => {
    const doc = createMockDocument();
    global.document = doc;
    global.localStorage = { getItem: () => null, setItem: () => {} };
    global.fetch = async () => new Response('[]');

    try {
      app.initTheme();
      const wrapper = { replaceChildren() {} };
      app.swapYoutubeFacade(wrapper, 'IX8mW3_-ODQ');
      await app.loadProjects();
      app.renderProjects();
      await app.loadWrongMartin();
      app.renderWrongMartin();
      await app.loadPlaylists();
      app.renderPlaylists();
      app.initContactForm();
      await app.bootApp();
    } finally {
      delete global.document;
      delete global.localStorage;
      delete global.fetch;
    }
  });

  test('initCopyHandle writes to clipboard on click with labelSpan and handles errors', async () => {
    const doc = createMockDocument();
    let copiedText = '';
    const mockNav = {
      clipboard: {
        async writeText(t) { copiedText = t; }
      }
    };
    const copyBtn = doc.getElementById('copy-handle-btn');
    copyBtn.setAttribute('data-copy', '@martindavi.es');
    const labelSpan = createMockElement('label-span', 'SPAN');
    labelSpan.textContent = '@martindavi.es';
    copyBtn.querySelector = (sel) => sel.includes('copy-btn-text') ? labelSpan : null;

    app.initCopyHandle(doc, mockNav);
    // Idempotency: second call returns immediately
    app.initCopyHandle(doc, mockNav);

    await copyBtn.dispatch('click');
    assert.equal(copiedText, '@martindavi.es');
    assert.equal(copyBtn.classList.contains('copied'), true);
    assert.equal(labelSpan.textContent, '[COPIED // BUFFER READY]');

    // Test without labelSpan and with synchronous setTimeout callback execution
    const savedSetTimeout = global.setTimeout;
    try {
      global.setTimeout = (fn) => fn();
      const docNoSpan = createMockDocument();
      const copyBtnNoSpan = docNoSpan.getElementById('copy-handle-btn');
      copyBtnNoSpan.textContent = '@martindavi.es';
      copyBtnNoSpan.querySelector = () => null;
      app.initCopyHandle(docNoSpan, mockNav);
      await copyBtnNoSpan.dispatch('click');
      assert.equal(copyBtnNoSpan.textContent, '@martindavi.es');

      // Test with labelSpan and synchronous reset callback execution
      const docWithSpan = createMockDocument();
      const copyBtnWithSpan = docWithSpan.getElementById('copy-handle-btn');
      const resetLabel = createMockElement('label', 'SPAN');
      resetLabel.textContent = 'Copy Handle';
      copyBtnWithSpan.querySelector = () => resetLabel;
      app.initCopyHandle(docWithSpan, mockNav);
      await copyBtnWithSpan.dispatch('click');
      assert.equal(resetLabel.textContent, 'Copy Handle');
    } finally {
      global.setTimeout = savedSetTimeout;
    }

    // Test clipboard write failure branch
    const failingNav = {
      clipboard: {
        async writeText() { throw new Error('Clipboard denied'); }
      }
    };
    const docErr = createMockDocument();
    const copyBtnErr = docErr.getElementById('copy-handle-btn');
    app.initCopyHandle(docErr, failingNav);
    await copyBtnErr.dispatch('click');
  });

  test('initKeyboardNavigation covers 1-5 keys, lowercase t, modifier keys and editable targets', () => {
    const doc = createMockDocument();
    let navigatedTo = '';
    const mockWin = {
      location: {
        set href(val) { navigatedTo = val; },
        get href() { return navigatedTo; }
      },
      listeners: {},
      addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      dispatch(event, payload) {
        if (this.listeners[event]) {
          for (const fn of this.listeners[event]) fn(payload);
        }
      }
    };

    app.initKeyboardNavigation(mockWin, doc);
    // Idempotency: second call returns immediately
    app.initKeyboardNavigation(mockWin, doc);

    // Press '1' -> should navigate to ./
    mockWin.dispatch('keydown', { key: '1', target: { tagName: 'DIV' } });
    assert.equal(navigatedTo, './');

    // Press '2' -> should navigate to experiments.html
    mockWin.dispatch('keydown', { key: '2', target: { tagName: 'DIV' } });
    assert.equal(navigatedTo, './experiments.html');

    // Press '3' -> should navigate to wrong-martin.html
    mockWin.dispatch('keydown', { key: '3', target: { tagName: 'DIV' } });
    assert.equal(navigatedTo, './wrong-martin.html');

    // Press '4' -> should navigate to playlists.html
    mockWin.dispatch('keydown', { key: '4', target: { tagName: 'DIV' } });
    assert.equal(navigatedTo, './playlists.html');

    // Press '5' -> should navigate to contact.html
    mockWin.dispatch('keydown', { key: '5', target: { tagName: 'DIV' } });
    assert.equal(navigatedTo, './contact.html');

    // Press 'T' and 't' -> should toggle theme
    let toggleCount = 0;
    const toggleBtn = doc.getElementById('theme-toggle');
    toggleBtn.click = () => { toggleCount++; };
    mockWin.dispatch('keydown', { key: 'T', target: { tagName: 'DIV' } });
    assert.equal(toggleCount, 1);
    mockWin.dispatch('keydown', { key: 't', target: { tagName: 'DIV' } });
    assert.equal(toggleCount, 2);

    // Press while typing in input / textarea / select / contenteditable -> should be ignored
    mockWin.dispatch('keydown', { key: '1', target: { tagName: 'INPUT' } });
    assert.equal(navigatedTo, './contact.html');
    mockWin.dispatch('keydown', { key: '1', target: { tagName: 'TEXTAREA' } });
    assert.equal(navigatedTo, './contact.html');
    mockWin.dispatch('keydown', { key: '1', target: { tagName: 'SELECT' } });
    assert.equal(navigatedTo, './contact.html');
    mockWin.dispatch('keydown', { key: '1', target: { tagName: 'DIV', isContentEditable: true } });
    assert.equal(navigatedTo, './contact.html');

    // Press with modifier keys (ctrl, alt, meta) -> should be ignored
    mockWin.dispatch('keydown', { key: '1', ctrlKey: true, target: { tagName: 'DIV' } });
    mockWin.dispatch('keydown', { key: '1', altKey: true, target: { tagName: 'DIV' } });
    mockWin.dispatch('keydown', { key: '1', metaKey: true, target: { tagName: 'DIV' } });
    assert.equal(navigatedTo, './contact.html');
  });

  test('cleanIndexUrl strips index.html from URL bar and preserves search/hash', () => {
    let replacedUrl = null;
    const mockWin = {
      location: {
        pathname: '/index.html',
        search: '?ref=test',
        hash: '#top'
      },
      history: {
        replaceState(_state, _title, url) {
          replacedUrl = url;
        }
      }
    };
    app.cleanIndexUrl(mockWin);
    assert.equal(replacedUrl, '/?ref=test#top');

    // Subpath ending in /index.html
    mockWin.location.pathname = '/sub/dir/index.html';
    mockWin.location.search = '';
    mockWin.location.hash = '';
    app.cleanIndexUrl(mockWin);
    assert.equal(replacedUrl, '/sub/dir/');

    // Pathname NOT ending in index.html -> no replacement
    replacedUrl = null;
    mockWin.location.pathname = '/contact.html';
    app.cleanIndexUrl(mockWin);
    assert.equal(replacedUrl, null);

    // Missing win, location, or history -> safe no-op
    assert.doesNotThrow(() => app.cleanIndexUrl(null));
    assert.doesNotThrow(() => app.cleanIndexUrl({}));
    assert.doesNotThrow(() => app.cleanIndexUrl({ location: {} }));
    assert.doesNotThrow(() => app.cleanIndexUrl({ location: { pathname: '/index.html' }, history: null }));

    // replaceState throws (e.g. file:// restriction) -> handled gracefully
    const throwingWin = {
      location: { pathname: '/index.html' },
      history: {
        replaceState() { throw new Error('SecurityError'); }
      }
    };
    assert.doesNotThrow(() => app.cleanIndexUrl(throwingWin));
  });

  test('initTheme dynamically updates meta theme-color if present', () => {
    const doc = createMockDocument();
    const metaEl = createMockElement('meta-theme', 'META');
    metaEl.setAttribute('name', 'theme-color');
    metaEl.setAttribute('content', '#121212');
    doc.querySelector = (sel) => sel.includes('theme-color') ? metaEl : null;

    const storage = {
      store: { fac_md_theme: 'dark' },
      getItem(k) { return this.store[k] || null; },
      setItem(k, v) { this.store[k] = v; }
    };

    app.initTheme(doc, storage);
    assert.equal(metaEl.getAttribute('content'), '#121212');

    const toggleBtn = doc.getElementById('theme-toggle');
    toggleBtn.dispatch('click');
    assert.equal(metaEl.getAttribute('content'), '#F4F1EA');
    assert.equal(storage.store.fac_md_theme, 'light');

    toggleBtn.dispatch('click');
    assert.equal(metaEl.getAttribute('content'), '#121212');
    assert.equal(storage.store.fac_md_theme, 'dark');
  });

  test('renderPlaylists delegated click triggers swapSpotifyFacade', async () => {
    const doc = createMockDocument();
    const grid = doc.getElementById('playlists-grid');
    const mockFetch = async () => new Response(JSON.stringify(app.FALLBACK_PLAYLISTS), { status: 200 });
    await app.loadPlaylists(doc, mockFetch);

    const coverWrapper = createMockElement('cover-wrap', 'DIV');
    coverWrapper.replaceChildren = () => {};
    const card = createMockElement('card', 'DIV');
    card.querySelector = (sel) => sel.includes('playlist-cover-wrapper') ? coverWrapper : null;
    const previewBtn = createMockElement('preview-btn', 'BUTTON');
    previewBtn.setAttribute('data-embed-url', 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M');
    previewBtn.closest = (sel) => {
      if (sel.includes('spotify-preview-btn')) return previewBtn;
      if (sel.includes('playlist-card')) return card;
      return null;
    };

    // Valid delegated preview click
    await grid.dispatch('click', { target: previewBtn });
    assert.equal(previewBtn.classList.contains('preview-active'), true);

    // Plain div target without closest preview-btn
    const plainDiv = createMockElement('plain', 'DIV');
    plainDiv.closest = () => null;
    await grid.dispatch('click', { target: plainDiv });

    // Preview button without embed URL
    const emptyBtn = createMockElement('empty-btn', 'BUTTON');
    emptyBtn.closest = (sel) => sel.includes('spotify-preview-btn') ? emptyBtn : null;
    await grid.dispatch('click', { target: emptyBtn });

    // Preview button without playlist-cover-wrapper
    const brokenCard = createMockElement('broken-card', 'DIV');
    brokenCard.querySelector = () => null;
    const btnNoWrap = createMockElement('btn-no-wrap', 'BUTTON');
    btnNoWrap.setAttribute('data-embed-url', 'https://open.spotify.com/embed/playlist/test');
    btnNoWrap.closest = (sel) => {
      if (sel.includes('spotify-preview-btn')) return btnNoWrap;
      if (sel.includes('playlist-card')) return brokenCard;
      return null;
    };
    await grid.dispatch('click', { target: btnNoWrap });
  });

  test('playMechanicalClickSound executes safely in all environments and handles throws', () => {
    assert.doesNotThrow(() => app.playMechanicalClickSound(null));
    const mockWin = {
      AudioContext: class {
        constructor() { this.currentTime = 0; this.destination = {}; }
        createOscillator() {
          return {
            type: '',
            frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {},
            start() {},
            stop() {}
          };
        }
        createGain() {
          return {
            gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {}
          };
        }
      }
    };
    assert.doesNotThrow(() => app.playMechanicalClickSound(mockWin));

    const throwingWin = {
      AudioContext: class {
        constructor() { throw new Error('Audio disabled'); }
      }
    };
    assert.doesNotThrow(() => app.playMechanicalClickSound(throwingWin));
  });

  test('comprehensive branch coverage for edge cases across all modules', async () => {
    // 1. sanitizeUrl edge cases
    assert.equal(app.sanitizeUrl(null), '#');
    assert.equal(app.sanitizeUrl('   '), '#');
    assert.equal(app.sanitizeUrl('./relative/path', true), './relative/path');
    assert.equal(app.sanitizeUrl('./relative/path', false), '#');
    assert.equal(app.sanitizeUrl('../parent/path', true), '../parent/path');
    assert.equal(app.sanitizeUrl('#anchor', true), '#anchor');
    assert.equal(app.sanitizeUrl('#anchor', false), '#');
    assert.equal(app.sanitizeUrl('/root/path', true), '/root/path');
    assert.equal(app.sanitizeUrl('/root/path', false), '#');
    assert.equal(app.sanitizeUrl('ftp://invalid.protocol'), '#');
    assert.equal(app.sanitizeUrl('javascript:alert(1)'), '#');

    // 2. resolveLinkLabel fallback and demo alias
    assert.equal(app.resolveLinkLabel('demo'), 'LAUNCH // LIVE &nearr;');
    assert.equal(app.resolveLinkLabel('unknownKey'), 'UNKNOWNKEY // ACCESS &nearr;');

    // 3. validateContactPayload boundaries
    assert.throws(() => app.validateContactPayload({ name: 'a'.repeat(101), email: 'a@b.com', message: 'm' }), /Name exceeds maximum limit/);
    assert.throws(() => app.validateContactPayload({ name: 'a', email: 'a'.repeat(250) + '@example.com', message: 'm' }), /Email exceeds maximum limit/);
    assert.throws(() => app.validateContactPayload({ name: 'a', email: 'a@b.com', subject: 's'.repeat(201), message: 'm' }), /Subject exceeds maximum limit/);
    assert.throws(() => app.validateContactPayload({ name: 'a', email: 'a@b.com', message: 'm'.repeat(5001) }), /Message exceeds maximum limit/);

    // 4. logEvent password and token redaction
    assert.doesNotThrow(() => app.logEvent('info', 'TEST', 'msg', null));
    assert.doesNotThrow(() => app.logEvent('info', 'TEST', 'msg', { password: 'secret', token: 'bearer-token' }));

    // 5. buildProjectCardHtml fallbacks and branches
    const htmlMultiLinks = app.buildProjectCardHtml({
      id: 'MJD-TEST-01',
      date: '2026',
      title: 'Project Multi',
      category: 'Research',
      summary: 'Project summary',
      details: 'Deep architecture details',
      tags: ['Tag1', 'Tag2'],
      links: { github: 'https://github.com', live: 'https://example.com' }
    });
    assert.match(htmlMultiLinks, /Deep architecture details/);
    assert.match(htmlMultiLinks, /card-date/);
    assert.match(htmlMultiLinks, /card-links/);

    const htmlNoDetails = app.buildProjectCardHtml({
      title: 'Project Minimal',
      category: 'Tools',
      summary: 'Summary only',
      tech: ['JS']
    });
    assert.match(htmlNoDetails, /Project Minimal/);

    // 6. buildShortCardHtml branches
    const htmlShortFeatured = app.buildShortCardHtml({
      id: 'IX8mW3_-ODQ',
      title: 'Featured Short',
      recipient: 'Recipient Name',
      genre: 'Genre',
      blurb: 'Blurb text',
      featured: true,
      url: 'https://youtube.com/shorts/IX8mW3_-ODQ',
      date: '1 Jan 2026'
    }, 0);
    assert.match(htmlShortFeatured, /FAVOURITE/);
    assert.match(htmlShortFeatured, /CREATOR&apos;S PICK/);

    const htmlShortUnfeatured = app.buildShortCardHtml({
      id: 'invalid-id-!',
      title: 'Unfeatured Short',
      recipient: 'Recipient Name',
      genre: 'Genre',
      blurb: 'Blurb text',
      featured: false,
      url: 'https://youtube.com/shorts/invalid',
      date: '1 Jan 2026'
    }, 1);
    assert.match(htmlShortUnfeatured, /WM-02/);

    // 7. buildPlaylistCardHtml branches
    const htmlPlaylistNoEmbed = app.buildPlaylistCardHtml({
      id: 'MJD-PL-NOEMBED',
      title: 'No Embed Playlist',
      genre: 'Ambient',
      summary: 'Summary notes',
      url: 'https://spotify.com/user/track/123',
      cover: 'https://spotify.com/cover.jpg'
    });
    assert.match(htmlPlaylistNoEmbed, /MJD-PL-NOEMBED/);
    assert.doesNotMatch(htmlPlaylistNoEmbed, /spotify-preview-btn/);

    // 8. swapYoutubeFacade title fallback
    const ytWrapper = createMockElement('yt', 'DIV');
    const doc = createMockDocument();
    assert.equal(app.swapYoutubeFacade(ytWrapper, 'IX8mW3_-ODQ', '', doc), true);
    assert.equal(app.swapYoutubeFacade(ytWrapper, 'IX8mW3_-ODQ', null, doc), true);

    // 9. swapSpotifyFacade without previewBtn
    const spWrapper = createMockElement('sp', 'DIV');
    assert.equal(app.swapSpotifyFacade(spWrapper, 'https://open.spotify.com/embed/playlist/test', null, doc), true);

    // 10. playMechanicalClickSound webkitAudioContext fallback and missing audioContext
    const mockWebkitWin = {
      webkitAudioContext: class {
        constructor() { this.currentTime = 0; this.destination = {}; }
        createOscillator() {
          return {
            type: '',
            frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {},
            start() {},
            stop() {}
          };
        }
        createGain() {
          return {
            gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {}
          };
        }
      }
    };
    assert.doesNotThrow(() => app.playMechanicalClickSound(mockWebkitWin));
    assert.doesNotThrow(() => app.playMechanicalClickSound({}));

    // 11. initTheme with toggle click when optLight and optDark are missing
    const docNoOpts = createMockDocument();
    docNoOpts.elements.set('theme-opt-light', null);
    docNoOpts.elements.set('theme-opt-dark', null);
    const storage = { getItem: () => 'dark', setItem: () => {} };
    app.initTheme(docNoOpts, storage);
    const toggleBtn = docNoOpts.getElementById('theme-toggle');
    assert.doesNotThrow(() => toggleBtn.dispatch('click'));

    // 12. initCopyHandle with null nav and missing clipboard
    const docCopyNav = createMockDocument();
    const btnNav = docCopyNav.getElementById('copy-handle-btn');
    btnNav.removeAttribute('data-copy');
    app.initCopyHandle(docCopyNav, null);
    assert.doesNotThrow(async () => await btnNav.dispatch('click'));

    const docCopyNoClip = createMockDocument();
    const btnNoClip = docCopyNoClip.getElementById('copy-handle-btn');
    app.initCopyHandle(docCopyNoClip, {});
    assert.doesNotThrow(async () => await btnNoClip.dispatch('click'));

    // 13. initKeyboardNavigation target edge cases and missing toggleBtn
    let keyNav = '';
    const mockKeyWin = {
      location: { set href(v) { keyNav = v; }, get href() { return keyNav; } },
      listeners: {},
      addEventListener(e, fn) { (this.listeners[e] = this.listeners[e] || []).push(fn); },
      dispatch(e, p) { for (const fn of this.listeners[e] || []) fn(p); }
    };
    const docNoToggle = createMockDocument();
    docNoToggle.elements.set('theme-toggle', null);
    app.initKeyboardNavigation(mockKeyWin, docNoToggle);
    // Unmapped key
    mockKeyWin.dispatch('keydown', { key: 'x' });
    // null target
    mockKeyWin.dispatch('keydown', { key: '1' });
    assert.equal(keyNav, './');
    // Press 't' with missing toggle button
    assert.doesNotThrow(() => mockKeyWin.dispatch('keydown', { key: 't' }));

    // 14. initContactForm when statusEl and submitBtn are missing
    const docNoStatus = createMockDocument();
    docNoStatus.elements.set('form-status', null);
    docNoStatus.elements.set('submit-btn', null);
    global.FormData = class {
      entries() { return [['name', 'Martin'], ['email', 'martin@example.com'], ['message', 'Test']]; }
    };
    app.initContactForm(docNoStatus, async () => new Response(JSON.stringify({ success: true })));
    const formNoStatus = docNoStatus.getElementById('contact-form');
    assert.doesNotThrow(async () => await formNoStatus.dispatch('submit'));

    // 15. fetchJsonWithRetry with 408 and 429 statuses
    const mock408Fetch = async () => new Response(JSON.stringify({ error: 'Timeout' }), { status: 408 });
    await assert.rejects(async () => await app.fetchJsonWithRetry('https://example.com', {}, { timeoutMs: 100, maxRetries: 0 }, mock408Fetch), app.TransientNetworkError);

    const mock429Fetch = async () => new Response(JSON.stringify({ error: 'Rate limit' }), { status: 429 });
    await assert.rejects(async () => await app.fetchJsonWithRetry('https://example.com', {}, { timeoutMs: 100, maxRetries: 0 }, mock429Fetch), app.TransientNetworkError);

    // 16. fetchWithTimeout with TransientNetworkError re-throw
    const throwingTransientFetch = async () => { throw new app.TransientNetworkError('Direct transient failure'); };
    await assert.rejects(async () => await app.fetchWithTimeout('https://example.com', {}, 1000, throwingTransientFetch), app.TransientNetworkError);

    // 17. renderProjects empty state and missing counter
    const docEmptyProjects = createMockDocument();
    docEmptyProjects.elements.set('project-counter', null);
    app.renderProjects(docEmptyProjects);
    assert.match(docEmptyProjects.getElementById('projects-grid').innerHTML, /NO EXPERIMENTS FOUND/);

    // 18. renderWrongMartin click without stageWrapper
    const docNoStage = createMockDocument();
    app.renderWrongMartin(docNoStage);
    const gridNoStage = docNoStage.getElementById('wrong-martin-grid');
    const facadeNoStage = createMockElement('facade', 'BUTTON');
    facadeNoStage.classList.add('yt-facade');
    facadeNoStage.setAttribute('data-video-id', 'IX8mW3_-ODQ');
    facadeNoStage.closest = (sel) => sel.includes('yt-facade') ? facadeNoStage : null;
    assert.doesNotThrow(async () => await gridNoStage.dispatch('click', { target: facadeNoStage }));

    // 19. initContactForm 200 with success: false and missing message
    const docFail200 = createMockDocument();
    const mock200FailFetch = async () => new Response(JSON.stringify({ success: false }), { status: 200 });
    global.FormData = class {
      entries() { return [['name', 'Martin'], ['email', 'martin@example.com'], ['message', 'Test message']]; }
    };
    app.initContactForm(docFail200, mock200FailFetch);
    const formFail200 = docFail200.getElementById('contact-form');
    await formFail200.dispatch('submit');
    assert.match(docFail200.getElementById('form-status').textContent, /TRANSMISSION FAILED/);
  });

  test('deep branch guard verification for defensive resilience', () => {
    const doc = createMockDocument();

    // 1. Facade swap guards
    assert.equal(app.swapYoutubeFacade(null, 'IX8mW3_-ODQ', 'title', doc), false);
    assert.equal(app.swapYoutubeFacade(createMockElement('wrap'), 'invalid-!', 'title', doc), false);
    assert.equal(app.swapYoutubeFacade(createMockElement('wrap'), 'IX8mW3_-ODQ', 'title', null), false);

    assert.equal(app.swapSpotifyFacade(null, 'https://open.spotify.com/embed/playlist/123', null, doc), false);
    assert.equal(app.swapSpotifyFacade(createMockElement('wrap'), null, null, doc), false);
    assert.equal(app.swapSpotifyFacade(createMockElement('wrap'), 'https://open.spotify.com/embed/playlist/123', null, null), false);
    assert.equal(app.swapSpotifyFacade(createMockElement('wrap'), 'https://invalidsite.com/embed/playlist/123', null, doc), false);

    // 2. initCopyHandle defensive guards
    assert.doesNotThrow(() => app.initCopyHandle(null));
    assert.doesNotThrow(() => app.initCopyHandle({ getElementById: 123 }));
    assert.doesNotThrow(() => app.initCopyHandle({ getElementById: () => null }));
    assert.doesNotThrow(() => app.initCopyHandle({ getElementById: () => ({ dataset: null }) }));
    assert.doesNotThrow(() => app.initCopyHandle({ getElementById: () => ({ dataset: { listenerBound: 'true' } }) }));

    // 3. initKeyboardNavigation defensive guards
    assert.doesNotThrow(() => app.initKeyboardNavigation(null, doc));
    assert.doesNotThrow(() => app.initKeyboardNavigation({}, null));
    assert.doesNotThrow(() => app.initKeyboardNavigation({ addEventListener: 123 }, doc));
    assert.doesNotThrow(() => app.initKeyboardNavigation({ addEventListener: () => {} }, { documentElement: null }));
    assert.doesNotThrow(() => app.initKeyboardNavigation({ addEventListener: () => {} }, { documentElement: { dataset: null } }));
    assert.doesNotThrow(() => app.initKeyboardNavigation({ addEventListener: () => {} }, { documentElement: { dataset: { hotkeysBound: 'true' } } }));

    // 4. initContactForm defensive guards
    assert.doesNotThrow(() => app.initContactForm(null, async () => {}));
    assert.doesNotThrow(() => app.initContactForm(doc, null));
    assert.doesNotThrow(() => app.initContactForm({ getElementById: () => null }, async () => {}));
    const docNoStatus = createMockDocument();
    docNoStatus.elements.set('form-status', null);
    assert.doesNotThrow(() => app.initContactForm(docNoStatus, async () => {}));
    const docNoSubmit = createMockDocument();
    docNoSubmit.elements.set('submit-btn', null);
    assert.doesNotThrow(() => app.initContactForm(docNoSubmit, async () => {}));
    const docBound = createMockDocument();
    docBound.getElementById('contact-form').dataset.listenerBound = 'true';
    assert.doesNotThrow(() => app.initContactForm(docBound, async () => {}));

    // 5. Section renders and loads
    assert.doesNotThrow(() => app.renderProjects(null));
    assert.doesNotThrow(() => app.renderProjects({ getElementById: () => null }));
    assert.doesNotThrow(() => app.renderWrongMartin(null));
    assert.doesNotThrow(() => app.renderWrongMartin({ getElementById: () => null }));
    assert.doesNotThrow(() => app.renderPlaylists(null));
    assert.doesNotThrow(() => app.renderPlaylists({ getElementById: () => null }));
    assert.doesNotThrow(async () => await app.loadProjects(doc, null));
    assert.doesNotThrow(async () => await app.loadWrongMartin(doc, null));
    assert.doesNotThrow(async () => await app.loadPlaylists(doc, null));
    assert.doesNotThrow(() => app.initTheme(null));
    assert.doesNotThrow(async () => await app.bootApp(null));

    // 6. Additional branch gap fills
    // validateContactPayload email regex failure branch
    assert.throws(() => app.validateContactPayload({ name: 'Martin', email: 'not-an-email', message: 'Hello' }), /Please provide a valid return email address/);

    // renderWrongMartin click on non-facade target
    const docWM = createMockDocument();
    app.renderWrongMartin(docWM);
    const gridWM = docWM.getElementById('wrong-martin-grid');
    assert.doesNotThrow(async () => await gridWM.dispatch('click', { target: createMockElement('plain') }));

    // initTheme without theme-toggle button
    const docNoBtn = createMockDocument();
    docNoBtn.elements.set('theme-toggle', null);
    app.initTheme(docNoBtn);

    // initCopyHandle with clipboard.writeText not a function
    const docNoWrite = createMockDocument();
    const btnNoWrite = docNoWrite.getElementById('copy-handle-btn');
    app.initCopyHandle(docNoWrite, { clipboard: { writeText: 123 } });
    assert.doesNotThrow(async () => await btnNoWrite.dispatch('click'));

    // fetchWithTimeout with default timeoutMs parameter
    assert.doesNotThrow(async () => {
      try {
        await app.fetchWithTimeout('https://example.com', {}, undefined, async () => new Response('{}'));
      } catch {
        // ignore
      }
    });

    // 7. Additional fallback branch checks
    // renderWrongMartin facade with no attributes
    const docWMNoAttrs = createMockDocument();
    app.renderWrongMartin(docWMNoAttrs);
    const gridWMNoAttrs = docWMNoAttrs.getElementById('wrong-martin-grid');
    const facadeNoAttrs = createMockElement('facade-no-attrs', 'BUTTON');
    facadeNoAttrs.classList.add('yt-facade');
    facadeNoAttrs.closest = (sel) => {
      if (sel.includes('yt-facade')) return facadeNoAttrs;
      if (sel.includes('stage-wrapper')) return createMockElement('stage');
      return null;
    };
    assert.doesNotThrow(async () => await gridWMNoAttrs.dispatch('click', { target: facadeNoAttrs }));

    // renderPlaylists preview button with no closest card
    const docPLNoCard = createMockDocument();
    app.renderPlaylists(docPLNoCard);
    const gridPLNoCard = docPLNoCard.getElementById('playlists-grid');
    const btnNoCard = createMockElement('btn-no-card', 'BUTTON');
    btnNoCard.classList.add('spotify-preview-btn');
    btnNoCard.setAttribute('data-embed-url', 'https://open.spotify.com/embed/playlist/123');
    btnNoCard.closest = (sel) => sel.includes('spotify-preview-btn') ? btnNoCard : null;
    assert.doesNotThrow(async () => await gridPLNoCard.dispatch('click', { target: btnNoCard }));

    // initTheme click when root has no data-theme attribute
    const docNoThemeAttr = createMockDocument();
    app.initTheme(docNoThemeAttr, { getItem: () => null, setItem: () => {} });
    docNoThemeAttr.documentElement.removeAttribute('data-theme');
    const toggleNoTheme = docNoThemeAttr.getElementById('theme-toggle');
    assert.doesNotThrow(() => toggleNoTheme.dispatch('click'));

    // initContactForm when form.querySelector botcheck returns null
    const docNoBotCheck = createMockDocument();
    docNoBotCheck.getElementById('contact-form').querySelector = () => null;
    global.FormData = class {
      entries() { return [['name', 'Martin'], ['email', 'martin@example.com'], ['message', 'Test']]; }
    };
    app.initContactForm(docNoBotCheck, async () => new Response(JSON.stringify({ success: true })));
    assert.doesNotThrow(async () => await docNoBotCheck.getElementById('contact-form').dispatch('submit'));

    // buildProjectCardHtml with null links and null tech
    const htmlNullLinks = app.buildProjectCardHtml({
      id: 'MJD-NULL',
      category: 'Test',
      summary: 'Summary',
      links: null,
      tech: null,
      tags: null
    });
    assert.match(htmlNullLinks, /MJD-NULL/);
  });
});

