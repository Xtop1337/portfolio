const defaultProfile = {
  login: "Xtop1337",
  name: "Xtop1337",
  bio: "Developer and designer focused on clean interfaces, product thinking, and polished digital experiences.",
  avatar_url: "https://avatars.githubusercontent.com/u/121298652?v=4",
  html_url: "https://github.com/Xtop1337",
  blog: "",
  location: "Remote / Worldwide",
  public_repos: 0,
  followers: 0,
  hireable: true,
  type: "User"
};

const fallbackRepos = [
  {
    name: "portfolio",
    full_name: "Xtop1337/portfolio",
    description: "Modern personal portfolio with glassmorphism styling and responsive UI.",
    html_url: "https://github.com/Xtop1337/portfolio",
    homepage: "",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["portfolio", "frontend"]
  },
  {
    name: "ui-kit-demo",
    full_name: "Xtop1337/ui-kit-demo",
    description: "Reusable interface system built around clean components and design tokens.",
    html_url: "https://github.com/Xtop1337/ui-kit-demo",
    homepage: "",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["ui", "design-system"]
  },
  {
    name: "dashboard-prototype",
    full_name: "Xtop1337/dashboard-prototype",
    description: "Dashboard concept for analytics-driven workflows and product clarity.",
    html_url: "https://github.com/Xtop1337/dashboard-prototype",
    homepage: "",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["dashboard", "ux"]
  }
];

const profileApi = "https://api.github.com/users/Xtop1337";
const reposApi = "https://api.github.com/users/Xtop1337/repos?sort=updated&per_page=6";
const contactFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfntB85uiaX8nUMAefr3M0V_QX7K7Mwb3cDJFxr24Ry6Yczwg/viewform?usp=publish-editor";

const profileNameEl = document.getElementById("profileName");
const profileBioEl = document.getElementById("profileBio");
const profileAvatarEl = document.getElementById("profileAvatar");
const githubLinkEl = document.getElementById("githubLink");
const githubLinkContactEl = document.getElementById("githubLinkContact");
const githubProfileButtonEl = document.getElementById("githubProfileButton");
const portfolioLinkEl = document.getElementById("portfolioLink");
const projectsGridEl = document.getElementById("projectsGrid");
const availabilityTextEl = document.getElementById("availabilityText");
const followersCountEl = document.getElementById("followersCount");
const repoCountEl = document.getElementById("repoCount");
const locationTextEl = document.getElementById("locationText");
const formStatusEl = document.getElementById("formStatus");
const yearEl = document.getElementById("year");
const themeToggleEl = document.getElementById("themeToggle");

const root = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");

function applyTheme(theme) {
  const isLight = theme === "light";
  root.classList.toggle("light", isLight);
  localStorage.setItem("portfolio-theme", theme);
}

if (savedTheme) {
  applyTheme(savedTheme);
} else {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(prefersLight ? "light" : "dark");
}

themeToggleEl.addEventListener("click", () => {
  const nextTheme = root.classList.contains("light") ? "dark" : "light";
  applyTheme(nextTheme);
});

function renderProfile(profile) {
  const safeName = profile.name || profile.login || "Xtop1337";
  const safeBio = profile.bio || "Developer creating thoughtful digital experiences.";
  const safeLocation = profile.location || "Remote / Worldwide";
  const safeFollowers = profile.followers ?? 0;
  const safeRepos = profile.public_repos ?? 0;

  profileNameEl.textContent = safeName;
  profileBioEl.textContent = safeBio;
  profileAvatarEl.src = profile.avatar_url || defaultProfile.avatar_url;
  profileAvatarEl.alt = `${safeName} avatar`;

  githubLinkEl.href = profile.html_url || defaultProfile.html_url;
  githubLinkContactEl.href = profile.html_url || defaultProfile.html_url;
  githubProfileButtonEl.href = profile.html_url || defaultProfile.html_url;
  portfolioLinkEl.href = profile.blog || profile.html_url || defaultProfile.html_url;

  followersCountEl.textContent = safeFollowers.toLocaleString();
  repoCountEl.textContent = safeRepos.toLocaleString();
  locationTextEl.textContent = safeLocation;

  availabilityTextEl.textContent = profile.hireable ? "Available for work" : "Not available right now";
}

function renderProjects(repos) {
  const data = Array.isArray(repos) && repos.length ? repos : fallbackRepos;

  const markup = data
    .filter((repo) => repo && repo.name)
    .slice(0, 6)
    .map((repo) => {
      const name = repo.name || "Untitled project";
      const description = repo.description || "A focused project built with performance and usability in mind.";
      const language = repo.language || "Code";
      const stars = repo.stargazers_count ?? 0;
      const forks = repo.forks_count ?? 0;
      const homepage = repo.homepage || "";
      const projectUrl = repo.html_url || "#";
      const topic = repo.topics && repo.topics.length ? repo.topics[0] : "Product";

      return `
        <article class="project-card">
          <div class="project-top">
            <h3 class="project-name">${name}</h3>
            <span class="project-language">${language}</span>
          </div>

          <p class="project-description">${description}</p>

          <div class="project-meta">
            <span>★ ${stars}</span>
            <span>⎇ ${forks}</span>
            <span>${topic}</span>
          </div>

          <div class="project-actions">
            <a class="project-link" href="${projectUrl}" target="_blank" rel="noreferrer">Source code</a>
            ${homepage ? `<a class="project-link" href="${homepage}" target="_blank" rel="noreferrer">Demo</a>` : ""}
          </div>
        </article>
      `;
    })
    .join("");

  projectsGridEl.innerHTML = markup;
}

async function loadGitHubData() {
  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(profileApi, { headers: { Accept: "application/vnd.github+json" } }),
      fetch(reposApi, { headers: { Accept: "application/vnd.github+json" } })
    ]);

    if (!profileResponse.ok) {
      throw new Error("Profile request failed");
    }

    const profile = await profileResponse.json();
    const repos = reposResponse.ok ? await reposResponse.json() : fallbackRepos;

    renderProfile(profile);
    renderProjects(repos);
  } catch (error) {
    renderProfile(defaultProfile);
    renderProjects(fallbackRepos);
  }
}

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const project = (data.get("project") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  if (!name || !email || !project || !message) {
    formStatusEl.textContent = "Please complete all fields before sending.";
    formStatusEl.style.color = "var(--warning)";
    return;
  }

  const googleFormUrl = `${contactFormUrl}&entry.1404557893=${encodeURIComponent(name)}&entry.573393221=${encodeURIComponent(email)}&entry.2061467077=${encodeURIComponent(project)}&entry.286742202=${encodeURIComponent(message)}`;

  formStatusEl.textContent = "Opening the Google Form to send your message…";
  formStatusEl.style.color = "var(--success)";

  window.open(googleFormUrl, "_blank", "noopener,noreferrer");
  form.reset();
});

const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

loadGitHubData();
