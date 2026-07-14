// Content model
const profile = {
  heroSummary:
    "I am an AI & Data Science student at SVNIT Surat, passionate about building intelligent software, solving algorithmic problems, exploring quantitative finance, and developing scalable modern applications.",
  typingRoles: [
    "ARTIFICIAL INTELLIGENCE",
    "MACHINE LEARNING",
    "SOFTWARE DEVELOPMENT",
    "QUANTITATIVE FINANCE",
    "COMPETITIVE PROGRAMMING"
  ],
  ctas: [
    { label: "Download Resume", href: "#contact", variant: "primary-button" },
    { label: "View Projects", href: "#projects", variant: "secondary-button" },
    { label: "GitHub", href: "https://github.com/", variant: "secondary-button", external: true },
    { label: "LinkedIn", href: "https://linkedin.com/", variant: "secondary-button", external: true },
    { label: "LeetCode", href: "https://leetcode.com/", variant: "secondary-button", external: true },
    { label: "Codeforces", href: "https://codeforces.com/", variant: "secondary-button", external: true }
  ],
  heroMetrics: [
    { label: "Current focus", value: "AI, DSA, Quant, Web" },
    { label: "University", value: "SVNIT Surat" },
    { label: "Best fit", value: "Internship and placement roles" }
  ]
};

const projects = [
  {
    title: "Mobile Forensics Tool",
    category: "Python",
    year: "2026",
    featured: true,
    summary:
      "A modular forensic workflow for extracting, analyzing, timeline mapping, and reporting mobile data in a usable investigation flow.",
    impact:
      "Demonstrates system design, domain-specific reasoning, data handling, and the ability to structure a multi-module software project.",
    stack: ["Python", "Data Analysis", "Reporting", "Dashboard"],
    demoUrl: "#",
    codeUrl: "#"
  },
  {
    title: "University Management System",
    category: "Java",
    year: "2026",
    featured: false,
    summary:
      "An object-oriented academic management system with user roles, validation, exception handling, and course workflows.",
    impact:
      "Strong interview project for showing class design, business rule modeling, and clean logic separation.",
    stack: ["Java", "OOP", "Validation", "Exception Handling"],
    demoUrl: "#",
    codeUrl: "#"
  },
  {
    title: "Premium Portfolio Website",
    category: "Frontend",
    year: "2026",
    featured: false,
    summary:
      "A polished portfolio built to improve first impressions with better information hierarchy, interaction quality, and recruiter-friendly structure.",
    impact:
      "Transforms personal work into a stronger professional asset before technical discussions begin.",
    stack: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    demoUrl: "#",
    codeUrl: "#"
  }
];

const journey = [
  {
    step: "01",
    title: "Built strong academic fundamentals",
    description:
      "Focused on programming, object-oriented design, and translating coursework into projects that are easier to explain and defend."
  },
  {
    step: "02",
    title: "Moved toward practical software building",
    description:
      "Started building projects that solve realistic problems instead of stopping at assignment-level implementations."
  },
  {
    step: "03",
    title: "Now shaping a placement-ready profile",
    description:
      "Improving DSA, software quality, quantitative thinking, and communication so the portfolio supports internship and campus hiring goals."
  }
];

const skills = [
  {
    group: "Languages",
    items: ["Java", "Python", "JavaScript", "HTML", "CSS", "SQL"]
  },
  {
    group: "Computer Science",
    items: ["OOP", "DSA", "Problem Solving", "Debugging", "Logic Building"]
  },
  {
    group: "Development",
    items: ["Responsive UI", "Project Architecture", "Dashboards", "Reporting Tools"]
  },
  {
    group: "Professional Value",
    items: ["Project Demos", "Technical Explanation", "Documentation", "Presentation Prep"]
  }
];

const workStyle = [
  "Choose projects that solve a real or realistic problem.",
  "Keep architecture explainable enough for interviews and reviews.",
  "Balance technical quality with clarity of presentation.",
  "Treat each project as proof, not only coursework."
];

const codingProfile = {
  codolioUrl: "https://codolio.com/profile/ImDarshil13",
  statsImage: "https://dsastats.vercel.app/api/codolio/ImDarshil13",
  stats: [
    { label: "LeetCode Solved", value: "XXX" },
    { label: "Codeforces Rating", value: "XXXX" },
    { label: "GeeksforGeeks Solved", value: "XXX" },
    { label: "Total Problems", value: "XXX+" },
  ],
};

const achievements = [
  {
    title: "Technical Storytelling",
    description:
      "Projects are positioned so the problem, approach, system flow, and improvement scope can be explained clearly."
  },
  {
    title: "Academic Relevance",
    description:
      "The portfolio supports coursework visibility, viva discussions, and final-year presentation quality."
  },
  {
    title: "Internship Readiness",
    description:
      "Built so a recruiter can understand technical identity quickly instead of opening scattered profiles."
  },
  {
    title: "Scalable Identity",
    description:
      "The structure can grow with certifications, coding profiles, achievements, research, and stronger future work."
  }
];

