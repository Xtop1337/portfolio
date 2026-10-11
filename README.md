const defaultProfile = {
  login: "Xtop1337",
  name: "Xtop1337",
  bio: "I build modern digital experiences focused on clarity, performance, and polished user interfaces.",
  avatar_url: "https://avatars.githubusercontent.com/u/121298652?v=4",
  html_url: "https://github.com/Xtop1337",
  blog: "",
  location: "Remote / Worldwide",
  public_repos: 12,
  followers: 8,
  hireable: true,
  type: "User"
};

const fallbackRepos = [
  {
    name: "portfolio",
    full_name: "Xtop1337/portfolio",
    description: "Modern personal portfolio with glassmorphism design and responsive UI.",
    html_url: "https://github.com/Xtop1337/portfolio",
    homepage: "",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["portfolio", "frontend", "design"]
  },
  {
    name: "ui-kit-demo",
    full_name: "Xtop1337/ui-kit-demo",
    description: "Reusable interface system with components, tokens, and polished interactions.",
    html_url: "https://github.com/Xtop1337/ui-kit-demo",
    homepage: "",
    language: "TypeScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["ui", "components", "design-system"]
  },
  {
    name: "dashboard-prototype",
    full_name: "Xtop1337/dashboard-prototype",
    description: "A dashboard concept focused on analytics, minimal UI, and decision-making clarity.",
    html_url: "https://github.com/Xtop1337/dashboard-prototype",
    homepage: "",
    language: "JavaScript",
    stargazers_count: 0,
    forks_count: 0,
    topics: ["dashboard", "analytics", "ux"]
  }
];

const profileApi = "https://api.github.com/users/Xtop1337";
const reposApi = "https://api.github.com/users/Xtop1337/repos?sort=updated&per_page=6";
const contactFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfntB85uiaX8nUMAefr3M0V_QX7K7Mwb3cDJFxr24Ry6Yczwg/viewform?usp=publish-editor";

const profileName = document.getElementById("profileName");
const profileBio = document.getElementById("profileBio");
const profileAvatar = document.getElementById("profileAvatar");
const githubLink = document.getElementById("githubLink");
const githubLinkContact = document.getElementById("githubLinkContact");
const githubProfileButton = document.getElementById("githubProfileButton");
const portfolioLink = document.getElementById("portfolioLink");
const projectsGrid = document.getElementById("projectsGrid");
const availabilityText = document.getElementById("availabilityText");
const followersCount = document.getElementById("followersCount");
const repoCount = document.getElementById("repoCount");
const locationText = document.getElementById("locationText");
const formStatus = document.getElementById("formStatus");
const yearEl = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");

const root = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");

function setTheme(theme) {
  const isLight = theme === "light";
  root.classList.toggle("light", isLight);
  localStorage.setItem("portfolio-theme", theme);
}

if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.classList.contains("light") ? "dark" : "light";
  setTheme(nextTheme);
});

function renderProfile(profile) {
  const safeName = profile.name || profile.login || "Xtop1337";
  const safeBio = profile.bio || "Developer, designer, and builder focused on polished digital products.";
  const safeLocation = profile.location || "Remote / Worldwide";
  const safeFollowers = profile.followers ?? 0;
  const safeRepos = profile.public_repos ?? 0;

  profileName.textContent = safeName;
  profileBio.textContent = safeBio;
  profileAvatar.src = profile.avatar_url || defaultProfile.avatar_url;
  profileAvatar.alt = `${safeName} avatar`;
  githubLink.href = profile.html_url || defaultProfile.html_url;
  githubLinkContact.href = profile.html_url || defaultProfile.html_url;
  githubProfileButton.href = profile.html_url || defaultProfile.html_url;
  portfolioLink.href = profile.blog || profile.html_url || defaultProfile.html_url;

  followersCount.textContent = safeFollowers.toLocaleString();
  repoCount.textContent = safeRepos.toLocaleString();
  locationText.textContent = safeLocation;

  if (profile.hireable !== undefined) {
    availabilityText.textContent = profile.hireable ? "Available for work" : "Not available right now";
  } else {
    availabilityText.textContent = "Available for work";
  }
}

function renderProjects(repos) {
  if (!Array.isArray(repos) || repos.length === 0) {
    repos = fallbackRepos;
  }

  const visibleRepos = repos
    .filter((repo) => repo && repo.name)
    .slice(0, 6)
    .map((repo) => {
      const name = repo.name || "Untitled project";
      const description = repo.description || "A project built with a focus on performance and UX.";
      const language = repo.language || "Code";
      const stars = repo.stargazers_count ?? 0;
      const forks = repo.forks_count ?? 0;
      const homepage = repo.homepage || "";
      const projectUrl = repo.html_url || "#";

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
            ${repo.topics && repo.topics.length ? `<span>${repo.topics.slice(0, 1).join(", ")}</span>` : ""}
          </div>

          <div class="project-actions">
            <a class="project-link" href="${projectUrl}" target="_blank" rel="noreferrer">Source code</a>
            ${homepage ? `<a class="project-link" href="${homepage}" target="_blank" rel="noreferrer">Demo</a>` : ""}
          </div>
        </article>
      `;
    })
    .join("");

  projectsGrid.innerHTML = visibleRepos;
}

async function loadGitHubData() {
  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(profileApi, { headers: { Accept: "application/vnd.github+json" } }),
      fetch(reposApi, { headers: { Accept: "application/vnd.github+json" } })
    ]);

    if (!profileResponse.ok) {
      throw new Error("Profile data fetch failed");
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
    formStatus.textContent = "Please complete all fields before sending.";
    formStatus.style.color = "var(--warning)";
    return;
  }

  const draft = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Project: ${project}`,
    "",
    `Message: ${message}`
  ].join("\n");

  const googleFormUrl = `${contactFormUrl}&entry.1404557893=${encodeURIComponent(name)}&entry.573393221=${encodeURIComponent(email)}&entry.2061467077=${encodeURIComponent(project)}&entry.286742202=${encodeURIComponent(message)}`;

  formStatus.textContent = "Opening the Google Form to send your message…";
  formStatus.style.color = "var(--success)";

  window.open(googleFormUrl, "_blank", "noopener,noreferrer");
  form.reset();

  if (draft) {
    console.info("Prepared contact form message:\n", draft);
  }
});

const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

loadGitHubData();















































































































































































































































































































"}]} , {