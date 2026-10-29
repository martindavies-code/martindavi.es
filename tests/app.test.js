// @ts-check
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
    test('strictly maps dark to dark and defaults all others to light', () => {
      assert.equal(app.normalizeTheme('dark'), 'dark');
      assert.equal(app.normalizeTheme('light'), 'light');
      assert.equal(app.normalizeTheme(''), 'light');
      assert.equal(app.normalizeTheme('cyberpunk'), 'light');
      assert.equal(app.normalizeTheme(null), 'light');
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
    assert.match(html, /\[LIVE\]/);
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
    // Test document.readyState === 'complete'
    const docComplete = createMockDocument();
    docComplete.readyState = 'complete';
    // Call bootApp directly with docComplete
    await app.bootApp(docComplete, { getItem: () => 'light', setItem: () => {} }, async () => new Response('[]'));
    assert.equal(docComplete.documentElement.getAttribute('data-theme'), 'light');

    // Test document.readyState === 'loading'
    const docLoading = createMockDocument();
    docLoading.readyState = 'loading';
    docLoading.addEventListener = (evt, fn) => {
      if (evt === 'DOMContentLoaded') fn();
    };
    await app.bootApp(docLoading, { getItem: () => 'dark', setItem: () => {} }, async () => new Response('[]'));
    assert.equal(docLoading.documentElement.getAttribute('data-theme'), 'dark');
  });
});