// DOM references
const pageRoot = document.getElementById("pageRoot");
const topbar = document.getElementById("topbar");
const loaderOverlay = document.getElementById("loaderOverlay");
const loaderCounter = document.getElementById("loaderCounter");
const heroSummary = document.getElementById("heroSummary");
const typingWords = document.getElementById("typingWords");
const heroCopy = document.querySelector(".hero-copy");
const journeyNodes = document.querySelectorAll(".journey-node");
const ctaCluster = document.getElementById("ctaCluster");
const heroMetrics = document.getElementById("heroMetrics");
const projectFilters = document.getElementById("projectFilters");
const projectsGrid = document.getElementById("projectsGrid");
const journeyGrid = document.getElementById("journeyGrid");
const skillGroups = document.getElementById("skillGroups");
const workStyleList = document.getElementById("workStyleList");
const achievementsGrid = document.getElementById("achievementsGrid");
const codingStatsGrid = document.getElementById("codingStatsGrid");
const codingStatsImage = document.getElementById("codingStatsImage");
const codingFallbackNote = document.getElementById("codingFallbackNote");
const emailValue = document.getElementById("emailValue");
const copyEmailButton = document.getElementById("copyEmailButton");
const copyStatus = document.getElementById("copyStatus");
const themeToggle = document.getElementById("themeToggle");
const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");
const sectionNodes = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const categories = ["All", ...new Set(projects.map((project) => project.category))];
const state = {
  typingRoleIndex: 0,
  typingCharacterIndex: 0,
  isDeleting: false,
  currentFilter: "All",
  activeSectionId: "home"
};

// Render helpers
function renderHero() {
  heroSummary.textContent = profile.heroSummary;

  ctaCluster.innerHTML = profile.ctas
    .map((cta) => {
      const target = cta.external ? ' target="_blank" rel="noreferrer"' : "";
      return `
        <a class="interactive-button glass-reflect ${cta.variant}" href="${cta.href}"${target}>
          ${cta.label}
        </a>
      `;
    })
    .join("");

  heroMetrics.innerHTML = profile.heroMetrics
    .map(
      (metric) => `
        <article class="metric-card">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
        </article>
      `
    )
    .join("");
}

function renderProjectFilters() {
  projectFilters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-button ${category === state.currentFilter ? "active" : ""}"
          type="button"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");

  projectFilters.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentFilter = button.dataset.category;
      renderProjectFilters();
      renderProjects();
    });
  });
}

function renderProjects() {
  const filteredProjects =
    state.currentFilter === "All"
      ? projects
      : projects.filter((project) => project.category === state.currentFilter);

  projectsGrid.innerHTML = filteredProjects
    .map(
      (project) => `
        <article class="glass-card project-card ${project.featured ? "featured" : ""}">
          <div class="project-meta">
            <span>${project.category}</span>
            <span class="project-year">${project.year}</span>
          </div>
          <div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
          </div>
          <p><strong>Why it matters:</strong> ${project.impact}</p>
          <div class="project-tags">
            ${project.stack.map((item) => `<span class="project-tag">${item}</span>`).join("")}
          </div>
          <div class="project-links">
            <a href="${project.demoUrl}">Live Demo</a>
            <a href="${project.codeUrl}">Source Code</a>
          </div>
        </article>
      `
    )
    .join("");
}

function renderJourney() {
  journeyGrid.innerHTML = journey
    .map(
      (item) => `
        <article class="glass-card journey-card">
          <span class="journey-step">${item.step}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `
    )
    .join("");
}

