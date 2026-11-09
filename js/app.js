(() => {
  'use strict';

  /* ================= Utilities ================= */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.random() * a.length | 0];
  const DAY = 86400000;
  const startOfDay = (t = Date.now()) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  const dayKey = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  const md = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\{\{(.+?)\}\}/g, (m, w) => `<span class="say" role="button" tabindex="0" data-say="${w}">${w}</span>`);

  /* ================= Storage ================= */
  const KEY = 'hablemos.v1';
  const DEFAULTS = () => ({
    lessons: {}, srs: {}, lt: {},
    streak: { count: 0, last: null, best: 0 },
    xp: 0, daily: { date: null, xp: 0 },
    settings: { accent: 'es-ES', voice: '', rate: 0.9, hebrew: true, strict: false, autoplay: true }
  });
  function load() {
    const d = DEFAULTS();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { const p = JSON.parse(raw); return { ...d, ...p, settings: { ...d.settings, ...(p.settings || {}) }, streak: { ...d.streak, ...(p.streak || {}) } }; }
    } catch (e) { /* storage unavailable */ }
    return d;
  }
  let S = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* ignore */ }

  /* ================= Data index ================= */
  const UNITS = window.UNITS, LESSONS = window.LESSONS;
  const byId = {};
  const ITEMS = {};
  LESSONS.forEach((l, i) => {
    l.idx = i; byId[l.id] = l; l.items = [];
    l.vocab.forEach(v => {
      const id = 'v:' + v[0] + '=' + v[1];
      if (!ITEMS[id]) ITEMS[id] = { id, kind: 'v', es: v[0], en: v[1], he: v[2], alts: [v[0]], lesson: l.id, li: i };
      l.items.push(ITEMS[id]);
    });
    l.sent.forEach(s => {
      const alts = s[0].split('|');
      const id = 's:' + alts[0];
      if (!ITEMS[id]) ITEMS[id] = { id, kind: 's', es: alts[0], en: s[1], alts, lesson: l.id, li: i };
      l.items.push(ITEMS[id]);
    });
  });
  const ALL = Object.values(ITEMS);

  /* ================= Speech ================= */
  const Speech = {
    voices: [],
    init() {
      if (!('speechSynthesis' in window)) return;
      const loadV = () => { this.voices = speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)); };
      loadV();
      speechSynthesis.onvoiceschanged = () => { loadV(); if (route().name === 'settings') render(); };
    },
    voice() {
      const v = this.voices;
      if (!v.length) return null;
      const acc = S.settings.accent === 'es-ES' ? /^es[-_]ES/i : /^es[-_](MX|US|419|AR|CO|CL)/i;
      const NICE = /m[oó]nica|paulina|jorge|juan|marisol|diego|ang[eé]lica|francisca|carlos|isabela|sara|helena|laura|pablo|google/i;
      const NOVELTY = /eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|bells|bubbles|jester|organ|trinoids|whisper|zarvox|bahh|boing|cellos|wobble|superstar|bad news|good news/i;
      const mine = v.filter(x => acc.test(x.lang) && !NOVELTY.test(x.name));
      return v.find(x => x.voiceURI === S.settings.voice) ||
        mine.find(x => /enhanced|premium|mejorad/i.test(x.name)) ||
        mine.find(x => NICE.test(x.name)) || mine[0] ||
        v.find(x => !NOVELTY.test(x.name)) || v[0];
    },
    say(text, rate) {
      if (!('speechSynthesis' in window) || !text) return;
      const clean = String(text).replace(/\(.*?\)/g, '').replace(/\.\.\./g, ' ').replace(/\s*\/\s*/g, ', ');
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      const v = this.voice();
      if (v) u.voice = v;
      u.lang = v ? v.lang : S.settings.accent;
      u.rate = rate || S.settings.rate;
      speechSynthesis.speak(u);
    }
  };
  Speech.init();

  /* ================= Answer checking ================= */
  function norm(s, loose) {
    s = String(s).toLowerCase().replace(/[’`]/g, "'").replace(/[¿?¡!.,;:"“”«»()…]/g, ' ').replace(/\s+/g, ' ').trim();
    if (loose) s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return s;
  }
  const ANY_PRON = /^(yo|tú|tu|usted|él|ella|nosotros|nosotras|ellos|ellas|ustedes) (.+)$/;
  const DROP_PRON = /^(yo|tú|usted|nosotros|nosotras|ustedes) (.+)$/;
  const userVariants = a => { const m = a.match(ANY_PRON); return m ? [a, m[2]] : [a]; };
  const targetVariants = c => { const m = c.match(DROP_PRON); return m ? [c, m[2]] : [c]; };
  function check(answer, alts) {
    const a = norm(answer);
    if (!a) return { ok: false };
    const ua = userVariants(a);
    for (const alt of alts) {
      if (targetVariants(norm(alt)).some(c => ua.includes(c))) return { ok: true, alt };
    }
    const ul = ua.map(x => norm(x, true));
    for (const alt of alts) {
      if (targetVariants(norm(alt)).map(c => norm(c, true)).some(c => ul.includes(c))) {
        return S.settings.strict ? { ok: false, accent: true, alt } : { ok: true, accent: true, alt };
      }
    }
    return { ok: false };
  }

  /* ================= Progress: streak, xp, SRS ================= */
  const INTERVALS = [0, 1, 3, 7, 16, 35, 80, 180];
  function streakNow() {
    const s = S.streak;
    if (s.last === dayKey() || s.last === dayKey(Date.now() - DAY)) return s.count;
    return 0;
  }
  function recordActivity(xp) {
    const t = dayKey();
    if (S.streak.last !== t) {
      S.streak.count = S.streak.last === dayKey(Date.now() - DAY) ? S.streak.count + 1 : 1;
      S.streak.last = t;
      S.streak.best = Math.max(S.streak.best || 0, S.streak.count);
    }
    if (S.daily.date !== t) S.daily = { date: t, xp: 0 };
    S.daily.xp += xp; S.xp += xp;
    save();
  }
  const todayXP = () => S.daily.date === dayKey() ? S.daily.xp : 0;
  function srsGrade(item, ok, mode) {
    let r = S.srs[item.id];
    if (!r) { r = S.srs[item.id] = { b: 0, d: 0 }; }
    if (mode === 'extra') {
      if (!ok) { r.b = 1; r.d = Date.now(); }
      return;
    }
    if (ok) r.b = Math.min(r.b + 1, INTERVALS.length - 1); else r.b = 1;
    r.d = ok ? startOfDay() + INTERVALS[r.b] * DAY + 3 * 3600000 : Date.now() + 10 * 60000;
  }
  const dueItems = () => ALL.filter(it => S.srs[it.id] && S.srs[it.id].d <= Date.now()).sort((a, b) => S.srs[a.id].d - S.srs[b.id].d);
  const learnedItems = () => ALL.filter(it => S.srs[it.id]);
  const nextLesson = () => LESSONS.find(l => !S.lessons[l.id]) || null;

  /* ================= Icons ================= */
  const I = {
    learn: '<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
    review: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>',
    ref: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    audio: '<svg viewBox="0 0 24 24"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    speaker: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-4-1-6 1-9.5z"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/></svg>'
  };
  const speakBtn = (text, cls = '') => `<button class="icon-btn speak ${cls}" data-say="${esc(text)}" aria-label="Play audio">${I.speaker}</button>`;
  const heSpan = he => he && S.settings.hebrew ? `<span class="he" lang="he" dir="rtl">${esc(he)}</span>` : '';

  /* ================= Router ================= */
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [name, arg] = h.split('/');
    return { name: name || 'home', arg: arg ? decodeURIComponent(arg) : '' };
  }
  const go = h => { location.hash = h; };
  window.addEventListener('hashchange', () => { if (session && route().name !== 'session') session = null; render(); });

  const view = $('#view');
  const tabbar = $('#tabbar');

  function render() {
    const r = route();
    const inSession = r.name === 'session' && session;
    document.body.classList.toggle('in-session', !!inSession);
    const tabName = { home: 'home', lesson: 'home', review: 'review', ref: 'ref', audio: 'audio', settings: 'settings' }[r.name] || 'home';
    renderTabbar(tabName);
    if (r.name === 'session' && !session) { go('#/'); return; }
    const fn = { home: viewHome, lesson: viewLesson, review: viewReview, ref: viewRef, audio: viewAudio, settings: viewSettings, session: viewSession }[r.name] || viewHome;
    fn(r.arg);
    if (r.name !== 'session') window.scrollTo(0, 0);
  }

  function renderTabbar(active) {
    const due = dueItems().length;
    const tabs = [['home', 'Learn', I.learn], ['review', 'Review', I.review], ['ref', 'Reference', I.ref], ['audio', 'Audio', I.audio], ['settings', 'Settings', I.settings]];
    tabbar.innerHTML = tabs.map(([k, label, icon]) =>
      `<a href="#/${k === 'home' ? '' : k}" class="tab ${active === k ? 'active' : ''}" aria-label="${label}">${icon}<span>${label}</span>${k === 'review' && due ? `<b class="badge">${due > 99 ? '99+' : due}</b>` : ''}</a>`
    ).join('');
  }

  /* ================= Views: Home ================= */
  function viewHome() {
    const next = nextLesson();
    const due = dueItems().length;
    const done = LESSONS.filter(l => S.lessons[l.id]).length;
    const streak = streakNow();
    view.innerHTML = `
      <header class="top">
        <div>
          <h1 class="brand">¡Hablemos!</h1>
          <p class="muted">${done ? `${done} of ${LESSONS.length} lessons done` : 'Spanish from scratch, in English'}</p>
        </div>
        <div class="pills">
          <span class="pill flame ${streak ? 'on' : ''}" title="Day streak">${I.flame}${streak}</span>
          <span class="pill" title="XP today">${todayXP()} XP</span>
        </div>
      </header>
      ${due ? `<a class="card cta review-cta" href="#/review"><div><div class="eyebrow">Daily review</div><div class="cta-title">${due} item${due > 1 ? 's' : ''} ready to review</div></div><span class="btn small">Review</span></a>` : ''}
      ${next ? `<a class="card cta" href="#/lesson/${next.id}">
          <div><div class="eyebrow">${done ? 'Continue' : 'Start here'} · Lesson ${next.id}</div><div class="cta-title">${esc(next.title)}</div><div class="muted small">${esc(next.sub)}</div></div>
          <span class="btn small">Go</span></a>`
        : `<div class="card cta"><div><div class="eyebrow">Course complete</div><div class="cta-title">¡Felicidades! You've finished every lesson.</div><div class="muted small">Keep your daily review going to make it stick.</div></div></div>`}
      ${UNITS.map(u => {
        const ls = LESSONS.filter(l => l.unit === u.n);
        const ud = ls.filter(l => S.lessons[l.id]).length;
        return `<section class="unit">
          <div class="unit-head"><h2>Unit ${u.n} · ${esc(u.title)}</h2><span class="muted small">${ud}/${ls.length}</span></div>
          <p class="muted small unit-desc">${esc(u.desc)}</p>
          <div class="progress thin"><i style="width:${ud / ls.length * 100}%"></i></div>
          <div class="list">${ls.map(l => {
            const st = S.lessons[l.id] ? 'done' : (next && next.id === l.id ? 'next' : '');
            return `<a class="row lesson-row ${st}" href="#/lesson/${l.id}">
              <span class="num">${st === 'done' ? I.check : l.id}</span>
              <span class="row-main"><span class="row-title">${esc(l.title)}</span><span class="muted small">${esc(l.sub)}</span></span>
              ${S.lessons[l.id] ? `<span class="score">${Math.round(S.lessons[l.id].best * 100)}%</span>` : ''}
            </a>`;
          }).join('')}</div>
        </section>`;
      }).join('')}
      <p class="footnote muted small">The lesson sequence follows <i>Madrigal's Magic Key to Spanish</i> and Language Transfer's <i>Complete Spanish</i>. All exercises are original.</p>`;
  }

  /* ================= Views: Lesson ================= */
  function viewLesson(id) {
    const l = byId[id];
    if (!l) return go('#/');
    const unit = UNITS.find(u => u.n === l.unit);
    const prev = LESSONS[l.idx - 1], nxt = LESSONS[l.idx + 1];
    const ltRange = l.lt ? (l.lt[0] === l.lt[1] ? `Track ${l.lt[0]}` : `Tracks ${l.lt[0]}–${l.lt[1]}`) : null;
    const ltButtons = l.lt ? Array.from({ length: l.lt[1] - l.lt[0] + 1 }, (_, k) => l.lt[0] + k)
      .map(n => `<a class="chip ${S.lt[n] ? 'done' : ''}" href="${window.LT_TRACKS[n - 1]}" target="_blank" rel="noopener">${n}</a>`).join('') : '';
    view.innerHTML = `
      <header class="bar">
        <a class="icon-btn" href="#/" aria-label="Back">${I.back}</a>
        <span class="bar-title">Unit ${l.unit} · ${esc(unit.title)}</span>
        <span style="width:40px"></span>
      </header>
      <div class="lesson-hero">
        <div class="eyebrow">Lesson ${l.id}${S.lessons[l.id] ? ' · completed' : ''}</div>
        <h1>${esc(l.title)}</h1>
        <p class="muted">${esc(l.sub)}</p>
      </div>
      <div class="card sources">
        <div class="src"><span class="src-icon">${I.book}</span><div><div class="small muted">Madrigal's book</div><div>${esc(l.book)}</div></div></div>
        <div class="src"><span class="src-icon">${I.audio}</span><div style="flex:1"><div class="small muted">Language Transfer${l.lt ? ' (approximate match)' : ''}</div>
          ${l.lt ? `<div>${ltRange}</div><div class="chips">${ltButtons}</div>` : '<div class="muted">No matching tracks. This topic is from the book.</div>'}</div></div>
      </div>
      <h2 class="section">Learn</h2>
      ${l.concepts.map(c => `<div class="card concept"><h3>${esc(c.h)}</h3><p>${md(c.p)}</p>${c.he && S.settings.hebrew ? `<p class="he-note" lang="he" dir="rtl">${esc(c.he)}</p>` : ''}</div>`).join('')}
      <h2 class="section">Words <span class="muted small">tap to hear</span></h2>
      <div class="card list words">${l.vocab.map(v => `<button class="row word" data-say="${esc(v[0])}"><span class="es">${esc(v[0])}</span><span class="en">${esc(v[1])}${heSpan(v[2])}</span></button>`).join('')}</div>
      <h2 class="section">Sentences</h2>
      <div class="card list words">${l.sent.map(s => { const a = s[0].split('|'); return `<button class="row word sent" data-say="${esc(a[0])}"><span class="es">${esc(a[0])}</span><span class="en">${esc(s[1])}</span></button>`; }).join('')}</div>
      <div class="lesson-nav">
        ${prev ? `<a class="btn ghost" href="#/lesson/${prev.id}">← ${prev.id}</a>` : '<span></span>'}
        ${nxt ? `<a class="btn ghost" href="#/lesson/${nxt.id}">${nxt.id} →</a>` : '<span></span>'}
      </div>
      <div class="sticky-cta"><button class="btn big" id="startPractice">${S.lessons[l.id] ? 'Practice again' : 'Start practice'}</button></div>`;
    $('#startPractice').onclick = () => startSession('lesson', l.id);
  }

  /* ================= Views: Review ================= */
  function viewReview() {
    const due = dueItems();
    const learned = learnedItems();
    const mastered = learned.filter(it => S.srs[it.id].b >= 5).length;
    const tomorrow = learned.filter(it => S.srs[it.id].d > Date.now() && S.srs[it.id].d <= startOfDay() + 2 * DAY).length;
    view.innerHTML = `
      <header class="top"><div><h1>Review</h1><p class="muted">Spaced repetition: every item comes back just before you'd forget it.</p></div></header>
      <div class="stats">
        <div class="stat"><b>${due.length}</b><span>due now</span></div>
        <div class="stat"><b>${learned.length}</b><span>learned</span></div>
        <div class="stat"><b>${mastered}</b><span>mastered</span></div>
      </div>
      ${due.length ? `<button class="btn big" id="goReview">Review ${Math.min(due.length, 20)} item${due.length > 1 ? 's' : ''}</button>
        ${due.length > 20 ? `<p class="muted small center">${due.length - 20} more after this round.</p>` : ''}`
        : learned.length ? `<div class="card center"><h3>All caught up 🎉</h3><p class="muted">${tomorrow ? `${tomorrow} item${tomorrow > 1 ? 's' : ''} coming up tomorrow.` : 'Nothing due right now.'}</p></div>`
          : `<div class="card center"><h3>Nothing to review yet</h3><p class="muted">Finish a lesson and its words and sentences start showing up here.</p><a class="btn" href="#/">Go to lessons</a></div>`}
      ${learned.length ? `<button class="btn ghost big" id="goExtra">Extra practice (15 random)</button>` : ''}
      ${learned.length ? `<h2 class="section">Your strength</h2><div class="card">${[1, 2, 3, 4, 5, 6, 7].map(b => {
        const n = learned.filter(it => Math.max(1, S.srs[it.id].b) === b).length;
        return `<div class="meter-row"><span class="small muted">Level ${b}</span><div class="progress"><i style="width:${learned.length ? n / learned.length * 100 : 0}%"></i></div><span class="small">${n}</span></div>`;
      }).join('')}<p class="muted small">Level 1 = new. Each correct review moves an item up a level and waits longer before showing it again, from 1 day up to 6 months.</p></div>` : ''}`;
    const g = $('#goReview'); if (g) g.onclick = () => startSession('review');
    const x = $('#goExtra'); if (x) x.onclick = () => startSession('extra');
  }

  /* ================= Views: Reference ================= */
  let refTab = 'cognates', refVerb = 'hablar', refQuery = '';
  function viewRef() {
    const tabs = [['cognates', 'Cognates'], ['verbs', 'Verbs'], ['pronouns', 'Pronouns'], ['words', 'Dictionary']];
    let body = '';
    if (refTab === 'cognates') {
      body = `<p class="muted small">Turn English words into Spanish: thousands of words for free.</p>
        <div class="card list">${window.COGNATES.map(c => `<div class="row cog"><span class="cog-rule"><b>${esc(c[0])}</b> → <b class="accent">${esc(c[1])}</b></span><span class="muted small">${esc(c[2])}</span></div>`).join('')}</div>`;
    } else if (refTab === 'verbs') {
      const verbs = ['hablar', 'comer', 'vivir', ...Object.keys(window.IRREGULAR)];
      const table = window.IRREGULAR[refVerb] ? Object.fromEntries(Object.entries(window.IRREGULAR[refVerb]).map(([k, v]) => [k, v.split(' ')])) : window.conjugate(refVerb);
      body = `<div class="chips verbs">${verbs.map(v => `<button class="chip ${v === refVerb ? 'on' : ''}" data-verb="${v}">${v}</button>`).join('')}</div>
        <p class="muted small">${window.IRREGULAR[refVerb] ? 'Irregular verb.' : 'Regular pattern: every regular -' + refVerb.slice(-2) + ' verb works the same way.'} Tap a form to hear it. (vosotros is left out; it's only used in Spain.)</p>
        ${Object.entries(table).map(([tense, forms]) => `<div class="card conj"><div class="conj-head"><b>${tense}</b><span class="muted small">${esc(window.TENSE_INFO[tense])}</span></div>
          ${forms.map((f, i) => `<div class="conj-row"><span class="muted small">${window.PERSONS[i]}</span><span class="say" role="button" tabindex="0" data-say="${esc(f)}">${esc(f)}</span></div>`).join('')}</div>`).join('')}`;
    } else if (refTab === 'pronouns') {
      body = `<div class="card table-wrap"><table class="ptable"><thead><tr><th></th><th>I</th><th>you</th><th>he/she/<br>you (pol.)</th><th>we</th><th>they/<br>you all</th></tr></thead>
        <tbody>${window.PRONOUNS.map(r => `<tr><th>${esc(r[0])}</th>${r.slice(1).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <div class="card concept"><h3>Order of pronouns</h3><p>${md('To-whom before what: {{Me lo da.}} (he gives it to me). le / les + lo / la → **se lo**: {{Se lo doy.}} They go before a conjugated verb, or are attached to an infinitive, an -ing form or a positive command: {{dármelo}}, {{dándomelo}}, {{¡Dámelo!}}')}</p></div>`;
    } else {
      const q = norm(refQuery, true);
      const list = ALL.filter(it => it.kind === 'v' && (!q || norm(it.es, true).includes(q) || norm(it.en, true).includes(q)));
      body = `<input class="search" id="refSearch" type="search" placeholder="Search Spanish or English…" value="${esc(refQuery)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <p class="muted small">${list.length} words · <span class="dot learned"></span> learned</p>
        <div class="card list words" id="dictList">${list.slice(0, 300).map(it => `<button class="row word" data-say="${esc(it.es)}"><span class="es">${S.srs[it.id] ? '<span class="dot learned"></span>' : ''}${esc(it.es)}</span><span class="en">${esc(it.en)}${heSpan(it.he)}<span class="muted tiny">L${it.lesson}</span></span></button>`).join('')}</div>`;
    }
    view.innerHTML = `<header class="top"><div><h1>Reference</h1></div></header>
      <div class="seg">${tabs.map(([k, l]) => `<button class="${refTab === k ? 'on' : ''}" data-reftab="${k}">${l}</button>`).join('')}</div>${body}`;
    $$('[data-reftab]').forEach(b => b.onclick = () => { refTab = b.dataset.reftab; viewRef(); });
    $$('[data-verb]').forEach(b => b.onclick = () => { refVerb = b.dataset.verb; viewRef(); });
    const s = $('#refSearch');
    if (s) s.oninput = () => { refQuery = s.value; const pos = s.selectionStart; viewRef(); const n = $('#refSearch'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { /* ignore */ } };
  }

  /* ================= Views: Audio (Language Transfer) ================= */
  function viewAudio() {
    const lessonFor = n => LESSONS.filter(l => l.lt && n >= l.lt[0] && n <= l.lt[1]).map(l => l.id);
    const doneCount = Object.values(S.lt).filter(Boolean).length;
    view.innerHTML = `
      <header class="top"><div><h1>Audio course</h1><p class="muted">Language Transfer, <i>Complete Spanish</i>: 90 free tracks. Listen, think out loud, then practice the matching lesson here.</p></div></header>
      <div class="card">
        <div class="meter-row"><span class="small muted">Listened</span><div class="progress"><i style="width:${doneCount / 90 * 100}%"></i></div><span class="small">${doneCount}/90</span></div>
        <a class="btn ghost" href="${window.LT_PLAYLIST}" target="_blank" rel="noopener">Open full playlist ${I.ext}</a>
        <p class="muted small">Tip: Language Transfer also has a free app with offline downloads. Lesson pairings here are approximate.</p>
      </div>
      <div class="card list">${window.LT_TRACKS.map((url, i) => {
        const n = i + 1, ls = lessonFor(n);
        return `<div class="row track ${S.lt[n] ? 'done' : ''}">
          <button class="tick" data-lt="${n}" aria-label="Mark track ${n} listened">${S.lt[n] ? I.check : ''}</button>
          <a class="row-main" href="${url}" target="_blank" rel="noopener"><span class="row-title">Track ${n}</span>${ls.length ? `<span class="muted small">Pairs with lesson ${ls.join(', ')}</span>` : ''}</a>
          <a class="icon-btn" href="${url}" target="_blank" rel="noopener" aria-label="Open track ${n}">${I.ext}</a>
        </div>`;
      }).join('')}</div>`;
    $$('[data-lt]').forEach(b => b.onclick = () => { const n = b.dataset.lt; S.lt[n] = !S.lt[n]; save(); viewAudio(); });
  }

  /* ================= Views: Settings ================= */
  function viewSettings() {
    const st = S.settings;
    const voices = Speech.voices;
    view.innerHTML = `
      <header class="top"><div><h1>Settings</h1></div></header>
      <h2 class="section">Voice</h2>
      <div class="card form">
        <label class="field"><span>Accent</span>
          <select id="sAccent"><option value="es-ES" ${st.accent === 'es-ES' ? 'selected' : ''}>Spain</option><option value="es-MX" ${st.accent === 'es-MX' ? 'selected' : ''}>Latin America (Mexico)</option></select></label>
        <label class="field"><span>Voice</span>
          <select id="sVoice"><option value="">Automatic</option>${voices.map(v => `<option value="${esc(v.voiceURI)}" ${st.voice === v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')}</select></label>
        <label class="field"><span>Speed <b id="rateVal">${st.rate.toFixed(2)}×</b></span><input id="sRate" type="range" min="0.5" max="1.2" step="0.05" value="${st.rate}"></label>
        <button class="btn ghost" id="testVoice">${I.speaker} Test: «Hola, ¿cómo está usted?»</button>
        <p class="muted small">${voices.length ? '' : 'No Spanish voice found yet. '}For a more natural voice on iPhone: Settings → Accessibility → Spoken Content → Voices → Spanish, then download an <b>Enhanced</b> or <b>Premium</b> voice and pick it here.</p>
      </div>
      <h2 class="section">Learning</h2>
      <div class="card form">
        ${toggle('sHebrew', 'Hebrew hints', 'Short Hebrew notes for trickier ideas and words', st.hebrew)}
        ${toggle('sAuto', 'Play audio automatically', 'Speak Spanish when it appears and after each answer', st.autoplay)}
        ${toggle('sStrict', 'Strict accents', 'Count missing accents (é, ñ…) as wrong when typing', st.strict)}
      </div>
      <h2 class="section">Your progress</h2>
      <div class="card form">
        <p class="small">Progress is saved on this device only. Copy a backup now and then, especially before reinstalling the app.</p>
        <div class="btn-row"><button class="btn ghost" id="bCopy">Copy backup</button><button class="btn ghost" id="bRestoreShow">Restore</button></div>
        <div id="restoreBox" hidden><textarea id="restoreText" rows="4" placeholder="Paste a backup here…"></textarea><button class="btn" id="bRestore">Restore from backup</button></div>
        <p class="muted small">Total XP: ${S.xp} · Best streak: ${S.streak.best || 0} days · Items learned: ${learnedItems().length}</p>
        <button class="btn danger ghost" id="bReset">Reset all progress</button>
      </div>
      <h2 class="section">About</h2>
      <div class="card"><p class="small">A personal Spanish course for English speakers, with an optional Hebrew helper. The lesson sequence merges <i>Madrigal's Magic Key to Spanish</i> (Margarita Madrigal) and <i>Complete Spanish</i> from Language Transfer (languagetransfer.org). All text and exercises in this app are original; please support the original creators.</p>
      <p class="muted small" id="verInfo"></p></div>`;
    const set = (k, v) => { S.settings[k] = v; save(); };
    $('#sAccent').onchange = e => { set('accent', e.target.value); set('voice', ''); viewSettings(); };
    $('#sVoice').onchange = e => set('voice', e.target.value);
    $('#sRate').oninput = e => { set('rate', parseFloat(e.target.value)); $('#rateVal').textContent = S.settings.rate.toFixed(2) + '×'; };
    $('#testVoice').onclick = () => Speech.say('Hola, ¿cómo está usted?');
    $('#sHebrew').onchange = e => set('hebrew', e.target.checked);
    $('#sAuto').onchange = e => set('autoplay', e.target.checked);
    $('#sStrict').onchange = e => set('strict', e.target.checked);
    $('#bCopy').onclick = async () => {
      const data = JSON.stringify(S);
      try { await navigator.clipboard.writeText(data); toast('Backup copied. Paste it into Notes to keep it safe.'); }
      catch (e) { $('#restoreBox').hidden = false; $('#restoreText').value = data; $('#restoreText').select(); toast('Select the text and copy it.'); }
    };
    $('#bRestoreShow').onclick = () => { $('#restoreBox').hidden = !$('#restoreBox').hidden; };
    $('#bRestore').onclick = () => {
      try {
        const p = JSON.parse($('#restoreText').value.trim());
        if (!p || typeof p !== 'object' || !p.srs || !p.lessons) throw new Error('bad');
        const d = DEFAULTS();
        S = { ...d, ...p, settings: { ...d.settings, ...(p.settings || {}) } }; save(); toast('Progress restored.'); go('#/');
      } catch (e) { toast('That doesn\'t look like a valid backup.'); }
    };
    $('#bReset').onclick = () => { if (confirm('Erase all progress on this device? This can\'t be undone.')) { const keep = S.settings; S = DEFAULTS(); S.settings = keep; save(); toast('Progress reset.'); go('#/'); } };
    const vi = $('#verInfo'); if (vi) vi.textContent = 'Version ' + (window.APP_VERSION || '');
  }
  const toggle = (id, label, hint, on) => `<label class="toggle"><span><span>${label}</span><span class="muted small">${hint}</span></span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i></i></label>`;

  /* ================= Sessions ================= */
  let session = null;

  function distractors(item, n, field) {
    const pool = ALL.filter(x => x.kind === item.kind && x.li <= Math.max(item.li + 1, 3) && x[field] !== item[field] && x.es !== item.es && x.en !== item.en);
    const near = shuffle(pool.filter(x => x.lesson === item.lesson));
    const far = shuffle(pool.filter(x => x.lesson !== item.lesson));
    const out = [], seen = new Set([item[field]]);
    for (const x of [...near, ...far]) { if (!seen.has(x[field])) { seen.add(x[field]); out.push(x); } if (out.length >= n) break; }
    return out;
  }

  function makeExercise(type, item) {
    const ex = { type, item };
    if (type === 'mc_es' || type === 'listen') {
      ex.options = shuffle([item, ...distractors(item, 3, 'en')]).map(x => ({ text: x.en, ok: x === item }));
    } else if (type === 'mc_en') {
      ex.options = shuffle([item, ...distractors(item, 3, 'es')]).map(x => ({ text: x.es, ok: x === item }));
    } else if (type === 'build') {
      const toks = item.es.split(/\s+/).map((t, i) => { let w = t.replace(/[¿?¡!.,;:]/g, ''); if (i === 0 && !/^(María|Madrid|Israel|España|México|Tel|Yuval)$/.test(w)) w = w.charAt(0).toLowerCase() + w.slice(1); return w; }).filter(Boolean);
      const used = new Set(toks.map(t => norm(t)));
      const others = shuffle(byId[item.lesson].items.filter(x => x.kind === 's' && x !== item).flatMap(x => x.es.split(/\s+/).map(t => t.replace(/[¿?¡!.,;:]/g, '').toLowerCase())))
        .filter(w => w && !used.has(norm(w)));
      const extra = [...new Set(others)].slice(0, toks.length > 7 ? 1 : 2);
      ex.tiles = shuffle([...toks, ...extra].map((t, i) => ({ t, id: i })));
      ex.picked = [];
    }
    return ex;
  }

  function lessonQueue(l) {
    const v = shuffle(l.items.filter(i => i.kind === 'v')).slice(0, 10);
    const s = shuffle(l.items.filter(i => i.kind === 's'));
    const q = [];
    v.forEach((it, i) => q.push(makeExercise(i % 3 === 2 ? 'listen' : (i % 2 ? 'mc_en' : 'mc_es'), it)));
    const pattern = ['listen', 'build', 'think', 'build', 'type'];
    s.forEach((it, i) => q.push(makeExercise(pattern[i % pattern.length], it)));
    return q;
  }
  function reviewType(item) {
    const b = (S.srs[item.id] || {}).b || 1;
    if (item.kind === 'v') return b <= 1 ? pick(['mc_es', 'listen']) : b <= 3 ? 'mc_en' : pick(['type', 'mc_en', 'type']);
    return b <= 1 ? pick(['listen', 'build']) : b <= 3 ? pick(['build', 'think']) : pick(['type', 'think']);
  }

  function startSession(mode, lessonId) {
    let queue;
    if (mode === 'lesson') queue = lessonQueue(byId[lessonId]);
    else if (mode === 'review') queue = dueItems().slice(0, 20).map(it => makeExercise(reviewType(it), it));
    else queue = shuffle(learnedItems()).slice(0, 15).map(it => makeExercise(reviewType(it), it));
    if (!queue.length) return;
    session = { mode, lessonId, queue, i: 0, correct: 0, answered: 0, xp: 0, retried: new Set(), wrong: new Set(), state: 'ask' };
    if (location.hash === '#/session') render(); else go('#/session');
  }

  function viewSession() {
    const s = session;
    if (s.i >= s.queue.length) return viewSessionEnd();
    const ex = s.queue[s.i];
    const it = ex.item;
    const pct = s.i / s.queue.length * 100;
    let prompt = '', body = '', footer = '';
    const label = { mc_es: 'What does this mean?', mc_en: 'Choose the Spanish', listen: 'What did you hear?', build: 'Build it in Spanish', type: 'Write it in Spanish', think: 'Say it in Spanish' }[ex.type];
    if (ex.type === 'mc_es') {
      prompt = `<div class="prompt es-prompt"><span>${esc(it.es)}</span>${speakBtn(it.es)}</div>`;
    } else if (ex.type === 'mc_en') {
      prompt = `<div class="prompt">${esc(it.en)}${heSpan(it.he)}</div>`;
    } else if (ex.type === 'listen') {
      prompt = `<div class="listen-wrap"><button class="listen-big" data-say="${esc(it.es)}" aria-label="Play">${I.speaker}</button><button class="link slow" data-say-slow="${esc(it.es)}">slower</button></div>`;
    } else {
      prompt = `<div class="prompt">${esc(it.en)}${heSpan(it.he)}</div>`;
    }
    if (ex.options) {
      body = `<div class="options">${ex.options.map((o, k) => `<button class="opt" data-opt="${k}">${esc(o.text)}</button>`).join('')}</div>`;
    } else if (ex.type === 'build') {
      body = `<div class="build-answer" id="buildAns">${ex.picked.map(id => { const t = ex.tiles.find(x => x.id === id); return `<button class="tile" data-unpick="${id}">${esc(t.t)}</button>`; }).join('') || '<span class="muted small">Tap the words in order</span>'}</div>
        <div class="tiles">${ex.tiles.map(t => `<button class="tile ${ex.picked.includes(t.id) ? 'used' : ''}" data-pick="${t.id}" ${ex.picked.includes(t.id) ? 'disabled' : ''}>${esc(t.t)}</button>`).join('')}</div>`;
      footer = `<button class="btn big" id="checkBtn" ${ex.picked.length ? '' : 'disabled'}>Check</button>`;
    } else if (ex.type === 'type') {
      body = `<textarea id="typeIn" class="type-in" rows="2" lang="es" placeholder="Escribe en español…" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false"></textarea>
        <div class="accents">${['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map(c => `<button class="acc" data-acc="${c}">${c}</button>`).join('')}</div>`;
      footer = `<button class="btn big" id="checkBtn">Check</button><button class="link" id="skipBtn">I don't know</button>`;
    } else if (ex.type === 'think') {
      body = `<p class="muted center think-hint">Work it out in your head or out loud, then check yourself. Language Transfer's golden rule: <b>think, don't memorize</b>.</p>`;
      footer = `<button class="btn big" id="revealBtn">Show answer</button>`;
    }
    view.innerHTML = `
      <div class="session">
        <header class="session-bar">
          <button class="icon-btn" id="quitBtn" aria-label="Quit">${I.close}</button>
          <div class="progress"><i style="width:${pct}%"></i></div>
          <span class="small muted">${s.i + 1}/${s.queue.length}</span>
        </header>
        <div class="session-body">
          <div class="ex-label">${label}${s.retried.has(s.i) ? ' · <span class="accent">try again</span>' : ''}</div>
          ${prompt}
          ${body}
        </div>
        <footer class="session-foot" id="foot">${footer}</footer>
      </div>`;

    $('#quitBtn').onclick = () => { if (s.answered === 0 || confirm('Quit this session? Answers so far still count toward your review.')) { session = null; go(s.mode === 'lesson' ? '#/lesson/' + s.lessonId : '#/review'); } };
    const slow = $('[data-say-slow]'); if (slow) slow.onclick = () => Speech.say(slow.dataset.saySlow, Math.max(0.5, S.settings.rate - 0.3));

    if (S.settings.autoplay && (ex.type === 'mc_es' || ex.type === 'listen')) setTimeout(() => Speech.say(it.es), 250);
    else if (ex.type === 'listen' && !S.settings.autoplay) { /* user taps the speaker */ }

    if (ex.options) {
      $$('[data-opt]').forEach(b => b.onclick = () => {
        if (s.state !== 'ask') return;
        const o = ex.options[+b.dataset.opt];
        $$('[data-opt]').forEach((bb, k) => { bb.disabled = true; if (ex.options[k].ok) bb.classList.add('right'); });
        if (!o.ok) b.classList.add('wrong');
        grade(o.ok);
      });
    } else if (ex.type === 'build') {
      $$('[data-pick]').forEach(b => b.onclick = () => { if (s.state !== 'ask') return; ex.picked.push(+b.dataset.pick); viewSession(); });
      $$('[data-unpick]').forEach(b => b.onclick = () => { if (s.state !== 'ask') return; ex.picked = ex.picked.filter(x => x !== +b.dataset.unpick); viewSession(); });
      $('#checkBtn').onclick = () => {
        const ans = ex.picked.map(id => ex.tiles.find(x => x.id === id).t).join(' ');
        const r = check(ans, it.alts);
        $('#buildAns').classList.add(r.ok ? 'right' : 'wrong');
        $$('.tile').forEach(t => t.disabled = true);
        grade(r.ok, r);
      };
    } else if (ex.type === 'type') {
      const ta = $('#typeIn');
      setTimeout(() => ta.focus(), 50);
      $$('[data-acc]').forEach(b => {
        b.addEventListener('pointerdown', e => e.preventDefault());
        b.onclick = () => {
          const c = b.dataset.acc, st = ta.selectionStart ?? ta.value.length, en = ta.selectionEnd ?? ta.value.length;
          ta.value = ta.value.slice(0, st) + c + ta.value.slice(en); ta.focus(); ta.setSelectionRange(st + 1, st + 1);
        };
      });
      ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#checkBtn') && $('#checkBtn').click(); } });
      $('#checkBtn').onclick = () => {
        if (!ta.value.trim()) { ta.focus(); return; }
        const r = check(ta.value, it.alts);
        ta.readOnly = true; ta.classList.add(r.ok ? 'right' : 'wrong'); ta.blur();
        grade(r.ok, r);
      };
      $('#skipBtn').onclick = () => { ta.readOnly = true; ta.blur(); grade(false); };
    } else if (ex.type === 'think') {
      $('#revealBtn').onclick = () => {
        Speech.say(it.es);
        $('.session-body').insertAdjacentHTML('beforeend', `<div class="reveal"><div class="es-prompt big-es"><span>${esc(it.es)}</span>${speakBtn(it.es)}</div>${it.alts.length > 1 ? `<p class="muted small">Also correct: ${it.alts.slice(1).map(esc).join(' · ')}</p>` : ''}</div>`);
        $('#foot').innerHTML = `<p class="small muted center">Did you get it?</p><div class="btn-row"><button class="btn ghost" id="noBtn">Not quite</button><button class="btn" id="yesBtn">Got it</button></div>`;
        $('#yesBtn').onclick = () => grade(true, { self: true });
        $('#noBtn').onclick = () => grade(false, { self: true });
      };
    }
  }

  function grade(ok, info = {}) {
    const s = session, ex = s.queue[s.i], it = ex.item;
    s.state = 'feedback';
    s.answered++;
    const firstTry = !s.retried.has(s.i);
    if (ok) { s.correct++; s.xp += firstTry ? 10 : 5; } else s.wrong.add(it.id);
    if (s.mode === 'lesson') {
      if (!ok && firstTry) { s.queue.push(makeExercise(ex.type === 'type' ? 'build' : ex.type, it)); s.retried.add(s.queue.length - 1); }
    } else {
      srsGrade(it, ok, s.mode); save();
    }
    if (S.settings.autoplay && ex.type !== 'think') Speech.say(it.es);
    const showAnswer = ex.type !== 'think';
    const msg = ok ? pick(['¡Muy bien!', '¡Perfecto!', '¡Excelente!', '¡Eso es!', '¡Bien hecho!']) : (info.self ? 'No problem. It will come back.' : 'Not quite');
    let extra = '';
    if (ok && info.accent) extra = `<p class="small">Watch the accents: <b>${esc(info.alt)}</b></p>`;
    else if (!ok && info.accent) extra = `<p class="small">Only the accents were off (strict mode is on).</p>`;
    if (ok && info.alt && info.alt !== it.es && !info.accent) extra += `<p class="small muted">Also correct: ${esc(it.es)}</p>`;
    $('#foot').innerHTML = `
      <div class="feedback ${ok ? 'ok' : 'bad'}">
        <div class="fb-head"><b>${msg}</b>${it.he && S.settings.hebrew ? heSpan(it.he) : ''}</div>
        ${showAnswer && (!ok || ex.type === 'listen' || ex.type === 'mc_en') ? `<div class="fb-answer"><span>${esc(it.es)}</span>${speakBtn(it.es)}</div><div class="small">${esc(it.en)}</div>` : ''}
        ${extra}
        <button class="btn big ${ok ? '' : 'bad'}" id="nextBtn">Continue</button>
      </div>`;
    $('#nextBtn').onclick = next;
    $('#nextBtn').focus({ preventScroll: true });
  }

  function next() {
    session.i++; session.state = 'ask';
    viewSession();
    window.scrollTo(0, 0);
  }

  function viewSessionEnd() {
    const s = session;
    const total = s.answered;
    const firstTryTotal = s.queue.length - s.retried.size;
    const acc = s.mode === 'lesson' ? Math.max(0, (firstTryTotal - s.wrong.size) / firstTryTotal) : (total ? s.correct / total : 0);
    let added = 0;
    if (!s.done) {
      s.done = true;
      if (s.mode === 'lesson') {
        const l = byId[s.lessonId];
        const prev = S.lessons[l.id];
        S.lessons[l.id] = { best: Math.max(acc, prev ? prev.best : 0), date: Date.now() };
        l.items.forEach(it => {
          if (!S.srs[it.id]) { added++; S.srs[it.id] = { b: 1, d: s.wrong.has(it.id) ? Date.now() : startOfDay() + DAY + 3 * 3600000 }; }
          else if (s.wrong.has(it.id)) { S.srs[it.id].b = 1; S.srs[it.id].d = Date.now(); }
        });
      }
      s.added = added;
      recordActivity(s.xp);
    }
    const l = s.mode === 'lesson' ? byId[s.lessonId] : null;
    const nxt = l ? LESSONS[l.idx + 1] : null;
    const title = acc >= 0.9 ? '¡Fantástico!' : acc >= 0.7 ? '¡Muy bien!' : '¡Buen trabajo!';
    view.innerHTML = `
      <div class="session end">
        <div class="end-body">
          <div class="end-badge">${I.check}</div>
          <h1>${title}</h1>
          <p class="muted">${l ? `Lesson ${l.id} complete` : s.mode === 'review' ? 'Review complete' : 'Practice complete'}</p>
          <div class="stats">
            <div class="stat"><b>${Math.round(acc * 100)}%</b><span>accuracy</span></div>
            <div class="stat"><b>+${s.xp}</b><span>XP</span></div>
            <div class="stat"><b>${streakNow()}</b><span>day streak</span></div>
          </div>
          ${l && s.added ? `<p class="muted small center">${s.added} new words and sentences added to your daily review.</p>` : ''}
          ${l && l.lt ? `<p class="small center">Want more? Listen to <a href="${window.LT_TRACKS[l.lt[0] - 1]}" target="_blank" rel="noopener">Language Transfer track ${l.lt[0]}</a>.</p>` : ''}
        </div>
        <footer class="session-foot">
          ${nxt ? `<button class="btn big" id="endNext">Next: ${esc(nxt.title)}</button>` : ''}
          ${!l && dueItems().length ? `<button class="btn big" id="endMore">Review ${Math.min(20, dueItems().length)} more</button>` : ''}
          <button class="btn ghost big" id="endHome">Back to lessons</button>
        </footer>
      </div>`;
    const n = $('#endNext'); if (n) n.onclick = () => { session = null; go('#/lesson/' + nxt.id); };
    const m = $('#endMore'); if (m) m.onclick = () => startSession('review');
    $('#endHome').onclick = () => { session = null; go('#/'); };
  }

  /* ================= Global handlers ================= */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-say]');
    if (t) { Speech.say(t.dataset.say); t.classList.add('playing'); setTimeout(() => t.classList.remove('playing'), 600); }
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.say[role=button]')) { e.preventDefault(); e.target.click(); }
  });

  let toastTimer;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }
  window.appToast = toast;
  window.__hablemos = { check, norm }; // for debugging in the console

  // Refresh "due" badge when returning to the app.
  document.addEventListener('visibilitychange', () => { if (!document.hidden && route().name !== 'session') render(); });

  render();
})();
