(() => {
  "use strict";

  const SETTINGS_KEY = "tKongSettings";

  const DEFAULT_SETTINGS = {
    autoConsent: true,
    autoOpenAfterConsent: true,
    autoClickResult: true,
    stripTitlePrefixes: true,
    preferHeadline: true,
    showFloatingButton: true,
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

  globalThis.TKongSettings = {
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
    TITLE_PREFIXES,
    normalizeTitle,
    getSettings,
    saveSettings,
  };
})();
