* {
  box-sizing: border-box;
}

:root {
  --bg: #07111b;
  --bg-soft: rgba(18, 24, 33, 0.7);
  --panel: rgba(16, 22, 32, 0.58);
  --panel-strong: rgba(22, 28, 38, 0.82);
  --card: rgba(255, 255, 255, 0.06);
  --card-border: rgba(255, 255, 255, 0.12);
  --stroke: rgba(255, 255, 255, 0.08);
  --text: #edf4ff;
  --text-soft: #b7c4d6;
  --text-muted: #90a2b9;
  --primary: #5eead4;
  --primary-2: #67e8f9;
  --accent: #8b5cf6;
  --shadow: rgba(6, 13, 20, 0.45);
  --chip: rgba(255, 255, 255, 0.06);
  --success: #34d399;
  --warning: #fbbf24;
}

:root.light {
  --bg: #edf4ff;
  --bg-soft: rgba(255, 255, 255, 0.7);
  --panel: rgba(255, 255, 255, 0.68);
  --panel-strong: rgba(255, 255, 255, 0.82);
  --card: rgba(255, 255, 255, 0.45);
  --card-border: rgba(110, 120, 145, 0.18);
  --stroke: rgba(10, 20, 36, 0.06);
  --text: #122033;
  --text-soft: #334560;
  --text-muted: #65748d;
  --primary: #0ea5e9;
  --primary-2: #8b5cf6;
  --accent: #6366f1;
  --shadow: rgba(62, 95, 135, 0.12);
  --chip: rgba(18, 32, 51, 0.04);
  --success: #0ea371;
  --warning: #d97706;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: "Inter", sans-serif;
  background: var(--bg);
  color: var(--text);
  transition: background 0.35s ease, color 0.35s ease;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

.page-shell {
  position: relative;
  min-height: 100vh;
  padding: 24px clamp(16px, 2vw, 32px) 48px;
  overflow: hidden;
}

.bg-grid {
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 100%);
  pointer-events: none;
}

.bg-orb {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.28;
  pointer-events: none;
}

.orb-1 {
  background: rgba(94, 234, 212, 0.5);
  top: -110px;
  left: -90px;
}

.orb-2 {
  background: rgba(139, 92, 246, 0.5);
  right: -80px;
  top: 180px;
}

.glass,
.glass-inner {
  background: var(--panel);
  border: 1px solid var(--card-border);
  box-shadow: 0 24px 70px var(--shadow);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.topbar {
  position: sticky;
  top: 16px;
  z-index: 20;
  max-width: 1200px;
  margin: 0 auto 28px;
  padding: 16px 22px;
  border-radius: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #07111b;
  font-weight: 800;
}

.nav {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  color: var(--text-soft);
}

.nav a {
  transition: color 0.2s ease;
}

.nav a:hover,
.text-link:hover,
.contact-list a:hover {
  color: var(--text);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.theme-toggle {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--card-border);
  background: rgba(255,255,255,0.03);
  color: var(--text);
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.theme-toggle:hover {
  transform: translateY(-1px);
}

.icon-sun,
.icon-moon {
  font-size: 1rem;
}

:root:not(.light) .icon-moon {
  display: none;
}

:root.light .icon-sun {
  display: none;
}

.cta-link,
.button,
.text-link {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.cta-link,
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--card-border);
  background: rgba(255,255,255,0.04);
  color: var(--text);
  font-weight: 600;
}

.button.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  border: none;
  color: #06131d;
  box-shadow: 0 18px 40px rgba(94, 234, 212, 0.3);
}

.button.secondary {
  background: rgba(255,255,255,0.02);
}

.cta-link:hover,
.button:hover,
.text-link:hover {
  transform: translateY(-2px);
}

main {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  border-radius: 30px;
  padding: clamp(28px, 4vw, 54px);
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 24px;
  min-height: 620px;
  align-items: center;
}

.hero-copy {
  padding-right: 8px;
}

.eyebrow-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.08);
  border: 1px solid rgba(52, 211, 153, 0.2);
  font-size: 0.78rem;
  color: var(--success);
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 8px rgba(52, 211, 153, 0.12);
}

h1 {
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
  margin: 22px 0 18px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--primary-2), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lead {
  max-width: 620px;
  font-size: 1.08rem;
  line-height: 1.7;
  color: var(--text-soft);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 28px;
}

