// Content model
const profile = {
  heroSummary:
    "I am an AI & Data Science student at SVNIT Surat, passionate about building intelligent software, solving algorithmic problems, exploring quantitative finance, and developing scalable modern applications.",
  typingRoles: [
    "AI Engineer",
    "Competitive Programmer",
    "Future Quant Developer",
    "Problem Solver",
    "Software Engineer",
    "Machine Learning Enthusiast"
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
  ],
  focusAreas: ["DSA", "AI", "Quant", "Web Development"],
  stats: [
    { label: "LeetCode", value: 250, suffix: "+" },
    { label: "Codeforces", value: 1200, suffix: "+" },
    { label: "Projects", value: 8, suffix: "+" },
    { label: "Hackathons", value: 4, suffix: "+" },
    { label: "GitHub", value: 40, suffix: "+" }
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
const ctaCluster = document.getElementById("ctaCluster");
const heroMetrics = document.getElementById("heroMetrics");
const focusList = document.getElementById("focusList");
const statsGrid = document.getElementById("statsGrid");
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
const aiScene = document.getElementById("aiScene");

const revealNodes = document.querySelectorAll(".reveal");
const sectionNodes = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const categories = ["All", ...new Set(projects.map((project) => project.category))];
const state = {
  typingRoleIndex: 0,
  typingCharacterIndex: 0,
  isDeleting: false,
  currentFilter: "All",
  lastScrollY: 0,
  backgroundScene: null
};

class AIBackgroundScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = 0;
    this.height = 0;
    this.pixelRatio = 1;
    this.animationFrame = 0;
    this.time = 0;
    this.running = false;
    this.nodes = [];
    this.shapes = [];
    this.orbPoints = [];
    this.wavePoints = [];
    this.mouse = { x: 0.5, y: 0.5 };
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  init() {
    if (!this.ctx) {
      return;
    }

    this.handleResize();
    window.addEventListener("resize", this.handleResize, { passive: true });
    window.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.running = true;
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("pointermove", this.handlePointerMove);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  handlePointerMove(event) {
    this.mouse.x = event.clientX / Math.max(window.innerWidth, 1);
    this.mouse.y = event.clientY / Math.max(window.innerHeight, 1);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(this.animationFrame);
      return;
    }

    this.animationFrame = requestAnimationFrame(this.animate);
  }

  handleResize() {
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.8);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.pixelRatio);
    this.canvas.height = Math.floor(this.height * this.pixelRatio);
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.buildScene();
  }

  buildScene() {
    const area = this.width * this.height;
    const nodeCount = area < 600000 ? 24 : 40;
    const shapeCount = area < 600000 ? 4 : 7;
    const orbCount = 22;
    const waveColumns = Math.max(18, Math.floor(this.width / 90));
    const waveRows = 5;

    this.nodes = Array.from({ length: nodeCount }, (_, index) => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height * 0.72,
      z: Math.random() * 1,
      radius: 1.2 + Math.random() * 2.4,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.12,
      pulse: Math.random() * Math.PI * 2,
      cluster: index % 2
    }));

    this.shapes = Array.from({ length: shapeCount }, () => ({
      x: Math.random() * this.width,
      y: this.height * (0.14 + Math.random() * 0.44),
      size: 14 + Math.random() * 22,
      rotation: Math.random() * Math.PI,
      speed: (Math.random() - 0.5) * 0.003,
      drift: 0.08 + Math.random() * 0.14,
      type: Math.random() > 0.5 ? "hex" : "diamond",
      depth: 0.5 + Math.random() * 0.6
    }));

    this.orbPoints = Array.from({ length: orbCount }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      return { theta, phi, speed: 0.001 + Math.random() * 0.002 };
    });

    this.wavePoints = Array.from({ length: waveRows }, (_, row) =>
      Array.from({ length: waveColumns }, (_, column) => ({
        column,
        row,
        offset: Math.random() * Math.PI * 2
      }))
    );
  }

  getPalette() {
    const light = document.body.classList.contains("theme-light");
    return light
      ? {
          line: "rgba(58, 99, 255, 0.16)",
          node: "rgba(58, 99, 255, 0.7)",
          nodeGlow: "rgba(28, 169, 233, 0.35)",
          wave: "rgba(58, 99, 255, 0.36)",
          waveGlow: "rgba(28, 169, 233, 0.22)",
          orb: "rgba(58, 99, 255, 0.26)",
          shape: "rgba(58, 99, 255, 0.28)"
        }
      : {
          line: "rgba(124, 156, 255, 0.16)",
          node: "rgba(103, 209, 255, 0.92)",
          nodeGlow: "rgba(103, 209, 255, 0.3)",
          wave: "rgba(103, 209, 255, 0.38)",
          waveGlow: "rgba(124, 156, 255, 0.24)",
          orb: "rgba(124, 156, 255, 0.32)",
          shape: "rgba(124, 156, 255, 0.28)"
        };
  }

  animate(now) {
    if (!this.running || document.hidden) {
      return;
    }

    this.time = now;
    this.draw();
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  draw() {
    const ctx = this.ctx;
    const palette = this.getPalette();

    ctx.clearRect(0, 0, this.width, this.height);
    this.drawOrb(palette);
    this.drawNetwork(palette);
    this.drawWaveTerrain(palette);
    this.drawShapes(palette);
  }

  drawNetwork(palette) {
    const ctx = this.ctx;
    const parallaxX = (this.mouse.x - 0.5) * 26;
    const parallaxY = (this.mouse.y - 0.5) * 20;

    for (const node of this.nodes) {
      if (!this.reducedMotion) {
        node.x += node.speedX * (0.5 + node.z);
        node.y += node.speedY * (0.5 + node.z);
      }

      if (node.x < -50) node.x = this.width + 30;
      if (node.x > this.width + 50) node.x = -30;
      if (node.y < -20) node.y = this.height * 0.65;
      if (node.y > this.height * 0.75) node.y = -10;

      node.renderX = node.x + parallaxX * node.z;
      node.renderY = node.y + parallaxY * node.z;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < this.nodes.length; i += 1) {
      const nodeA = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j += 1) {
        const nodeB = this.nodes[j];
        const dx = nodeA.renderX - nodeB.renderX;
        const dy = nodeA.renderY - nodeB.renderY;
        const distance = Math.hypot(dx, dy);
        const maxDistance = 160 + (nodeA.cluster === nodeB.cluster ? 30 : 0);

        if (distance > maxDistance) {
          continue;
        }

        ctx.strokeStyle = palette.line.replace("0.16", String((1 - distance / maxDistance) * 0.18));
        ctx.beginPath();
        ctx.moveTo(nodeA.renderX, nodeA.renderY);
        ctx.lineTo(nodeB.renderX, nodeB.renderY);
        ctx.stroke();
      }
    }

    for (const node of this.nodes) {
      const pulse = 0.55 + Math.sin(this.time * 0.0014 + node.pulse) * 0.18;
      ctx.beginPath();
      ctx.fillStyle = palette.node;
      ctx.shadowBlur = 14;
      ctx.shadowColor = palette.nodeGlow;
      ctx.arc(node.renderX, node.renderY, node.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  drawWaveTerrain(palette) {
    const ctx = this.ctx;
    const baseY = this.height * 0.72;
    const columns = this.wavePoints[0].length;
    const spacingX = this.width / (columns - 1);
    const rowSpacing = 22;

    this.wavePoints.forEach((rowPoints, rowIndex) => {
      const points = rowPoints.map((point, columnIndex) => {
        const x = columnIndex * spacingX;
        const phase = this.time * 0.0013 + point.offset + rowIndex * 0.8;
        const y =
          baseY +
          rowIndex * rowSpacing +
          Math.sin(phase + columnIndex * 0.45) * 22 +
          Math.cos(phase * 0.8 + columnIndex * 0.18) * 12;

        return { x, y };
      });

      ctx.beginPath();
      ctx.strokeStyle = palette.wave;
      ctx.lineWidth = rowIndex === 0 ? 1.4 : 1;
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      points.forEach((point, index) => {
        if (index % 3 !== 0) {
          return;
        }

        ctx.beginPath();
        ctx.fillStyle = palette.waveGlow;
        ctx.shadowBlur = 12;
        ctx.shadowColor = palette.waveGlow;
        ctx.arc(point.x, point.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (rowIndex > 0) {
        const prevPoints = this.wavePoints[rowIndex - 1].map((point, columnIndex) => {
          const x = columnIndex * spacingX;
          const phase = this.time * 0.0013 + point.offset + (rowIndex - 1) * 0.8;
          const y =
            baseY +
            (rowIndex - 1) * rowSpacing +
            Math.sin(phase + columnIndex * 0.45) * 22 +
            Math.cos(phase * 0.8 + columnIndex * 0.18) * 12;

          return { x, y };
        });

        ctx.strokeStyle = palette.line;
        for (let i = 0; i < points.length; i += 2) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(prevPoints[i].x, prevPoints[i].y);
          ctx.stroke();
        }
      }
    });
  }

  drawShapes(palette) {
    const ctx = this.ctx;

    this.shapes.forEach((shape, index) => {
      if (!this.reducedMotion) {
        shape.rotation += shape.speed;
        shape.y += Math.sin(this.time * 0.0006 + index) * 0.06 * shape.drift;
      }

      const driftX = Math.sin(this.time * 0.0004 + index * 3) * 20 * shape.depth;
      const driftY = Math.cos(this.time * 0.0005 + index * 2) * 16 * shape.depth;

      ctx.save();
      ctx.translate(shape.x + driftX, shape.y + driftY);
      ctx.rotate(shape.rotation);
      ctx.strokeStyle = palette.shape;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 16;
      ctx.shadowColor = palette.shape;

      if (shape.type === "hex") {
        this.drawPolygon(ctx, 6, shape.size);
      } else {
        this.drawPolygon(ctx, 4, shape.size);
      }

      ctx.stroke();
      ctx.restore();
      ctx.shadowBlur = 0;
    });
  }

  drawOrb(palette) {
    const ctx = this.ctx;
    const centerX = this.width * 0.8;
    const centerY = this.height * 0.24;
    const radius = Math.min(this.width, this.height) * 0.14;
    const points = [];

    this.orbPoints.forEach((point) => {
      const theta = point.theta + this.time * point.speed * (this.reducedMotion ? 0.2 : 1);
      const phi = point.phi;
      const x3d = Math.cos(theta) * Math.sin(phi);
      const y3d = Math.sin(theta) * Math.sin(phi);
      const z3d = Math.cos(phi);
      const scale = 0.62 + (z3d + 1) * 0.22;

      points.push({
        x: centerX + x3d * radius * scale,
        y: centerY + y3d * radius * scale,
        z: z3d
      });
    });

    ctx.strokeStyle = palette.orb;
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance > radius * 0.6) {
          continue;
        }

        ctx.globalAlpha = 0.08 + ((1 - distance / (radius * 0.6)) * 0.18);
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    points.forEach((point) => {
      ctx.beginPath();
      ctx.fillStyle = palette.node;
      ctx.shadowBlur = 14;
      ctx.shadowColor = palette.nodeGlow;
      ctx.arc(point.x, point.y, 1.6 + point.z * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }

  drawPolygon(ctx, sides, radius) {
    ctx.beginPath();
    for (let i = 0; i <= sides; i += 1) {
      const angle = (Math.PI * 2 * i) / sides;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  }
}

// Render helpers
function renderHero() {
  heroSummary.textContent = profile.heroSummary;

  ctaCluster.innerHTML = profile.ctas
    .map((cta) => {
      const target = cta.external ? ' target="_blank" rel="noreferrer"' : "";
      return `
        <a class="interactive-button ${cta.variant}" href="${cta.href}"${target}>
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

  focusList.innerHTML = profile.focusAreas.map((item) => `<li>${item}</li>`).join("");

  statsGrid.innerHTML = profile.stats
    .map(
      (stat) => `
        <article class="stat-card">
          <strong class="stat-value" data-counter-target="${stat.value}" data-counter-suffix="${stat.suffix}">
            0${stat.suffix}
          </strong>
          <span class="stat-value-label">${stat.label}</span>
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

  let delay = state.isDeleting ? 55 : 95;

  if (!state.isDeleting && activeText === currentWord) {
    delay = 1400;
    state.isDeleting = true;
  } else if (state.isDeleting && activeText === "") {
    state.isDeleting = false;
    state.typingRoleIndex = (state.typingRoleIndex + 1) % profile.typingRoles.length;
    delay = 260;
  }

  window.setTimeout(startTypingLoop, delay);
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
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
        });
      });
    },
    {
      rootMargin: "-30% 0px -45% 0px",
      threshold: 0.1
    }
  );

  sectionNodes.forEach((section) => observer.observe(section));
}

function setupNavbarScrollBehavior() {
  state.lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      topbar.classList.toggle("scrolled", currentScrollY > 24);

      if (currentScrollY > state.lastScrollY && currentScrollY > 140) {
        topbar.classList.add("nav-hidden");
      } else {
        topbar.classList.remove("nav-hidden");
      }

      state.lastScrollY = currentScrollY;
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

function setupBackgroundScene() {
  if (!aiScene) {
    return;
  }

  state.backgroundScene = new AIBackgroundScene(aiScene);
  state.backgroundScene.init();
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
  setupNavbarScrollBehavior();
  setupCounters();
  setupThemeToggle();
  setupBackgroundScene();
  setupRippleEffect();
  startTypingLoop();
  copyEmailButton.addEventListener("click", copyEmail);
  runLoader();
}

init();
