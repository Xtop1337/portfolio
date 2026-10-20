(() => {
  "use strict";

  const CFG = window.PORTFOLIO_CONFIG || {};
  const USER = CFG.githubUser || "Xtop1337";
  const API = "https://api.github.com";
  const CACHE_KEY = `gh-portfolio:${USER.toLowerCase()}`;
  const REFRESH_MS = Math.max(1, CFG.refreshMinutes || 5) * 60 * 1000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const LANG_COLORS = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c", SCSS: "#c6538c",
    Python: "#3572A5", Java: "#b07219", "C#": "#178600", "C++": "#f34b7d", C: "#555555", Go: "#00ADD8",
    Rust: "#dea584", PHP: "#4F5D95", Ruby: "#701516", Kotlin: "#A97BFF", Swift: "#F05138", Dart: "#00B4AB",
    Vue: "#41b883", Svelte: "#ff3e00", Shell: "#89e051", Lua: "#000080", "Jupyter Notebook": "#DA5B0B",
    Astro: "#ff5a03", MDX: "#fcb32c", Dockerfile: "#384d54", PowerShell: "#012456", Batchfile: "#C1F12E",
  };
  const langColor = (lang) => LANG_COLORS[lang] || "#8b8fa8";

  const state = {
    user: null,
    repos: [],
    filter: { lang: "all", q: "", sort: "updated", tech: null },
    stackCategory: "Все",
  };

  /* ---------------- Утилиты ---------------- */

  const escapeHTML = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const safeUrl = (url) => {
    if (!url) return "";
    const withProto = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    try {
      const u = new URL(withProto);
      return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
    } catch {
      return "";
    }
  };

  const prettyUrl = (url) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });
  const timeAgo = (date) => {
    const diff = (new Date(date) - Date.now()) / 1000;
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [unit, sec] of units) {
      if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
    }
    return "только что";
  };

  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };

  const storage = {
    get(key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* приватный режим */ }
    },
  };

  /* ---------------- Тема ---------------- */

  const themeToggle = $("#themeToggle");
  const metaTheme = $('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    metaTheme.setAttribute("content", theme === "light" ? "#eef1fb" : "#090b16");
    themeToggle.setAttribute("aria-label", theme === "light" ? "Включить тёмную тему" : "Включить светлую тему");
  };

  applyTheme(document.documentElement.dataset.theme || "dark");

  themeToggle.addEventListener("click", (e) => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", next); } catch { /* ignore */ }

    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }
    // Круговое «растекание» новой темы от кнопки
    const x = e.clientX || window.innerWidth - 40;
    const y = e.clientY || 40;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => applyTheme(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  });

  // Следуем за системной темой, если пользователь не выбрал свою
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch { /* ignore */ }
    if (!saved) applyTheme(e.matches ? "light" : "dark");
  });

  /* ---------------- Навигация ---------------- */

  const nav = $(".nav");
  const burger = $("#burger");
  const navLinks = $("#navLinks");

  const closeMenu = () => {
    navLinks.classList.remove("is-open");
    nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => e.target.closest("a") && closeMenu());
  document.addEventListener("click", (e) => !nav.contains(e.target) && closeMenu());

  const progressEl = $(".scroll-progress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progressEl.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
    nav.classList.toggle("is-scrolled", scrollY > 10);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Подсветка активного раздела
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$("#navLinks a").forEach((a) => a.classList.toggle("is-active", a.hash === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => sectionObserver.observe(s));

  /* ---------------- Анимации ---------------- */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  const observeReveal = (root = document) => {
    $$(".reveal:not(.is-visible)", root).forEach((el, i) => {
      if (!el.style.getPropertyValue("--delay")) el.style.setProperty("--delay", `${Math.min(i, 8) * 60}ms`);
      revealObserver.observe(el);
    });
  };

  // Fluent Reveal — блик следует за курсором
  document.addEventListener(
    "pointermove",
    (e) => {
      const el = e.target.closest?.(".glass");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    { passive: true }
  );

  // Лёгкий 3D-наклон карточки профиля
  const canTilt = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion;
  if (canTilt) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  const animateCount = (el, to) => {
    const from = Number(el.dataset.value || 0);
    el.dataset.value = to;
    if (reduceMotion || from === to) {
      el.textContent = to.toLocaleString("ru-RU");
      return;
    }
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased).toLocaleString("ru-RU");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------------- Статус занятости ---------------- */

  const renderAvailability = () => {
    const a = CFG.availability || {};
    const status = ["open", "partial", "busy"].includes(a.status) ? a.status : "open";
    const label = a.label || "Открыт к новым проектам";
    $("#statusPill").dataset.status = status;
    $("#availabilityCard").dataset.status = status;
    $("#statusLabel").textContent = label;
    $("#availabilityLabel").textContent = label;
    $("#availabilityNote").textContent = a.note || "";
    $("#statusNote").textContent = a.note || "";
  };

  /* ---------------- GitHub API ---------------- */

  const liveEl = $(".live");
  const liveText = $("#liveText");
  const refreshBtn = $("#refreshBtn");

  const fetchJSON = async (url) => {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) {
      const err = new Error(`GitHub API: ${res.status}`);
      err.status = res.status;
      err.reset = Number(res.headers.get("x-ratelimit-reset")) * 1000 || 0;
      throw err;
    }
    return res.json();
  };

  const fetchGitHub = async () => {
    const [user, repos] = await Promise.all([
      fetchJSON(`${API}/users/${USER}`),
      fetchJSON(`${API}/users/${USER}/repos?per_page=100&sort=updated&type=owner`),
    ]);
    return { user, repos };
  };

  let loading = false;

  const load = async ({ silent = false } = {}) => {
    if (loading) return;
    loading = true;
    refreshBtn.classList.add("is-spinning");
    if (!silent) liveText.textContent = "Загрузка данных GitHub…";

    try {
      const data = await fetchGitHub();
      storage.set(CACHE_KEY, { t: Date.now(), data });
      render(data);
      setLive("live", `Обновлено ${new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} · онлайн`);
    } catch (err) {
      const cached = storage.get(CACHE_KEY);
      const limitMsg =
        err.status === 403 || err.status === 429
          ? `Лимит GitHub API${err.reset ? `, повтор после ${new Date(err.reset).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}` : ""}`
          : "Нет связи с GitHub";
      if (cached?.data) {
        if (!state.user) render(cached.data);
        setLive("error", `${limitMsg} · показаны данные от ${new Date(cached.t).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`);
      } else {
        setLive("error", limitMsg);
        renderError();
      }
    } finally {
      loading = false;
      refreshBtn.classList.remove("is-spinning");
    }
  };

  const setLive = (mode, text) => {
    liveEl.classList.toggle("is-live", mode === "live");
    liveEl.classList.toggle("is-error", mode === "error");
    liveText.textContent = text;
  };

  refreshBtn.addEventListener("click", () => load());

  // Обновление в реальном времени: периодически и при возвращении на вкладку
  let lastLoad = Date.now();
  setInterval(() => {
    if (document.visibilityState === "visible") {
      lastLoad = Date.now();
      load({ silent: true });
    }
  }, REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && Date.now() - lastLoad > REFRESH_MS) {
      lastLoad = Date.now();
      load({ silent: true });
    }
  });

  /* ---------------- Подготовка данных ---------------- */

  const pagesUrl = (repo) => {
    const login = repo.owner.login.toLowerCase();
    return repo.name.toLowerCase() === `${login}.github.io` ? `https://${login}.github.io/` : `https://${login}.github.io/${repo.name}/`;
  };

  const normalizeRepos = (repos) => {
    const hidden = new Set((CFG.hiddenRepos || []).map((n) => n.toLowerCase()));
    const pinned = (CFG.pinnedRepos || []).map((n) => n.toLowerCase());
    const overrides = CFG.repoOverrides || {};

    return repos
      .filter((r) => !hidden.has(r.name.toLowerCase()))
      .filter((r) => CFG.showForks || !r.fork)
      .filter((r) => r.name.toLowerCase() !== USER.toLowerCase()) // профильный README
      .map((r) => {
        const o = overrides[r.name] || {};
        const demo = safeUrl(o.demo || r.homepage || (r.has_pages ? pagesUrl(r) : ""));
        return {
          name: r.name,
          title: o.title || r.name.replace(/[-_]+/g, " "),
          description: o.description || r.description || "",
          url: r.html_url,
          demo,
          language: r.language,
          topics: r.topics || [],
          stars: r.stargazers_count,
          forks: r.forks_count,
          updated: r.pushed_at || r.updated_at,
          archived: r.archived,
          fork: r.fork,
          pinned: pinned.indexOf(r.name.toLowerCase()),
        };
      });
  };

  /* ---------------- Рендер ---------------- */

  let lastSignature = "";

  const render = (data) => {
    const signature = JSON.stringify(data);
    if (signature === lastSignature) return; // ничего не изменилось — не трогаем DOM и превью
    lastSignature = signature;
    const { user, repos } = data;
    state.user = user;
    state.repos = normalizeRepos(repos);
    renderProfile(user);
    renderLanguages();
    renderSites();
    renderLangFilters();
    renderProjects();
    renderStack();
  };

  const renderProfile = (u) => {
    const name = u.name || u.login;
    const avatar = `${u.avatar_url}${u.avatar_url.includes("?") ? "&" : "?"}s=240`;

    $$('[data-bind="name"]').forEach((el) => (el.textContent = name));
    $$('[data-bind="login"]').forEach((el) => (el.textContent = u.login));
    $$('[data-bind="avatar"]').forEach((el) => (el.src = avatar));
    $$('[data-bind="profileLink"]').forEach((el) => (el.href = u.html_url));
    if (u.bio) $$('[data-bind="bio"]').forEach((el) => (el.textContent = u.bio));
    document.title = `${name} — Портфолио`;

    const blog = safeUrl(u.blog);
    const items = [
      u.company && ["i-building", `<span>${escapeHTML(u.company)}</span>`],
      u.location && ["i-pin", `<span>${escapeHTML(u.location)}</span>`],
      blog && ["i-link", `<a href="${escapeHTML(blog)}" target="_blank" rel="noopener">${escapeHTML(prettyUrl(blog))}</a>`],
      u.created_at && ["i-calendar", `<span>На GitHub с ${new Date(u.created_at).getFullYear()} года</span>`],
    ].filter(Boolean);
    $("#profileMeta").innerHTML = items.map(([icon, html]) => `<li><svg><use href="#${icon}"/></svg>${html}</li>`).join("");

    if (blog) {
      $("#blogLinkItem").hidden = false;
      $("#blogLink").href = blog;
      $("#blogLinkText").textContent = prettyUrl(blog);
    }

    const stars = state.repos.reduce((sum, r) => sum + r.stars, 0);
    animateCount($('[data-count="repos"]'), u.public_repos);
    animateCount($('[data-count="stars"]'), stars);
    animateCount($('[data-count="followers"]'), u.followers);
    $("#profileCard").setAttribute("aria-busy", "false");
  };

  const languageStats = () => {
    const counts = {};
    state.repos.forEach((r) => r.language && (counts[r.language] = (counts[r.language] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const renderLanguages = () => {
    const stats = languageStats();
    const bar = $("#langBar");
    if (!stats.length) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    const total = stats.reduce((s, [, n]) => s + n, 0);
    const track = $("#langTrack");
    track.innerHTML = stats
      .map(([lang, n]) => `<span style="--c:${langColor(lang)}" data-w="${((n / total) * 100).toFixed(2)}" title="${escapeHTML(lang)}"></span>`)
      .join("");
    $("#langLegend").innerHTML = stats
      .map(([lang, n]) => `<li><span class="dot" style="--c:${langColor(lang)}"></span>${escapeHTML(lang)} <b>${Math.round((n / total) * 100)}%</b></li>`)
      .join("");
    requestAnimationFrame(() => requestAnimationFrame(() => $$("span", track).forEach((s) => (s.style.width = `${s.dataset.w}%`))));
    observeReveal(bar.parentElement);
  };

  const sortRepos = (list, sort) => {
    const byPinned = (a, b) => (a.pinned === -1 ? 1e9 : a.pinned) - (b.pinned === -1 ? 1e9 : b.pinned);
    const sorters = {
      updated: (a, b) => new Date(b.updated) - new Date(a.updated),
      stars: (a, b) => b.stars - a.stars || new Date(b.updated) - new Date(a.updated),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort((a, b) => byPinned(a, b) || sorters[sort](a, b));
  };

  /* Сайты с живым превью */
  const sitesGrid = $("#sitesGrid");
  let frameResizer = null;

  const renderSites = () => {
    const sites = sortRepos(state.repos.filter((r) => r.demo), "updated");
    if (!sites.length) {
      sitesGrid.innerHTML = `
        <div class="empty glass">
          <strong>Сайты скоро появятся</strong>
          Добавьте ссылку в поле «Website» репозитория на GitHub или включите GitHub Pages — карточка появится здесь автоматически.
        </div>`;
      return;
    }

    sitesGrid.innerHTML = sites
      .map(
        (s) => `
      <article class="site glass reveal" style="--c:${langColor(s.language)}">
        <div class="site__preview">
          <div class="browser-bar">
            <span class="browser-bar__dots"><i></i><i></i><i></i></span>
            <span class="browser-bar__url">${escapeHTML(prettyUrl(s.demo))}</span>
          </div>
          <div class="site__frame">
            <span class="site__frame-label">${escapeHTML(s.title)}</span>
            <iframe data-src="${escapeHTML(s.demo)}" title="Превью: ${escapeHTML(s.title)}" tabindex="-1" aria-hidden="true"
              loading="lazy" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin"></iframe>
          </div>
          <button class="site__overlay" type="button" data-preview="${escapeHTML(s.demo)}" aria-label="Предпросмотр ${escapeHTML(s.title)}">
            <span><svg><use href="#i-eye"/></svg> Предпросмотр</span>
          </button>
        </div>
        <div class="site__body">
          <h3>${escapeHTML(s.title)}</h3>
          <p>${s.description ? escapeHTML(s.description) : "Описание пока не добавлено."}</p>
          <div class="meta">
            ${s.language ? `<span><i class="dot" style="--c:${langColor(s.language)}"></i>${escapeHTML(s.language)}</span>` : ""}
            <span><svg><use href="#i-calendar"/></svg>${timeAgo(s.updated)}</span>
          </div>
          <div class="actions">
            <a class="btn btn--primary btn--sm" href="${escapeHTML(s.demo)}" target="_blank" rel="noopener"><svg><use href="#i-external"/></svg>Открыть сайт</a>
            <a class="btn btn--glass btn--sm" href="${escapeHTML(s.url)}" target="_blank" rel="noopener"><svg><use href="#i-code"/></svg>Код</a>
            <button class="btn btn--glass btn--sm" type="button" data-preview="${escapeHTML(s.demo)}"><svg><use href="#i-eye"/></svg>Превью</button>
          </div>
        </div>
      </article>`
      )
      .join("");

    // Масштабируем iframe под ширину карточки и подгружаем, когда карточка видна
    frameResizer?.disconnect();
    frameResizer = new ResizeObserver((entries) =>
      entries.forEach((e) => e.target.style.setProperty("--scale", e.contentRect.width / 1280))
    );
    const frameLoader = new IntersectionObserver(
      (entries, obs) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const iframe = $("iframe", e.target);
          iframe.addEventListener("load", () => iframe.classList.add("is-loaded"), { once: true });
          iframe.src = iframe.dataset.src;
          obs.unobserve(e.target);
        }),
      { rootMargin: "200px" }
    );
    $$(".site__frame", sitesGrid).forEach((f) => {
      frameResizer.observe(f);
      frameLoader.observe(f);
    });
    observeReveal(sitesGrid);
  };

  /* Проекты */
  const projectsGrid = $("#projectsGrid");
  const langFilters = $("#langFilters");

  const renderLangFilters = () => {
    const stats = languageStats();
    const langs = [["all", state.repos.length], ...stats];
    if (state.filter.lang !== "all" && !stats.some(([l]) => l === state.filter.lang)) state.filter.lang = "all";
    langFilters.innerHTML = langs
      .map(
        ([lang, n]) => `
        <button class="chip ${state.filter.lang === lang ? "is-active" : ""}" type="button" role="tab"
          aria-selected="${state.filter.lang === lang}" data-lang="${escapeHTML(lang)}">
          ${lang === "all" ? "Все" : `<span class="dot" style="--c:${langColor(lang)}"></span>${escapeHTML(lang)}`}
          <small>${n}</small>
        </button>`
      )
      .join("");
  };

  langFilters.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-lang]");
    if (!chip) return;
    state.filter.lang = chip.dataset.lang;
    state.filter.tech = null;
    $$(".tech", stackGrid).forEach((t) => t.classList.remove("is-active"));
    $$(".chip", langFilters).forEach((c) => {
      c.classList.toggle("is-active", c === chip);
      c.setAttribute("aria-selected", String(c === chip));
    });
    renderProjects();
  });

  let searchTimer;
  $("#searchInput").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.filter.q = e.target.value.trim().toLowerCase();
      renderProjects();
    }, 150);
  });

  $("#sortSelect").addEventListener("change", (e) => {
    state.filter.sort = e.target.value;
    renderProjects();
  });

  const matchesTech = (repo, tech) => {
    const keys = (tech.match || []).map((m) => m.toLowerCase());
    return keys.includes((repo.language || "").toLowerCase()) || repo.topics.some((t) => keys.includes(t.toLowerCase()));
  };

  const renderProjects = () => {
    const { lang, q, sort, tech } = state.filter;
    let list = state.repos;
    if (lang !== "all") list = list.filter((r) => r.language === lang);
    if (tech) list = list.filter((r) => matchesTech(r, tech));
    if (q) {
      list = list.filter((r) =>
        [r.name, r.title, r.description, r.language, ...r.topics].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    list = sortRepos(list, sort);

    if (!list.length) {
      projectsGrid.innerHTML = `
        <div class="empty glass">
          <strong>${state.repos.length ? "Ничего не найдено" : "Публичных проектов пока нет"}</strong>
          ${state.repos.length ? "Попробуйте изменить фильтр или поисковый запрос." : "Новые репозитории появятся здесь автоматически."}
          ${tech || lang !== "all" || q ? `<br><button class="btn btn--glass btn--sm" type="button" data-reset>Сбросить фильтры</button>` : ""}
        </div>`;
      return;
    }

    projectsGrid.innerHTML = list
      .map(
        (r) => `
      <article class="project glass reveal" style="--c:${langColor(r.language)}">
        <div class="project__head">
          <span class="project__icon"><svg><use href="#i-repo"/></svg></span>
          <div class="project__title">
            <h3>${escapeHTML(r.title)}</h3>
            <small>${escapeHTML(USER)}/${escapeHTML(r.name)}</small>
          </div>
          ${r.archived ? `<span class="badge badge--muted">Архив</span>` : r.demo ? `<span class="badge">Демо</span>` : ""}
        </div>
        <p>${r.description ? escapeHTML(r.description) : "Описание пока не добавлено."}</p>
        ${r.topics.length ? `<div class="topics">${r.topics.slice(0, 5).map((t) => `<span>#${escapeHTML(t)}</span>`).join("")}</div>` : ""}
        <div class="meta">
          ${r.language ? `<span><i class="dot" style="--c:${langColor(r.language)}"></i>${escapeHTML(r.language)}</span>` : ""}
          <span title="Звёзды"><svg><use href="#i-star"/></svg>${r.stars}</span>
          <span title="Форки"><svg><use href="#i-fork"/></svg>${r.forks}</span>
          <span><svg><use href="#i-calendar"/></svg>${timeAgo(r.updated)}</span>
        </div>
        <div class="actions">
          <a class="btn btn--glass btn--sm" href="${escapeHTML(r.url)}" target="_blank" rel="noopener"><svg><use href="#i-github"/></svg>Исходный код</a>
          ${
            r.demo
              ? `<button class="btn btn--glass btn--sm" type="button" data-preview="${escapeHTML(r.demo)}"><svg><use href="#i-eye"/></svg>Демо</button>`
              : ""
          }
        </div>
      </article>`
      )
      .join("");
    observeReveal(projectsGrid);
  };

  const resetFilters = () => {
    state.filter = { ...state.filter, lang: "all", q: "", tech: null };
    $("#searchInput").value = "";
    $$(".tech", stackGrid).forEach((t) => t.classList.remove("is-active"));
    renderLangFilters();
    renderProjects();
  };

  projectsGrid.addEventListener("click", (e) => e.target.closest("[data-reset]") && resetFilters());

  const renderError = () => {
    const html = `
      <div class="empty glass">
        <strong>Не удалось загрузить данные GitHub</strong>
        Проверьте подключение или откройте профиль напрямую.
        <br><a class="btn btn--glass btn--sm" href="https://github.com/${escapeHTML(USER)}?tab=repositories" target="_blank" rel="noopener">
          <svg><use href="#i-github"/></svg>Репозитории на GitHub</a>
      </div>`;
    projectsGrid.innerHTML = html;
    sitesGrid.innerHTML = html;
    if (!stackGrid.children.length) renderStack();
  };

  /* Интерактивный стек */
  const stackGrid = $("#stackGrid");
  const stackTabs = $("#stackTabs");
  const stack = CFG.stack || [];

  const renderStack = () => {
    const categories = ["Все", ...new Set(stack.map((t) => t.category))];
    stackTabs.innerHTML = categories
      .map(
        (c) =>
          `<button class="chip ${c === state.stackCategory ? "is-active" : ""}" type="button" role="tab" aria-selected="${c === state.stackCategory}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`
      )
      .join("");

    const items = stack.filter((t) => state.stackCategory === "Все" || t.category === state.stackCategory);
    stackGrid.innerHTML = items
      .map((t, i) => {
        const count = state.repos.filter((r) => matchesTech(r, t)).length;
        const initials = t.name.replace(/[^A-Za-zА-Яа-я0-9+#]/g, "").slice(0, 2);
        const active = state.filter.tech?.name === t.name;
        return `
          <button class="tech ${active ? "is-active" : ""}" type="button" style="--c:${escapeHTML(t.color || "#6c8cff")};--lvl:${Math.max(0, Math.min(100, t.level || 0))}%;--i:${i}"
            data-tech="${escapeHTML(t.name)}" ${count ? "" : "disabled"} aria-pressed="${active}"
            title="${count ? `Показать проекты: ${escapeHTML(t.name)}` : escapeHTML(t.name)}">
            <span class="tech__top">
              <span class="tech__logo">${escapeHTML(initials)}</span>
              <span class="tech__name">${escapeHTML(t.name)}
                <small>${count ? `${count} ${plural(count, "проект", "проекта", "проектов")}` : escapeHTML(t.category)} · ${t.level || 0}%</small>
              </span>
            </span>
            ${t.note ? `<p class="tech__note">${escapeHTML(t.note)}</p>` : ""}
            <span class="tech__bar"><span></span></span>
          </button>`;
      })
      .join("");
  };

  stackTabs.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-cat]");
    if (!tab) return;
    state.stackCategory = tab.dataset.cat;
    renderStack();
  });

  stackGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tech]");
    if (!btn || btn.disabled) return;
    const tech = stack.find((t) => t.name === btn.dataset.tech);
    const same = state.filter.tech?.name === tech.name;
    state.filter.tech = same ? null : tech;
    state.filter.lang = "all";
    renderLangFilters();
    renderStack();
    renderProjects();
    if (!same) $("#projects").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------------- Предпросмотр демо ---------------- */

  const dialog = $("#previewDialog");
  const previewFrame = $("#previewFrame");
  const previewDevice = $("#previewDevice");

  const openPreview = (url) => {
    previewFrame.src = url;
    $("#previewTitle").textContent = prettyUrl(url);
    $("#previewOpen").href = url;
    setDevice(innerWidth < 600 ? "mobile" : "desktop");
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      window.open(url, "_blank", "noopener");
    }
  };

  const setDevice = (device) => {
    previewDevice.dataset.device = device;
    $$(".preview__devices button").forEach((b) => b.classList.toggle("is-active", b.dataset.device === device));
  };

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-preview]");
    if (trigger) openPreview(trigger.dataset.preview);
  });

  $(".preview__devices").addEventListener("click", (e) => {
    const b = e.target.closest("[data-device]");
    if (b) setDevice(b.dataset.device);
  });

  $("#previewClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());
  dialog.addEventListener("close", () => {
    previewFrame.src = "about:blank";
    document.body.style.overflow = "";
  });

  /* ---------------- Форма обратной связи (Google Forms) ---------------- */

  const gf = CFG.googleForm || {};
  const entries = gf.entries || {};
  const formReady = gf.formId && entries.name && entries.email && entries.message;
  const viewUrl = `https://docs.google.com/forms/d/e/${gf.formId}/viewform`;
  const form = $("#contactForm");
  const formStatus = $("#formStatus");

  const normalizeEntry = (v) => (String(v).startsWith("entry.") ? v : `entry.${v}`);

  if (formReady) {
    form.hidden = false;
  } else if (gf.formId) {
    // Пока ID полей не указаны, показываем саму Google-форму внутри стеклянной карточки
    const embed = $("#gformEmbed");
    embed.hidden = false;
    $("#gformFrame").src = `${viewUrl}?embedded=true`;
    $("#gformOpen").href = viewUrl;
  }

  const setStatus = (text, type = "") => {
    formStatus.textContent = text;
    formStatus.className = `form__status ${type ? `is-${type}` : ""}`;
  };

  form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("is-invalid"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const el = (n) => form.elements.namedItem(n);
    if (el("company").value) return; // бот

    const fields = { name: el("name").value.trim(), email: el("email").value.trim(), message: el("message").value.trim() };
    let valid = true;
    Object.entries(fields).forEach(([key, value]) => {
      const contactOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^(@|https?:\/\/t\.me\/)?[\w]{4,32}$/i.test(value);
      const bad = !value || (key === "email" && !contactOk);
      el(key).closest(".field").classList.toggle("is-invalid", bad);
      if (bad) valid = false;
    });
    if (!valid) {
      setStatus("Пожалуйста, заполните все поля корректно.", "error");
      return;
    }

    const button = $("button[type=submit]", form);
    button.disabled = true;
    setStatus("Отправка…");

    const body = new URLSearchParams();
    body.append(normalizeEntry(entries.name), fields.name);
    body.append(normalizeEntry(entries.email), fields.email);
    body.append(normalizeEntry(entries.message), fields.message);

    try {
      // Google Forms не отдаёт CORS-заголовки, поэтому ответ «непрозрачный» — сетевую ошибку всё равно поймаем.
      await fetch(`https://docs.google.com/forms/d/e/${gf.formId}/formResponse`, { method: "POST", mode: "no-cors", body });
      form.reset();
      setStatus("Спасибо! Сообщение отправлено — я скоро отвечу.", "ok");
    } catch {
      setStatus("Не удалось отправить. Попробуйте ещё раз или откройте форму напрямую.", "error");
    } finally {
      button.disabled = false;
    }
  });

  /* ---------------- Старт ---------------- */

  $("#year").textContent = new Date().getFullYear();
  renderAvailability();
  renderStack();
  observeReveal();

  const cached = storage.get(CACHE_KEY);
  if (cached?.data) {
    render(cached.data); // мгновенный показ из кэша, затем свежие данные
    setLive("", "Обновление данных…");
  }
  load({ silent: Boolean(cached) });
})();