.quick-stats {
  list-style: none;
  padding: 0;
  margin: 30px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.quick-stats li {
  min-width: 120px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid var(--card-border);
  background: rgba(255,255,255,0.02);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick-stats strong {
  font-size: 1.35rem;
}

.quick-stats span {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.profile-panel {
  display: flex;
  justify-content: center;
}

.profile-card {
  width: min(100%, 420px);
  border-radius: 28px;
  padding: 22px;
  background: rgba(17, 24, 32, 0.5);
}

.avatar-wrap {
  width: 120px;
  height: 120px;
  border-radius: 34px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.12);
  box-shadow: 0 14px 35px rgba(12, 16, 22, 0.28);
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-meta {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
  margin-top: 18px;
}

.muted-label {
  margin: 0 0 6px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.68rem;
}

.profile-meta h2 {
  margin: 0;
  font-size: clamp(1.4rem, 2vw, 2rem);
}

.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.badge,
.chip {
  border: 1px solid var(--card-border);
  background: var(--chip);
  border-radius: 999px;
  padding: 0.42rem 0.72rem;
  font-size: 0.74rem;
  color: var(--text-soft);
}

.profile-bio {
  margin-top: 20px;
  line-height: 1.7;
  color: var(--text-soft);
}

.profile-links {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.profile-links a {
  padding: 0.64rem 0.9rem;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--card-border);
}

.section-block {
  padding-top: 90px;
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: -0.05em;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
}

.row-between {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.text-link {
  color: var(--text-soft);
  font-weight: 600;
}

.about-grid,
.stack-grid,
.showcase-grid,
.contact-grid {
  display: grid;
  gap: 20px;
}

.about-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.info-card,
.skill-card,
.demo-card,
.contact-panel,
.form-panel {
  border-radius: 24px;
  padding: 24px;
}

.info-card h3,
.skill-card h3,
.demo-content h3,
.contact-panel h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.info-card p,
.demo-content p,
.contact-panel p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.project-card {
  border-radius: 24px;
  padding: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--card-border);
  box-shadow: 0 18px 52px var(--shadow);
  transition: transform 0.28s ease, border-color 0.28s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(94, 234, 212, 0.35);
}

.project-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.project-name {
  margin: 0;
  font-size: 1.2rem;
}

.project-language {
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
}

.project-description {
  min-height: 72px;
  color: var(--text-soft);
  line-height: 1.7;
  margin-bottom: 18px;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--text-muted);
  font-size: 0.8rem;
  margin-bottom: 18px;
}

.project-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.42rem 0.6rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.03);
}

.project-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.project-link {
  color: var(--text);
  font-weight: 600;
}

.stack-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.showcase-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.demo-card {
  overflow: hidden;
  padding: 0;
}

.demo-visual {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.demo-one {
  background:
    linear-gradient(120deg, rgba(14, 165, 233, 0.4), rgba(139, 92, 246, 0.4)),
    radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 30%),
    linear-gradient(135deg, #0b1120, #1f2a44 52%, #0f172a);
}

.demo-two {
  background:
    linear-gradient(135deg, rgba(16, 24, 40, 0.25), rgba(94, 234, 212, 0.6)),
    linear-gradient(135deg, #0a1221, #0f1f2f, #101827);
}

.demo-content {
  padding: 22px 22px 26px;
}

.contact-grid {
  grid-template-columns: 0.9fr 1.1fr;
}

.contact-panel,
.form-panel {
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--card-border);
  box-shadow: 0 18px 52px var(--shadow);
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-list li {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--text-soft);
}

.contact-list span {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-panel label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-soft);
}

.form-panel input,
.form-panel textarea {
  width: 100%;
  border: 1px solid var(--card-border);
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
  color: var(--text);
  padding: 0.9rem 1rem;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-panel input:focus,
.form-panel textarea:focus {
  outline: none;
  border-color: rgba(94, 234, 212, 0.8);
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.15);
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.form-status {
  min-height: 24px;
  margin: 0;
  color: var(--success);
  font-weight: 500;
}

.footer {
  max-width: 1200px;
  margin: 54px auto 0;
  padding: 30px 0 0;
  text-align: center;
  border-top: 1px solid var(--stroke);
  color: var(--text-muted);
}

@media (max-width: 980px) {
  .hero,
  .contact-grid,
  .about-grid,
  .projects-grid,
  .stack-grid,
  .showcase-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .hero {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .page-shell {
    padding-top: 18px;
  }

  .topbar {
    padding: 14px 16px;
    top: 10px;
  }

  .brand-name {
    font-size: 0.92rem;
  }

  .nav {
    gap: 12px;
    font-size: 0.85rem;
    flex-wrap: wrap;
  }

  .hero,
  .info-card,
  .skill-card,
  .demo-card,
  .contact-panel,
  .form-panel,
  .project-card {
    border-radius: 20px;
  }

  .hero {
    padding: 24px 18px;
  }

  .project-actions,
  .form-actions,
  .profile-meta,
  .row-between {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge-row {
    justify-content: flex-start;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .button,
  .cta-link {
    width: 100%;
  }
}

@keyframes floatUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero,
.project-card,
.skill-card,
.info-card,
.demo-card,
.contact-panel,
.form-panel {
  animation: floatUp 0.6s ease both;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}











































































































































































































"},{