function renderSkills() {
  skillGroups.innerHTML = skills
    .map(
      (skill) => `
        <article class="skill-card">
          <h3>${skill.group}</h3>
          <div class="skill-chip-list">
            ${skill.items.map((item) => `<span class="skill-chip">${item}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderWorkStyle() {
  workStyleList.innerHTML = workStyle.map((item) => `<li>${item}</li>`).join("");
}

function renderCodingProfile() {
  codingStatsGrid.innerHTML = codingProfile.stats
    .map(
      (stat) => `
        <article class="stat-card">
          <strong class="stat-value">${stat.value}</strong>
          <span class="stat-value-label">${stat.label}</span>
        </article>
      `,
    )
    .join("");

  codingStatsImage.addEventListener(
    "error",
    () => {
      codingStatsImage.hidden = true;
      codingFallbackNote.hidden = false;
    },
    { once: true },
  );
}

function renderAchievements() {
  achievementsGrid.innerHTML = achievements
    .map(
      (item) => `
        <article class="glass-card achievement-card">
          <span class="card-tag">${item.title}</span>
          <strong>${item.title}</strong>
          <p>${item.description}</p>
        </article>
      `
    )
    .join("");
}

// Interactions
function startTypingLoop() {
  const currentWord = profile.typingRoles[state.typingRoleIndex];
  const activeText = state.isDeleting
    ? currentWord.slice(0, state.typingCharacterIndex - 1)
    : currentWord.slice(0, state.typingCharacterIndex + 1);

  typingWords.textContent = activeText;
  state.typingCharacterIndex = activeText.length;
  syncHeroJourney(activeText.length, currentWord.length);

  let delay = state.isDeleting ? 42 : 90;

  if (!state.isDeleting && activeText === currentWord) {
    delay = 1000;
    state.isDeleting = true;
  } else if (state.isDeleting && activeText === "") {
    state.isDeleting = false;
    state.typingRoleIndex = (state.typingRoleIndex + 1) % profile.typingRoles.length;
    syncHeroJourney(0, profile.typingRoles[state.typingRoleIndex].length);
    delay = 260;
  }

  window.setTimeout(startTypingLoop, delay);
}

function syncHeroJourney(characterCount, wordLength) {
  const safeLength = Math.max(wordLength, 1);
  const progress = Math.max(0, Math.min(characterCount / safeLength, 1));
  const progressPercent = `${(progress * 100).toFixed(2)}%`;

  heroCopy?.style.setProperty("--journey-progress", progressPercent);
  heroCopy?.style.setProperty("--journey-energy", progress.toFixed(3));

  const thresholds = [0, 0.18, 0.34, 0.52, 0.7, 0.86, 1];
  journeyNodes.forEach((node, index) => {
    const isPassed = progress > thresholds[index] + 0.035;
    const isActive = progress >= Math.max(0, thresholds[index] - 0.035) && progress <= Math.min(1, thresholds[index] + 0.08);

    node.classList.toggle("is-passed", isPassed);
    node.classList.toggle("is-active", isActive);
  });
}

function setupRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupSectionTracking() {
  const visibilityMap = new Map();

  function setActiveNavLink(currentId) {
    if (!currentId || state.activeSectionId === currentId) {
      return;
    }

    state.activeSectionId = currentId;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const nextActiveSection = [...visibilityMap.entries()]
        .sort((left, right) => right[1] - left[1])[0]?.[0];

      if (nextActiveSection) {
        setActiveNavLink(nextActiveSection);
      }
    },
    {
      rootMargin: "-30% 0px -45% 0px",
      threshold: [0.1, 0.2, 0.35, 0.5, 0.7]
    }
  );

  sectionNodes.forEach((section) => observer.observe(section));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").slice(1);
      setActiveNavLink(targetId);
    });
  });
}

function setupNavPointerEffects() {
  navLinks.forEach((link) => {
    function updatePointer(event) {
      const rect = link.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      link.style.setProperty("--nav-pointer-x", `${x}%`);
      link.style.setProperty("--nav-pointer-y", `${y}%`);
    }

    link.addEventListener("pointerenter", updatePointer);
    link.addEventListener("pointermove", updatePointer);
  });
}

function setupNavbarScrollBehavior() {
  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) {
        return;
      }

      scrollTicking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        topbar.classList.toggle("scrolled", currentScrollY > 24);
        topbar.classList.remove("nav-hidden");
        scrollTicking = false;
      });
    },
    { passive: true }
  );
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-counter-target]");
  const animated = new WeakSet();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || animated.has(entry.target)) {
          return;
        }

        animated.add(entry.target);
        animateCounter(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(node) {
  const target = Number(node.dataset.counterTarget || 0);
  const suffix = node.dataset.counterSuffix || "";
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    node.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function setupThemeToggle() {
  const savedTheme = window.localStorage.getItem("portfolio-theme");

  if (savedTheme === "light") {
    document.body.classList.add("theme-light");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-light");
    const nextTheme = document.body.classList.contains("theme-light") ? "light" : "dark";
    window.localStorage.setItem("portfolio-theme", nextTheme);
  });
}

function setupRippleEffect() {
  document.querySelectorAll(".interactive-button, .topbar-button").forEach((node) => {
    node.addEventListener("click", (event) => {
      const rect = node.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      ripple.className = "ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      node.appendChild(ripple);

      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  });
}

async function copyEmail() {
  const email = emailValue.textContent.trim();

  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Email copied. Replace the placeholder with your real address before publishing.";
  } catch (error) {
    copyStatus.textContent = "Clipboard access failed. Copy the email manually after updating it.";
  }
}

function runLoader() {
  const durationMs = 2800;
  const startValue = 1;
  const endValue = 100;
  const startTime = performance.now();

  function updateFrame(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.min(
      endValue,
      Math.floor(startValue + (endValue - startValue) * easedProgress)
    );

    loaderCounter.textContent = String(currentValue).padStart(3, "0");

    if (progress < 1) {
      requestAnimationFrame(updateFrame);
      return;
    }

    loaderCounter.textContent = "100";
    loaderOverlay.classList.add("is-hidden");
    document.body.classList.add("page-ready");
    pageRoot.classList.remove("page-hidden");
    pageRoot.classList.add("page-visible");
  }

  requestAnimationFrame(updateFrame);
}

function init() {
  yearNode.textContent = new Date().getFullYear();
  renderHero();
  renderProjectFilters();
  renderProjects();
  renderJourney();
  renderSkills();
  renderWorkStyle();
  renderCodingProfile();
  renderAchievements();
  setupRevealObserver();
  setupSectionTracking();
  setupNavPointerEffects();
  setupNavbarScrollBehavior();
  setupCounters();
  setupThemeToggle();
  setupRippleEffect();
  startTypingLoop();
  copyEmailButton.addEventListener("click", copyEmail);
  runLoader();
}

init();
