/**
 * Настройки портфолио. Всё, что нужно поменять под себя, находится здесь.
 */
window.PORTFOLIO_CONFIG = {
  // Логин GitHub: профиль и репозитории подтягиваются в реальном времени через GitHub API.
  githubUser: "Xtop1337",

  // Как часто (в минутах) обновлять данные, пока вкладка открыта.
  // Без токена GitHub даёт 60 запросов в час с одного IP — 5 минут безопасно.
  refreshMinutes: 5,

  // Статус занятости: "open" — свободен, "partial" — частично занят, "busy" — занят.
  availability: {
    status: "open",
    label: "Открыт к новым проектам",
    note: "Фриланс, удалённая работа и совместные проекты. Отвечаю в течение 24 часов.",
  },

  // Репозитории, которые не нужно показывать (по имени).
  hiddenRepos: [],

  // Репозитории, которые нужно закрепить первыми (по имени).
  pinnedRepos: [],

  // Показывать ли форки.
  showForks: false,

  // Ручные правки для конкретных репозиториев: ссылка на демо, описание, превью.
  // Пример: "my-site": { demo: "https://example.com", description: "Лендинг для кофейни" }
  repoOverrides: {},

  // Интерактивный стек технологий. level — уровень владения от 0 до 100.
  // match — языки/топики GitHub, по которым фильтруются проекты при клике.
  stack: [
    { name: "HTML5", category: "Frontend", level: 92, color: "#e34f26", match: ["HTML"], note: "Семантическая вёрстка и доступность" },
    { name: "CSS3", category: "Frontend", level: 88, color: "#2965f1", match: ["CSS", "SCSS"], note: "Flex, Grid, анимации, адаптив" },
    { name: "JavaScript", category: "Frontend", level: 85, color: "#f7df1e", match: ["JavaScript"], note: "ES2023+, DOM, Fetch API" },
    { name: "TypeScript", category: "Frontend", level: 70, color: "#3178c6", match: ["TypeScript"], note: "Типизация больших интерфейсов" },
    { name: "React", category: "Frontend", level: 72, color: "#61dafb", match: ["react"], note: "Компоненты, хуки, SPA" },
    { name: "Tailwind CSS", category: "Frontend", level: 75, color: "#38bdf8", match: ["tailwind", "tailwindcss"], note: "Быстрая стилизация интерфейсов" },
    { name: "Node.js", category: "Backend", level: 65, color: "#5fa04e", match: ["nodejs", "node"], note: "REST API, скрипты, автоматизация" },
    { name: "Python", category: "Backend", level: 68, color: "#3776ab", match: ["Python"], note: "Боты, парсеры, утилиты" },
    { name: "Git", category: "Инструменты", level: 85, color: "#f05032", match: [], note: "Ветки, ревью, GitHub Flow" },
    { name: "GitHub Pages", category: "Инструменты", level: 85, color: "#8b5cf6", match: [], note: "Хостинг и деплой сайтов" },
    { name: "Figma", category: "Инструменты", level: 60, color: "#a259ff", match: [], note: "Макеты и прототипы" },
    { name: "VS Code", category: "Инструменты", level: 90, color: "#0a84ff", match: [], note: "Основной редактор" },
  ],

  // Форма обратной связи → Google Forms.
  // formId берётся из ссылки на форму: https://docs.google.com/forms/d/e/<formId>/viewform
  // entries — имена полей формы вида "entry.123456789" (как их получить — см. README).
  // Пока entries пустые, на сайте показывается встроенная Google-форма.
  googleForm: {
    formId: "1FAIpQLSfntB85uiaX8nUMAefr3M0V_QX7K7Mwb3cDJFxr24Ry6Yczwg",
    entries: {
      name: "",
      email: "",
      message: "",
    },
  },
};
