(() => {
  "use strict";

  const SETTINGS_KEY = "tKongSettings";
  const ARTICLE_KEY = "tKongPendingArticle";
  const PHASE_KEY = "tKongPhase";
  const PENDING_ARTICLE_TTL_MS = 24 * 60 * 60 * 1000;

  const DEFAULT_SETTINGS = {
    autoConsent: false,
    autoOpenAfterConsent: true,
    autoClickResult: true,
    stripTitlePrefixes: true,
    preferHeadline: true,
    showFloatingButton: true,
    openBrokerAppAfterSave: true,
  };

  const TITLE_PREFIXES =
    /^(決算|人事|速報|詳報|訂正|お詫び|社説|コラム|写真|動画|ニュース)[:：]\s*/u;

  function normalizeTitle(raw, settings = DEFAULT_SETTINGS) {
    let title = String(raw || "")
      .replace(/\s*[-－—–｜|/:：]\s*(日本経済新聞|日経新聞|Nikkei).*$/iu, "")
      .replace(/\s*(日本経済新聞|日経新聞)\s*$/u, "");

    if (settings.stripTitlePrefixes !== false) {
      title = title.replace(TITLE_PREFIXES, "");
    }

    return title.replace(/\s+/gu, " ").trim();
  }

  async function getSettings() {
    const data = await browser.storage.local.get(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...(data[SETTINGS_KEY] || {}) };
  }

  async function saveSettings(partial) {
    const current = await getSettings();
    const next = { ...current, ...partial };
    await browser.storage.local.set({ [SETTINGS_KEY]: next });
    return next;
  }

  function isPendingFresh(article) {
    if (!article?.title) return false;
    const captured = Date.parse(article.capturedAt || "");
    if (Number.isNaN(captured)) return false;
    return Date.now() - captured <= PENDING_ARTICLE_TTL_MS;
  }

  async function getFreshPendingArticle() {
    const data = await browser.storage.local.get([ARTICLE_KEY, PHASE_KEY]);
    const article = data[ARTICLE_KEY];
    if (!article?.title) return null;
    if (isPendingFresh(article)) return article;

    console.info("[T-Kong] pending expired, cleared");
    await browser.storage.local.remove([ARTICLE_KEY, PHASE_KEY]);
    return null;
  }

  globalThis.TKongSettings = {
    SETTINGS_KEY,
    ARTICLE_KEY,
    PHASE_KEY,
    PENDING_ARTICLE_TTL_MS,
    DEFAULT_SETTINGS,
    TITLE_PREFIXES,
    normalizeTitle,
    getSettings,
    saveSettings,
    isPendingFresh,
    getFreshPendingArticle,
  };
})();
