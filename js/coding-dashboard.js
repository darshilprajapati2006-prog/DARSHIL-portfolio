(function attachCodingDashboard() {
  const config = {
    cacheTtlMs: 4 * 60 * 1000,
    refreshIntervalMs: 5 * 60 * 1000,
    contestPageSize: 8,
    usernames: {
      leetcode: "DARSHILPRAJAPATI",
      codeforces: "Darshil_Prajapati13",
      codechef: "darshil_2006",
      github: "darshilprajapati2006-prog",
      codolio: "ImDarshil13",
    },
    platformUrls: {
      leetcode: "https://leetcode.com/u/DARSHILPRAJAPATI/",
      codeforces: "https://codeforces.com/profile/Darshil_Prajapati13",
      codechef: "https://www.codechef.com/users/darshil_2006",
      github: "https://github.com/darshilprajapati2006-prog",
      codolio: "https://codolio.com/profile/ImDarshil13",
    },
    summaryCards: [
      { key: "totalSolved", label: "Total Problems Solved", icon: "🔥" },
      { key: "leetcodeSolved", label: "LeetCode", icon: "🟨" },
      { key: "codeforcesSolved", label: "Codeforces", icon: "🟦" },
      { key: "codechefSolved", label: "CodeChef", icon: "🟧" },
      { key: "aggregateRating", label: "Total Rating", icon: "⭐" },
      { key: "contestCount", label: "Contest Participated", icon: "🏆" },
      { key: "maxRating", label: "Max Rating", icon: "📈" },
      {
        key: "currentStreak",
        label: "Current Streak",
        icon: "⚡",
        suffix: "d",
      },
    ],
    trackedTopics: [
      "Arrays",
      "DP",
      "Graphs",
      "Trees",
      "Math",
      "Greedy",
      "Strings",
      "Binary Search",
      "Sliding Window",
      "Bitmask",
      "Segment Tree",
      "Backtracking",
    ],
  };

  const state = {
    hasLoaded: false,
    dashboardData: null,
    selectedRatingView: "combined",
    selectedActivityRange: "7d",
    selectedHeatmapMonth: "",
    contestSearch: "",
    contestSort: "date-desc",
    contestPage: 1,
    refreshTimer: null,
    currentRequest: null,
  };

  const dom = {};

  function initCodingDashboard() {
    const section = document.getElementById("coding-profile");
    if (!section) {
      return;
    }

    dom.section = section;
    dom.dashboard = document.getElementById("codingDashboard");
    dom.statusMessage = document.getElementById("codingStatusMessage");
    dom.lastUpdated = document.getElementById("codingLastUpdated");
    dom.refreshButton = document.getElementById("codingRefreshButton");
    dom.loadingSkeleton = document.getElementById("codingLoadingSkeleton");
    dom.content = document.getElementById("codingDashboardContent");
    dom.error = document.getElementById("codingDashboardError");
    dom.summaryGrid = document.getElementById("codingSummaryGrid");
    dom.platformGrid = document.getElementById("codingPlatformGrid");
    dom.ratingControls = document.getElementById("codingRatingControls");
    dom.ratingChart = document.getElementById("codingRatingChart");
    dom.heatmapMonthSelect = document.getElementById("codingHeatmapMonthSelect");
    dom.heatmap = document.getElementById("codingHeatmap");
    dom.difficultyBars = document.getElementById("codingDifficultyBars");
    dom.skillGrid = document.getElementById("codingSkillGrid");
    dom.activityControls = document.getElementById("codingActivityControls");
    dom.activityChart = document.getElementById("codingActivityChart");
    dom.recentActivity = document.getElementById("codingRecentActivity");
    dom.achievements = document.getElementById("codingAchievements");
    dom.languageChart = document.getElementById("codingLanguageChart");
    dom.languageLegend = document.getElementById("codingLanguageLegend");
    dom.contestSearch = document.getElementById("codingContestSearch");
    dom.contestSort = document.getElementById("codingContestSort");
    dom.contestTableBody = document.getElementById("codingContestTableBody");
    dom.contestPagination = document.getElementById("codingContestPagination");

    dom.refreshButton?.addEventListener("click", () => refreshDashboard(true));
    dom.heatmapMonthSelect?.addEventListener("change", (event) => {
      state.selectedHeatmapMonth = event.target.value;
      renderHeatmap();
    });
    dom.contestSearch?.addEventListener("input", (event) => {
      state.contestSearch = event.target.value.trim().toLowerCase();
      state.contestPage = 1;
      renderContestHistory();
    });
    dom.contestSort?.addEventListener("change", (event) => {
      state.contestSort = event.target.value;
      state.contestPage = 1;
      renderContestHistory();
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        observer.disconnect();
        refreshDashboard(false);
        scheduleAutoRefresh();
      },
      { threshold: 0.18 }
    );

    observer.observe(section);
  }

  async function refreshDashboard(forceRefresh) {
    if (state.currentRequest) {
      return;
    }

    setLoadingState(true, forceRefresh ? "Refreshing live coding statistics..." : "Fetching live coding statistics...");

    const request = loadCodingDashboardData(forceRefresh);
    state.currentRequest = request;

    try {
      const dashboardData = await request;
      state.dashboardData = dashboardData;
      state.hasLoaded = true;
      dom.error.hidden = true;
      dom.content.hidden = false;
      dom.loadingSkeleton.hidden = true;
      hydrateInteractiveState(dashboardData);
      renderDashboard(dashboardData);
      updateStatusMessage(dashboardData);
    } catch (error) {
      dom.loadingSkeleton.hidden = true;
      dom.content.hidden = true;
      dom.error.hidden = false;
      dom.statusMessage.textContent = "Live APIs did not respond in time. Use refresh to retry.";
    } finally {
      state.currentRequest = null;
      setLoadingState(false);
    }
  }

  function hydrateInteractiveState(dashboardData) {
    if (!state.selectedHeatmapMonth) {
      state.selectedHeatmapMonth = dashboardData.heatmap.months[0]?.value || "";
    }
  }

  function scheduleAutoRefresh() {
    if (state.refreshTimer) {
      window.clearInterval(state.refreshTimer);
    }

    state.refreshTimer = window.setInterval(() => {
      if (document.hidden || !state.hasLoaded) {
        return;
      }

      refreshDashboard(false);
    }, config.refreshIntervalMs);
  }

  function setLoadingState(isLoading, loadingMessage) {
    if (dom.refreshButton) {
      dom.refreshButton.classList.toggle("is-refreshing", isLoading);
      dom.refreshButton.textContent = isLoading ? "Refreshing..." : "Refresh Live Data";
    }

    if (loadingMessage) {
      dom.statusMessage.textContent = loadingMessage;
    }

    if (isLoading && !state.hasLoaded) {
      dom.loadingSkeleton.hidden = false;
      dom.content.hidden = true;
      dom.error.hidden = true;
    }
  }

  async function loadCodingDashboardData(forceRefresh) {
    const [leetcode, codeforces, codechef, github] = await Promise.all([
      getCachedResource("leetcode", () => fetchLeetCodeData(config.usernames.leetcode), forceRefresh),
      getCachedResource("codeforces", () => fetchCodeforcesData(config.usernames.codeforces), forceRefresh),
      getCachedResource("codechef", () => fetchCodeChefData(config.usernames.codechef), forceRefresh),
      getCachedResource("github", () => fetchGitHubData(config.usernames.github), forceRefresh),
    ]);

    const dashboardData = normalizeCodingData({ leetcode, codeforces, codechef, github });
    if (!dashboardData.hasAnyLiveData) {
      throw new Error("No live coding data available");
    }

    return dashboardData;
  }

  async function getCachedResource(cacheKey, loader, forceRefresh) {
    const storageKey = `coding-dashboard::${cacheKey}`;

    if (!forceRefresh) {
      const cached = readCache(storageKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const freshData = await loader();
      writeCache(storageKey, freshData);
      return freshData;
    } catch (error) {
      const fallback = readCache(storageKey, true);
      if (fallback) {
        fallback.isStale = true;
        return fallback;
      }

      return {
        platform: cacheKey,
        status: "error",
        error: error.message,
      };
    }
  }

  function readCache(storageKey, allowStale) {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const isFresh = Date.now() - parsed.savedAt < config.cacheTtlMs;
      if (!isFresh && !allowStale) {
        return null;
      }

      return parsed.data;
    } catch (error) {
      return null;
    }
  }

  function writeCache(storageKey, data) {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          savedAt: Date.now(),
          data,
        })
      );
    } catch (error) {
      // Ignore storage quota failures.
    }
  }

  async function fetchLeetCodeData(username) {
    const profileQuery = `
      query codingDashboardProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
          }
          badges {
            id
            displayName
            icon
          }
          languageProblemCount {
            languageName
            problemsSolved
          }
          tagProblemCounts {
            advanced {
              tagName
              problemsSolved
            }
            intermediate {
              tagName
              problemsSolved
            }
            fundamental {
              tagName
              problemsSolved
            }
          }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          trendDirection
          problemsSolved
          totalProblems
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
    `;

    const recentQuery = `
      query recentCodingSubmissions($username: String!) {
        recentAcSubmissionList(username: $username, limit: 20) {
          title
          titleSlug
          timestamp
        }
      }
    `;

    const [profileData, recentData] = await Promise.all([
      postGraphQL("https://leetcode.com/graphql", profileQuery, { username }),
      postGraphQL("https://leetcode.com/graphql", recentQuery, { username }).catch(() => ({ recentAcSubmissionList: [] })),
    ]);

    const matchedUser = profileData.matchedUser || {};
    const calendarMap = parseCalendarMap(matchedUser.userCalendar?.submissionCalendar);

    return {
      platform: "leetcode",
      status: matchedUser.username ? "ok" : "empty",
      username,
      solvedCounts: arrayToObject(matchedUser.submitStatsGlobal?.acSubmissionNum, "difficulty", "count"),
      profile: matchedUser.profile || {},
      badges: (matchedUser.badges || []).map((badge) => badge.displayName).filter(Boolean),
      languages: arrayToObject(matchedUser.languageProblemCount, "languageName", "problemsSolved"),
      tags: flattenTagGroups(matchedUser.tagProblemCounts),
      calendar: calendarMap,
      streak: matchedUser.userCalendar?.streak || computeStreakFromCalendar(calendarMap),
      totalActiveDays: matchedUser.userCalendar?.totalActiveDays || 0,
      contestRanking: profileData.userContestRanking || {},
      contestHistory: (profileData.userContestRankingHistory || []).filter((entry) => entry.attended),
      recentAccepted: (recentData.recentAcSubmissionList || []).map((item) => ({
        type: "Solved",
        platform: "LeetCode",
        title: item.title,
        meta: item.titleSlug,
        timestamp: Number(item.timestamp) * 1000,
        url: `${config.platformUrls.leetcode}${item.titleSlug || ""}`,
      })),
      fetchedAt: Date.now(),
    };
  }

  async function fetchCodeforcesData(handle) {
    const [info, rating, status] = await Promise.all([
      fetchJson(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`),
      fetchJson(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
      fetchJson(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=100`),
    ]);

    const user = info.result?.[0] || {};
    const contests = rating.result || [];
    const submissions = status.result || [];
    const accepted = submissions.filter((item) => item.verdict === "OK");
    const solvedSet = new Set(
      accepted.map((item) => `${item.problem?.contestId || item.problem?.problemsetName || "unknown"}-${item.problem?.index || item.problem?.name}`)
    );

    const calendar = {};
    accepted.forEach((submission) => {
      const dayKey = startOfDay(submission.creationTimeSeconds * 1000);
      calendar[dayKey] = (calendar[dayKey] || 0) + 1;
    });

    return {
      platform: "codeforces",
      status: user.handle ? "ok" : "empty",
      username: handle,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "",
      maxRank: user.maxRank || "",
      contests,
      submissions,
      accepted,
      solvedCount: solvedSet.size,
      languages: countValues(accepted.map((item) => item.programmingLanguage || "Other")),
      calendar,
      streak: computeStreakFromCalendar(calendar),
      fetchedAt: Date.now(),
    };
  }

  async function fetchCodeChefData(username) {
    const endpoints = [
      `https://codechef-api.vercel.app/handle/${encodeURIComponent(username)}`,
      `https://codechef-api.onrender.com/handle/${encodeURIComponent(username)}`,
    ];

    let payload = null;
    for (const endpoint of endpoints) {
      try {
        payload = await fetchJson(endpoint);
        break;
      } catch (error) {
        payload = null;
      }
    }

    if (!payload) {
      throw new Error("CodeChef API unavailable");
    }

    const data = payload.profile || payload.data || payload.result || payload;
    const ratingHistory = payload.ratingData || payload.contestData || data.ratingData || [];

    return {
      platform: "codechef",
      status: data.name || data.username || payload.success ? "ok" : "empty",
      username,
      rating: toNumber(data.currentRating || data.rating || data.stars || 0),
      maxRating: toNumber(data.highestRating || data.maxRating || data.highest_rating || data.rating || 0),
      stars: data.stars || "",
      globalRank: data.globalRank || data.global_rank || "",
      countryRank: data.countryRank || data.country_rank || "",
      solvedCount: toNumber(
        data.problemsSolved ||
          data.fullySolved ||
          data.solvedCount ||
          data.totalProblemsSolved ||
          data.total_solved ||
          0
      ),
      contestCount: toNumber(data.contests || data.contestCount || ratingHistory.length || 0),
      ratingHistory,
      badges: compact([data.stars, data.highestRating ? `Peak ${data.highestRating}` : ""]),
      fetchedAt: Date.now(),
    };
  }

  async function fetchGitHubData(username) {
    const headers = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const [user, events, repos] = await Promise.all([
      fetchJson(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetchJson(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=25`, { headers }),
      fetchJson(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    return {
      platform: "github",
      status: user.login ? "ok" : "empty",
      username,
      followers: user.followers || 0,
      publicRepos: user.public_repos || 0,
      events,
      repos,
      languages: countValues(
        repos
          .map((repo) => repo.language)
          .filter(Boolean)
      ),
      fetchedAt: Date.now(),
    };
  }

  async function postGraphQL(url, query, variables) {
    const response = await fetchJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.errors?.length) {
      throw new Error(response.errors[0].message || "GraphQL request failed");
    }

    return response.data || {};
  }

  async function fetchJson(url, options) {
    const finalOptions = options || {};
    let attempt = 0;

    while (attempt < 3) {
      attempt += 1;
      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 12000);
        const response = await window.fetch(url, {
          ...finalOptions,
          mode: "cors",
          signal: controller.signal,
        });

        window.clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (attempt >= 3) {
          throw error;
        }
      }
    }

    throw new Error("Request failed");
  }

  function normalizeCodingData(sources) {
    const leetcode = sources.leetcode || {};
    const codeforces = sources.codeforces || {};
    const codechef = sources.codechef || {};
    const github = sources.github || {};

    const heatmapCalendar = Object.keys(leetcode.calendar || {}).length
      ? leetcode.calendar
      : codeforces.calendar || {};
    const heatmap = buildHeatmapModel(heatmapCalendar);
    const activitySeries = buildActivitySeries(heatmapCalendar);
    const languageStats = mergeLanguageStats(
      leetcode.languages || {},
      codeforces.languages || {},
      github.languages || {}
    );
    const contestHistory = buildContestHistory(leetcode, codeforces, codechef);
    const recentActivity = buildRecentActivity(leetcode, codeforces, github, contestHistory);
    const achievements = buildAchievements(leetcode, codeforces, codechef);
    const skills = buildSkillBreakdown(leetcode.tags || []);
    const difficulty = buildDifficultyBreakdown(leetcode.solvedCounts || {});
    const ratingDatasets = buildRatingDatasets(leetcode, codeforces, codechef);
    const hasAnyLiveData = [leetcode, codeforces, codechef, github].some((item) => item.status === "ok");

    const summary = {
      totalSolved:
        toNumber(leetcode.solvedCounts?.All || 0) +
        toNumber(codeforces.solvedCount || 0) +
        toNumber(codechef.solvedCount || 0),
      leetcodeSolved: toNumber(leetcode.solvedCounts?.All || 0),
      codeforcesSolved: toNumber(codeforces.solvedCount || 0),
      codechefSolved: toNumber(codechef.solvedCount || 0),
      aggregateRating:
        toNumber(leetcode.contestRanking?.rating || 0) +
        toNumber(codeforces.rating || 0) +
        toNumber(codechef.rating || 0),
      contestCount:
        toNumber(leetcode.contestRanking?.attendedContestsCount || 0) +
        toNumber(codeforces.contests?.length || 0) +
        toNumber(codechef.contestCount || 0),
      maxRating: Math.max(
        toNumber(leetcode.contestRanking?.rating || 0),
        toNumber(codeforces.maxRating || 0),
        toNumber(codechef.maxRating || 0)
      ),
      currentStreak: Math.max(
        toNumber(leetcode.streak || 0),
        toNumber(codeforces.streak || 0),
        0
      ),
    };

    const platforms = [
      {
        id: "leetcode",
        name: "LeetCode",
        icon: "LC",
        handle: config.usernames.leetcode,
        url: config.platformUrls.leetcode,
        currentRating: toNumber(leetcode.contestRanking?.rating || 0),
        highestRating: toNumber(leetcode.contestRanking?.rating || 0),
        solved: toNumber(leetcode.solvedCounts?.All || 0),
        contests: toNumber(leetcode.contestRanking?.attendedContestsCount || 0),
        streak: toNumber(leetcode.streak || 0),
        badges: compact([
          leetcode.contestRanking?.badge?.name,
          ...compact(leetcode.badges || []).slice(0, 3),
        ]),
        progress: buildProgressValue(
          toNumber(leetcode.contestRanking?.rating || 0),
          Math.max(toNumber(leetcode.contestRanking?.rating || 0), 2200)
        ),
        progressLabel: `${difficulty.total || 0} solved across Easy, Medium, Hard`,
        recent: (leetcode.recentAccepted || []).slice(0, 3),
        updatedAt: leetcode.fetchedAt,
        status: leetcode.status,
      },
      {
        id: "codeforces",
        name: "Codeforces",
        icon: "CF",
        handle: config.usernames.codeforces,
        url: config.platformUrls.codeforces,
        currentRating: toNumber(codeforces.rating || 0),
        highestRating: toNumber(codeforces.maxRating || 0),
        solved: toNumber(codeforces.solvedCount || 0),
        contests: toNumber(codeforces.contests?.length || 0),
        streak: toNumber(codeforces.streak || 0),
        badges: compact([codeforces.rank, codeforces.maxRank]),
        progress: buildProgressValue(
          toNumber(codeforces.rating || 0),
          Math.max(toNumber(codeforces.maxRating || 0), 2200)
        ),
        progressLabel: `${Object.keys(codeforces.languages || {}).length} languages seen in accepted submissions`,
        recent: (codeforces.accepted || []).slice(0, 3).map((submission) => ({
          title: submission.problem?.name || "Accepted solution",
          meta: submission.programmingLanguage || "Codeforces",
          timestamp: submission.creationTimeSeconds * 1000,
        })),
        updatedAt: codeforces.fetchedAt,
        status: codeforces.status,
      },
      {
        id: "codechef",
        name: "CodeChef",
        icon: "CC",
        handle: config.usernames.codechef,
        url: config.platformUrls.codechef,
        currentRating: toNumber(codechef.rating || 0),
        highestRating: toNumber(codechef.maxRating || 0),
        solved: toNumber(codechef.solvedCount || 0),
        contests: toNumber(codechef.contestCount || 0),
        streak: 0,
        badges: compact(codechef.badges || []),
        progress: buildProgressValue(
          toNumber(codechef.rating || 0),
          Math.max(toNumber(codechef.maxRating || 0), 2200)
        ),
        progressLabel: codechef.globalRank ? `Global rank ${codechef.globalRank}` : "Rating feed connected when API responds",
        recent: [],
        updatedAt: codechef.fetchedAt,
        status: codechef.status,
      },
    ];

    return {
      hasAnyLiveData,
      summary,
      platforms,
      difficulty,
      heatmap,
      skills,
      achievements,
      recentActivity,
      contestHistory,
      languageStats,
      activitySeries,
      ratingDatasets,
      sources,
      updatedAt: Math.max(
        toNumber(leetcode.fetchedAt || 0),
        toNumber(codeforces.fetchedAt || 0),
        toNumber(codechef.fetchedAt || 0),
        toNumber(github.fetchedAt || 0)
      ),
    };
  }

  function renderDashboard(dashboardData) {
    renderSummaryCards(dashboardData.summary);
    renderPlatformCards(dashboardData.platforms);
    renderRatingControls(dashboardData.ratingDatasets);
    renderRatingChart();
    renderDifficultyBars(dashboardData.difficulty);
    renderHeatmapMonthSelect(dashboardData.heatmap.months);
    renderHeatmap();
    renderSkillBreakdown(dashboardData.skills);
    renderActivityControls();
    renderActivityChart();
    renderRecentActivity(dashboardData.recentActivity);
    renderAchievements(dashboardData.achievements);
    renderLanguageStats(dashboardData.languageStats);
    renderContestHistory();
    dom.lastUpdated.textContent = formatTimestamp(dashboardData.updatedAt);
  }

  function updateStatusMessage(dashboardData) {
    const livePlatforms = dashboardData.platforms
      .filter((platform) => platform.status === "ok")
      .map((platform) => platform.name)
      .join(", ");

    dom.statusMessage.textContent = livePlatforms
      ? `Integrated live coding statistics from ${livePlatforms}. Dashboard refresh runs automatically in the background.`
      : "Some providers are unavailable right now. Cached analytics are being shown where possible.";
  }

  function renderSummaryCards(summary) {
    dom.summaryGrid.innerHTML = config.summaryCards
      .map((card) => {
        const value = summary[card.key] || 0;
        const trend = buildSummaryTrend(card.key, state.dashboardData);
        return `
          <article class="coding-summary-card glass-reflect">
            <div class="coding-summary-top">
              <span class="coding-summary-icon" aria-hidden="true">${card.icon}</span>
              <span class="coding-trend ${trend.value < 0 ? "is-negative" : ""}">
                ${trend.label}
              </span>
            </div>
            <div
              class="coding-summary-value"
              data-dashboard-counter="true"
              data-counter-target="${Number(value) || 0}"
              data-counter-suffix="${card.suffix || ""}"
            >
              0${card.suffix || ""}
            </div>
            <div class="coding-summary-label">${card.label}</div>
            <p class="coding-summary-meta">${trend.meta}</p>
          </article>
        `;
      })
      .join("");

    animateDashboardCounters(dom.summaryGrid.querySelectorAll("[data-dashboard-counter]"));
  }

  function renderPlatformCards(platforms) {
    dom.platformGrid.innerHTML = platforms
      .map((platform) => {
        if (platform.status !== "ok") {
          return `
            <article class="coding-platform-card glass-reflect">
              <div class="coding-platform-head">
                <div class="coding-platform-title">
                  <span class="coding-platform-logo">${platform.icon}</span>
                  <div>
                    <h3>${platform.name}</h3>
                    <p>@${platform.handle}</p>
                  </div>
                </div>
                <span class="coding-platform-badge">API Unavailable</span>
              </div>
              <p class="coding-empty-note">
                Live ${platform.name} data is currently unavailable. The dashboard will retry automatically on the next refresh cycle.
              </p>
              <div class="coding-toolbar-actions">
                <a class="interactive-button secondary-button" href="${platform.url}" target="_blank" rel="noreferrer">
                  Open Profile ↗
                </a>
              </div>
            </article>
          `;
        }

        return `
          <article class="coding-platform-card glass-reflect">
            <div class="coding-platform-head">
              <div class="coding-platform-title">
                <span class="coding-platform-logo">${platform.icon}</span>
                <div>
                  <h3>${platform.name}</h3>
                  <p>@${platform.handle}</p>
                </div>
              </div>
              <span class="coding-platform-badge">${formatRating(platform.currentRating)}</span>
            </div>

            <div class="coding-platform-score">${formatRating(platform.currentRating)}</div>
            <p>Current rating, highest rating ${formatRating(platform.highestRating)}</p>

            <div class="coding-platform-meta">
              ${renderPlatformStat("Problems Solved", formatNumber(platform.solved))}
              ${renderPlatformStat("Contest Count", formatNumber(platform.contests))}
              ${renderPlatformStat("Current Streak", `${formatNumber(platform.streak)} days`)}
              ${renderPlatformStat("Badges", formatNumber(platform.badges.length))}
            </div>

            <div class="coding-progress-shell">
              <div class="coding-progress-track">
                <div class="coding-progress-bar" style="width: ${platform.progress}%"></div>
              </div>
              <div class="coding-progress-meta">
                <span class="coding-progress-label">Growth Progress</span>
                <span>${platform.progressLabel}</span>
              </div>
            </div>

            <div class="coding-badge-list">
              ${(platform.badges || []).slice(0, 4).map((badge) => `<span class="coding-badge-chip">${badge}</span>`).join("")}
            </div>

            <div class="coding-activity-list">
              ${(platform.recent || [])
                .slice(0, 2)
                .map(
                  (item) => `
                    <div class="coding-achievement-item">
                      <span class="coding-achievement-icon">•</span>
                      <div>
                        <strong>${item.title || "Recent activity"}</strong>
                        <p class="coding-activity-meta">
                          ${item.meta || platform.name} · ${formatTimestamp(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>

            <div class="coding-toolbar-actions">
              <div class="coding-last-updated">
                <span>Last Updated</span>
                <strong>${formatTimestamp(platform.updatedAt)}</strong>
              </div>
              <a class="interactive-button secondary-button" href="${platform.url}" target="_blank" rel="noreferrer">
                Open Profile ↗
              </a>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderPlatformStat(label, value) {
    return `
      <div class="coding-platform-stat">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `;
  }

  function renderRatingControls(ratingDatasets) {
    const options = [
      { id: "leetcode", label: "LeetCode" },
      { id: "codeforces", label: "Codeforces" },
      { id: "codechef", label: "CodeChef" },
      { id: "combined", label: "Combined" },
    ];

    dom.ratingControls.innerHTML = options
      .map(
        (option) => `
          <button
            class="coding-chip-button ${state.selectedRatingView === option.id ? "is-active" : ""}"
            type="button"
            data-rating-view="${option.id}"
            ${ratingDatasets[option.id]?.length ? "" : "disabled"}
          >
            ${option.label}
          </button>
        `
      )
      .join("");

    dom.ratingControls.querySelectorAll("[data-rating-view]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedRatingView = button.dataset.ratingView;
        renderRatingControls(ratingDatasets);
        renderRatingChart();
      });
    });
  }

  function renderRatingChart() {
    const ratingDatasets = state.dashboardData.ratingDatasets;
    const selectedView = state.selectedRatingView;

    if (selectedView === "combined") {
      renderMultiSeriesLineChart(dom.ratingChart, {
        leetcode: ratingDatasets.leetcode,
        codeforces: ratingDatasets.codeforces,
        codechef: ratingDatasets.codechef,
      });
      return;
    }

    renderSingleSeriesLineChart(
      dom.ratingChart,
      ratingDatasets[selectedView] || [],
      getPlatformColor(selectedView)
    );
  }

  function renderDifficultyBars(difficulty) {
    const segments = [
      { label: "Easy", value: difficulty.easy, color: "#6ee7b7" },
      { label: "Medium", value: difficulty.medium, color: "#7dd3fc" },
      { label: "Hard", value: difficulty.hard, color: "#fca5a5" },
    ];

    dom.difficultyBars.innerHTML = segments
      .map((segment) => {
        const percent = difficulty.total ? Math.round((segment.value / difficulty.total) * 100) : 0;
        return `
          <div class="coding-platform-stat">
            <span>${segment.label}</span>
            <strong>${formatNumber(segment.value)} <small>(${percent}%)</small></strong>
            <div class="coding-progress-shell">
              <div class="coding-progress-track">
                <div class="coding-progress-bar" style="width: ${percent}%; background: linear-gradient(90deg, ${segment.color}, rgba(255,255,255,0.9));"></div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderHeatmapMonthSelect(months) {
    dom.heatmapMonthSelect.innerHTML = months
      .map(
        (month) => `
          <option value="${month.value}" ${month.value === state.selectedHeatmapMonth ? "selected" : ""}>
            ${month.label}
          </option>
        `
      )
      .join("");
  }

  function renderHeatmap() {
    const model = state.dashboardData.heatmap.monthMap[state.selectedHeatmapMonth];
    if (!model) {
      dom.heatmap.innerHTML = `<p class="coding-empty-note">Daily solve heatmap becomes available once public activity data is returned by the APIs.</p>`;
      return;
    }

    const maxCount = Math.max(...model.days.map((day) => day.count), 1);
    const cells = model.days
      .map((day) => {
        const intensity = day.count ? Math.max(0.18, day.count / maxCount) : 0.05;
        const background = `rgba(125, 223, 252, ${intensity.toFixed(2)})`;
        return `
          <div
            class="coding-heatmap-cell"
            style="background:${background}"
            title="${day.label}: ${day.count} solved"
          ></div>
        `;
      })
      .join("");

    dom.heatmap.innerHTML = `
      <div class="coding-heatmap-grid">${cells}</div>
      <div class="coding-heatmap-legend">
        <span>Low</span>
        <span class="coding-heatmap-swatch" style="background:rgba(125, 223, 252, 0.1)"></span>
        <span class="coding-heatmap-swatch" style="background:rgba(125, 223, 252, 0.32)"></span>
        <span class="coding-heatmap-swatch" style="background:rgba(125, 223, 252, 0.58)"></span>
        <span class="coding-heatmap-swatch" style="background:rgba(125, 223, 252, 0.9)"></span>
        <span>High</span>
      </div>
    `;
  }

  function renderSkillBreakdown(skills) {
    dom.skillGrid.innerHTML = skills
      .map((skill) => {
        const circumference = 2 * Math.PI * 40;
        const offset = circumference * (1 - skill.ratio);
        return `
          <article class="coding-skill-card">
            <svg class="coding-skill-ring" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"></circle>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#ring-${slugify(skill.label)})"
                stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 50 50)"
              ></circle>
              <defs>
                <linearGradient id="ring-${slugify(skill.label)}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#7c9cff"></stop>
                  <stop offset="100%" stop-color="#67d1ff"></stop>
                </linearGradient>
              </defs>
              <text x="50" y="55" text-anchor="middle" fill="white" font-size="18" font-weight="700">${skill.value}</text>
            </svg>
            <p class="coding-skill-label">${skill.label}</p>
            <p class="coding-skill-value">${skill.percent}% of tracked topic peak</p>
          </article>
        `;
      })
      .join("");
  }

  function renderActivityControls() {
    const ranges = [
      { id: "7d", label: "7D" },
      { id: "30d", label: "30D" },
      { id: "12m", label: "12M" },
    ];

    dom.activityControls.innerHTML = ranges
      .map(
        (range) => `
          <button class="coding-chip-button ${range.id === state.selectedActivityRange ? "is-active" : ""}" type="button" data-activity-range="${range.id}">
            ${range.label}
          </button>
        `
      )
      .join("");

    dom.activityControls.querySelectorAll("[data-activity-range]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedActivityRange = button.dataset.activityRange;
        renderActivityControls();
        renderActivityChart();
      });
    });
  }

  function renderActivityChart() {
    const series = state.dashboardData.activitySeries[state.selectedActivityRange] || [];
    renderBarChart(dom.activityChart, series);
  }

  function renderRecentActivity(items) {
    dom.recentActivity.innerHTML = items
      .slice(0, 8)
      .map(
        (item) => `
          <article class="coding-activity-item">
            <span class="coding-activity-icon" aria-hidden="true">${item.icon}</span>
            <div class="coding-activity-copy">
              <strong>${item.title}</strong>
              <p class="coding-activity-meta">${item.platform} · ${item.meta}</p>
            </div>
            <span class="coding-activity-meta">${formatTimestamp(item.timestamp)}</span>
          </article>
        `
      )
      .join("");
  }

  function renderAchievements(items) {
    dom.achievements.innerHTML = items
      .map(
        (item) => `
          <article class="coding-achievement-item">
            <span class="coding-achievement-icon" aria-hidden="true">${item.icon}</span>
            <div>
              <strong>${item.title}</strong>
              <p class="coding-activity-meta">${item.meta}</p>
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderLanguageStats(languageStats) {
    renderDonutChart(dom.languageChart, languageStats);
    dom.languageLegend.innerHTML = languageStats
      .map(
        (item) => `
          <div class="coding-legend-item">
            <div class="coding-platform-title">
              <span class="coding-legend-dot" style="background:${item.color}"></span>
              <span>${item.label}</span>
            </div>
            <strong>${item.percent}%</strong>
          </div>
        `
      )
      .join("");
  }

  function renderContestHistory() {
    const filtered = state.dashboardData.contestHistory
      .filter((entry) => {
        if (!state.contestSearch) {
          return true;
        }

        const haystack = `${entry.name} ${entry.platform}`.toLowerCase();
        return haystack.includes(state.contestSearch);
      })
      .sort((left, right) => sortContestEntries(left, right, state.contestSort));

    const startIndex = (state.contestPage - 1) * config.contestPageSize;
    const pageItems = filtered.slice(startIndex, startIndex + config.contestPageSize);

    dom.contestTableBody.innerHTML = pageItems.length
      ? pageItems
          .map(
            (item) => `
              <tr>
                <td>${item.name}</td>
                <td><span class="coding-table-platform">${item.platform}</span></td>
                <td>${item.rank ? formatNumber(item.rank) : "—"}</td>
                <td class="coding-rating-change ${item.ratingChange >= 0 ? "is-positive" : "is-negative"}">
                  ${item.ratingChange >= 0 ? "+" : ""}${formatNumber(item.ratingChange)}
                </td>
                <td>${formatDate(item.timestamp)}</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td class="coding-table-empty" colspan="5">No contest entries match the current filters.</td></tr>`;

    renderPagination(filtered.length);
  }

  function renderPagination(totalItems) {
    const pageCount = Math.max(1, Math.ceil(totalItems / config.contestPageSize));
    if (state.contestPage > pageCount) {
      state.contestPage = pageCount;
    }

    dom.contestPagination.innerHTML = Array.from({ length: pageCount }, (_, index) => index + 1)
      .map(
        (page) => `
          <button class="coding-pagination-button ${page === state.contestPage ? "is-active" : ""}" type="button" data-page="${page}">
            ${page}
          </button>
        `
      )
      .join("");

    dom.contestPagination.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        state.contestPage = Number(button.dataset.page);
        renderContestHistory();
      });
    });
  }

  function animateDashboardCounters(nodes) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodes.forEach((node) => {
      const target = Number(node.dataset.counterTarget || 0);
      const suffix = node.dataset.counterSuffix || "";
      if (reduceMotion) {
        node.textContent = `${formatNumber(target)}${suffix}`;
        return;
      }

      const duration = 1600;
      const startedAt = performance.now();

      function step(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${formatNumber(Math.round(target * eased))}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  function renderSingleSeriesLineChart(svg, dataset, color) {
    if (!dataset.length) {
      renderEmptySvg(svg, "No rating history available yet.");
      return;
    }

    const path = buildPolylinePath(dataset.map((item) => item.value), 820, 320, 48);
    svg.innerHTML = `
      ${buildSvgGrid(820, 320)}
      <path d="${path.area}" fill="${hexToRgba(color, 0.15)}"></path>
      <path d="${path.line}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
      ${path.points
        .map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="${color}"></circle>`)
        .join("")}
    `;
  }

  function renderMultiSeriesLineChart(svg, datasets) {
    const series = Object.entries(datasets).filter(([, values]) => values.length);
    if (!series.length) {
      renderEmptySvg(svg, "Combined rating graph becomes available once contest history syncs.");
      return;
    }

    const allValues = series.flatMap(([, values]) => values.map((item) => item.value));
    const minValue = Math.min(...allValues, 0);
    const maxValue = Math.max(...allValues, 100);
    const base = buildSvgGrid(820, 320);

    svg.innerHTML =
      base +
      series
        .map(([key, values]) => {
          const path = buildPolylinePath(
            values.map((item) => item.value),
            820,
            320,
            48,
            minValue,
            maxValue
          );
          const color = getPlatformColor(key);
          return `
            <path d="${path.line}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
            ${path.points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3.5" fill="${color}"></circle>`).join("")}
          `;
        })
        .join("");
  }

  function renderBarChart(svg, series) {
    if (!series.length) {
      renderEmptySvg(svg, "Activity data is waiting for more submission history.");
      return;
    }

    const width = 820;
    const height = 280;
    const padding = 40;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...series.map((item) => item.value), 1);
    const barWidth = (width - padding * 2) / series.length - 10;

    const bars = series
      .map((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = padding + index * (barWidth + 10);
        const y = height - padding - barHeight;
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="10" fill="url(#activity-gradient)"></rect>
          <text x="${x + barWidth / 2}" y="${height - 12}" fill="rgba(220,230,245,0.64)" font-size="11" text-anchor="middle">${item.label}</text>
        `;
      })
      .join("");

    svg.innerHTML = `
      <defs>
        <linearGradient id="activity-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#7c9cff"></stop>
          <stop offset="100%" stop-color="#67d1ff"></stop>
        </linearGradient>
      </defs>
      ${buildSvgGrid(width, height)}
      ${bars}
    `;
  }

  function renderDonutChart(svg, segments) {
    if (!segments.length) {
      renderEmptySvg(svg, "Language distribution updates when coding APIs return language usage.");
      return;
    }

    const radius = 76;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    svg.innerHTML = `
      <circle cx="130" cy="130" r="${radius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="24"></circle>
      ${segments
        .map((segment) => {
          const segmentLength = circumference * (segment.percent / 100);
          const node = `
            <circle
              cx="130"
              cy="130"
              r="${radius}"
              fill="none"
              stroke="${segment.color}"
              stroke-width="24"
              stroke-linecap="round"
              stroke-dasharray="${segmentLength} ${circumference - segmentLength}"
              stroke-dashoffset="${-offset}"
              transform="rotate(-90 130 130)"
            ></circle>
          `;
          offset += segmentLength;
          return node;
        })
        .join("")}
      <text x="130" y="124" text-anchor="middle" fill="rgba(220,230,245,0.7)" font-size="14">Languages</text>
      <text x="130" y="150" text-anchor="middle" fill="white" font-size="34" font-weight="700">${segments.length}</text>
    `;
  }

  function renderEmptySvg(svg, label) {
    svg.innerHTML = `
      <rect x="0" y="0" width="100%" height="100%" fill="transparent"></rect>
      <text x="50%" y="50%" text-anchor="middle" fill="rgba(220,230,245,0.68)" font-size="18">${label}</text>
    `;
  }

  function buildSvgGrid(width, height) {
    const rows = [56, 120, 184, 248];
    return rows
      .map(
        (row) => `<line x1="40" y1="${row}" x2="${width - 24}" y2="${row}" stroke="rgba(171,196,255,0.08)" stroke-width="1"></line>`
      )
      .join("");
  }

  function buildPolylinePath(values, width, height, padding, minValue, maxValue) {
    const finalMin = typeof minValue === "number" ? minValue : Math.min(...values);
    const finalMax = typeof maxValue === "number" ? maxValue : Math.max(...values);
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const range = Math.max(finalMax - finalMin, 1);

    const points = values.map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * chartWidth;
      const y = height - padding - ((value - finalMin) / range) * chartHeight;
      return { x, y };
    });

    const line = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
    const area = `${line} L ${points[points.length - 1].x.toFixed(2)} ${(height - padding).toFixed(2)} L ${points[0].x.toFixed(2)} ${(height - padding).toFixed(2)} Z`;

    return { line, area, points };
  }

  function buildDifficultyBreakdown(solvedCounts) {
    const easy = toNumber(solvedCounts.Easy || 0);
    const medium = toNumber(solvedCounts.Medium || 0);
    const hard = toNumber(solvedCounts.Hard || 0);
    return {
      easy,
      medium,
      hard,
      total: toNumber(solvedCounts.All || easy + medium + hard),
    };
  }

  function buildHeatmapModel(calendar) {
    const entries = Object.entries(calendar || {})
      .map(([day, count]) => ({
        day: Number(day),
        count: Number(count),
      }))
      .sort((left, right) => right.day - left.day);

    if (!entries.length) {
      return { months: [], monthMap: {} };
    }

    const monthMap = {};
    entries.forEach((entry) => {
      const date = new Date(entry.day);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = [];
      }
      monthMap[monthKey].push(entry);
    });

    const months = Object.keys(monthMap)
      .sort((left, right) => (left > right ? -1 : 1))
      .map((value) => ({
        value,
        label: formatMonthLabel(value),
      }));

    return {
      months,
      monthMap: Object.fromEntries(
        months.map((month) => [month.value, buildMonthHeatmap(month.value, monthMap[month.value])])
      ),
    };
  }

  function buildMonthHeatmap(monthKey, entries) {
    const [year, month] = monthKey.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();
    const countMap = Object.fromEntries(entries.map((entry) => [startOfDay(entry.day), entry.count]));
    const days = [];

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month - 1, day);
      const timestamp = startOfDay(date.getTime());
      days.push({
        count: countMap[timestamp] || 0,
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });
    }

    return { days };
  }

  function buildActivitySeries(calendar) {
    const entries = Object.entries(calendar || {}).map(([day, count]) => ({
      day: Number(day),
      count: Number(count),
    }));

    return {
      "7d": buildRangeSeries(entries, 7, "day"),
      "30d": buildRangeSeries(entries, 30, "day"),
      "12m": buildRangeSeries(entries, 12, "month"),
    };
  }

  function buildRangeSeries(entries, count, unit) {
    const map = new Map(entries.map((entry) => [entry.day, entry.count]));
    const series = [];
    const today = new Date();

    if (unit === "month") {
      for (let index = count - 1; index >= 0; index -= 1) {
        const date = new Date(today.getFullYear(), today.getMonth() - index, 1);
        const monthLabel = date.toLocaleDateString("en-IN", { month: "short" });
        const monthCount = entries
          .filter((entry) => {
            const entryDate = new Date(entry.day);
            return entryDate.getMonth() === date.getMonth() && entryDate.getFullYear() === date.getFullYear();
          })
          .reduce((total, entry) => total + entry.count, 0);

        series.push({ label: monthLabel, value: monthCount });
      }

      return series;
    }

    for (let index = count - 1; index >= 0; index -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - index);
      const timestamp = startOfDay(date.getTime());
      series.push({
        label:
          count <= 7
            ? date.toLocaleDateString("en-IN", { weekday: "short" })
            : date.toLocaleDateString("en-IN", { day: "numeric" }),
        value: map.get(timestamp) || 0,
      });
    }

    return series;
  }

  function buildRecentActivity(leetcode, codeforces, github, contestHistory) {
    const items = [
      ...(leetcode.recentAccepted || []).map((item) => ({
        icon: "🟨",
        platform: "LeetCode",
        title: item.title,
        meta: "Accepted submission",
        timestamp: item.timestamp,
      })),
      ...(codeforces.accepted || []).slice(0, 6).map((item) => ({
        icon: "🟦",
        platform: "Codeforces",
        title: item.problem?.name || "Accepted submission",
        meta: item.programmingLanguage || "Submission accepted",
        timestamp: item.creationTimeSeconds * 1000,
      })),
      ...(contestHistory || []).slice(0, 6).map((item) => ({
        icon: item.ratingChange >= 0 ? "📈" : "📉",
        platform: item.platform,
        title: item.name,
        meta: `${item.ratingChange >= 0 ? "+" : ""}${item.ratingChange} rating`,
        timestamp: item.timestamp,
      })),
      ...(github.events || []).slice(0, 4).map((event) => ({
        icon: "🐙",
        platform: "GitHub",
        title: event.type.replace("Event", ""),
        meta: event.repo?.name || "Public activity",
        timestamp: Date.parse(event.created_at),
      })),
    ];

    return items.sort((left, right) => right.timestamp - left.timestamp);
  }

  function buildContestHistory(leetcode, codeforces, codechef) {
    const leetcodeContests = (leetcode.contestHistory || []).map((entry) => ({
      name: entry.contest?.title || "LeetCode Contest",
      platform: "LeetCode",
      rank: toNumber(entry.ranking || 0),
      ratingChange: toNumber(entry.rating || 0),
      timestamp: toNumber(entry.contest?.startTime || 0) * 1000,
    }));

    const codeforcesContests = (codeforces.contests || []).map((entry) => ({
      name: entry.contestName,
      platform: "Codeforces",
      rank: toNumber(entry.rank || 0),
      ratingChange: toNumber((entry.newRating || 0) - (entry.oldRating || 0)),
      timestamp: toNumber(entry.ratingUpdateTimeSeconds || 0) * 1000,
    }));

    const codechefContests = (codechef.ratingHistory || []).map((entry) => ({
      name: entry.name || entry.contestName || "CodeChef Contest",
      platform: "CodeChef",
      rank: toNumber(entry.rank || 0),
      ratingChange: toNumber(entry.ratingChange || entry.change || 0),
      timestamp: entry.endDate ? Date.parse(entry.endDate) : Date.now(),
    }));

    return [...leetcodeContests, ...codeforcesContests, ...codechefContests]
      .filter((entry) => entry.timestamp)
      .sort((left, right) => right.timestamp - left.timestamp);
  }

  function buildSkillBreakdown(tags) {
    const tagMap = new Map(tags.map((tag) => [tag.label.toLowerCase(), tag.value]));
    const values = config.trackedTopics.map((label) => toNumber(tagMap.get(label.toLowerCase()) || 0));
    const maxValue = Math.max(...values, 1);

    return config.trackedTopics.map((label) => {
      const value = toNumber(tagMap.get(label.toLowerCase()) || 0);
      const ratio = value / maxValue;
      return {
        label,
        value,
        ratio,
        percent: Math.round(ratio * 100),
      };
    });
  }

  function buildAchievements(leetcode, codeforces, codechef) {
    return compact([
      ...(leetcode.badges || []).slice(0, 3).map((badge) => ({
        icon: "🟨",
        title: badge,
        meta: "LeetCode badge unlocked",
      })),
      codeforces.maxRank
        ? {
            icon: "🟦",
            title: codeforces.maxRank,
            meta: `Peak rating ${formatRating(codeforces.maxRating)}`,
          }
        : null,
      codechef.stars
        ? {
            icon: "🟧",
            title: `${codechef.stars} Star`,
            meta: `CodeChef peak ${formatRating(codechef.maxRating)}`,
          }
        : null,
      leetcode.contestRanking?.topPercentage
        ? {
            icon: "🏅",
            title: `Top ${Number(leetcode.contestRanking.topPercentage).toFixed(1)}%`,
            meta: "LeetCode contest placement",
          }
        : null,
    ]);
  }

  function buildRatingDatasets(leetcode, codeforces, codechef) {
    return {
      leetcode: (leetcode.contestHistory || [])
        .filter((entry) => entry.rating)
        .map((entry) => ({
          label: entry.contest?.title || "Contest",
          value: Number(entry.rating),
          timestamp: Number(entry.contest?.startTime || 0) * 1000,
        })),
      codeforces: (codeforces.contests || []).map((entry) => ({
        label: entry.contestName,
        value: Number(entry.newRating || 0),
        timestamp: Number(entry.ratingUpdateTimeSeconds || 0) * 1000,
      })),
      codechef: (codechef.ratingHistory || [])
        .map((entry, index) => ({
          label: entry.name || entry.contestName || `Contest ${index + 1}`,
          value: Number(entry.rating || entry.newRating || entry.ratingChange || 0),
          timestamp: entry.endDate ? Date.parse(entry.endDate) : Date.now() - index * 86400000,
        }))
        .filter((entry) => entry.value),
    };
  }

  function buildSummaryTrend(key, dashboardData) {
    const { sources } = dashboardData;
    switch (key) {
      case "leetcodeSolved":
        return {
          value: sources.leetcode.recentAccepted?.length || 0,
          label: `${sources.leetcode.recentAccepted?.length || 0} recent solves`,
          meta: "Accepted submissions from the latest LeetCode activity feed.",
        };
      case "codeforcesSolved":
        return {
          value: sources.codeforces.accepted?.length || 0,
          label: `${sources.codeforces.accepted?.length || 0} accepted`,
          meta: "Accepted Codeforces submissions from the latest public status history.",
        };
      case "maxRating":
        return {
          value: 1,
          label: "Peak synced",
          meta: "Highest public contest rating across connected platforms.",
        };
      case "currentStreak":
        return {
          value: sources.leetcode.streak || 0,
          label: `${sources.leetcode.streak || 0} day run`,
          meta: "Best current streak from the public coding calendar.",
        };
      default:
        return {
          value: 1,
          label: "Live update",
          meta: "This card refreshes automatically whenever fresh platform data is returned.",
        };
    }
  }

  function mergeLanguageStats() {
    const palettes = ["#7c9cff", "#67d1ff", "#7af0b2", "#ffc37a", "#f9a8d4", "#a78bfa"];
    const totals = {};

    Array.from(arguments).forEach((source) => {
      Object.entries(source || {}).forEach(([language, value]) => {
        totals[language] = (totals[language] || 0) + toNumber(value || 0);
      });
    });

    const entries = Object.entries(totals)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);
    const sum = entries.reduce((total, [, value]) => total + value, 0);

    return entries.map(([label, value], index) => ({
      label,
      value,
      percent: sum ? Math.round((value / sum) * 100) : 0,
      color: palettes[index % palettes.length],
    }));
  }

  function buildProgressValue(current, max) {
    if (!max) {
      return 0;
    }

    return Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  }

  function computeStreakFromCalendar(calendar) {
    const dayKeys = Object.entries(calendar || {})
      .filter(([, count]) => count > 0)
      .map(([day]) => Number(day))
      .sort((left, right) => right - left);

    if (!dayKeys.length) {
      return 0;
    }

    let streak = 0;
    let expected = startOfDay(Date.now());
    for (const day of dayKeys) {
      if (day === expected) {
        streak += 1;
        expected -= 86400000;
      } else if (day < expected) {
        break;
      }
    }

    return streak;
  }

  function parseCalendarMap(rawCalendar) {
    try {
      const parsed = JSON.parse(rawCalendar || "{}");
      return Object.fromEntries(
        Object.entries(parsed).map(([timestamp, count]) => [startOfDay(Number(timestamp) * 1000), Number(count)])
      );
    } catch (error) {
      return {};
    }
  }

  function flattenTagGroups(tagGroups) {
    const topics = ["fundamental", "intermediate", "advanced"].flatMap(
      (group) =>
        (tagGroups?.[group] || []).map((item) => ({
          label: item.tagName,
          value: item.problemsSolved,
        }))
    );

    const merged = new Map();
    topics.forEach((topic) => {
      const key = topic.label.toLowerCase();
      merged.set(key, (merged.get(key) || 0) + toNumber(topic.value));
    });

    return Array.from(merged.entries()).map(([label, value]) => ({
      label,
      value,
    }));
  }

  function arrayToObject(items, keyField, valueField) {
    return Object.fromEntries((items || []).map((item) => [item[keyField], toNumber(item[valueField])]));
  }

  function countValues(values) {
    return values.reduce((accumulator, value) => {
      accumulator[value] = (accumulator[value] || 0) + 1;
      return accumulator;
    }, {});
  }

  function compact(items) {
    return items.filter(Boolean);
  }

  function toNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(toNumber(value));
  }

  function formatRating(value) {
    return value ? formatNumber(value) : "—";
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return "Not synced";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(timestamp));
  }

  function formatDate(timestamp) {
    if (!timestamp) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(timestamp));
  }

  function startOfDay(timestamp) {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function getPlatformColor(platform) {
    switch (platform) {
      case "leetcode":
        return "#ffd166";
      case "codeforces":
        return "#67d1ff";
      case "codechef":
        return "#ffad7a";
      default:
        return "#7c9cff";
    }
  }

  function sortContestEntries(left, right, mode) {
    switch (mode) {
      case "date-asc":
        return left.timestamp - right.timestamp;
      case "rating-desc":
        return right.ratingChange - left.ratingChange;
      case "rating-asc":
        return left.ratingChange - right.ratingChange;
      default:
        return right.timestamp - left.timestamp;
    }
  }

  function formatMonthLabel(value) {
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const bigint = Number.parseInt(value, 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  window.initCodingDashboard = initCodingDashboard;
})();
