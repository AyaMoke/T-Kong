(() => {
  "use strict";

  const BUTTON_ID = "t-kong-button";
  const TOAST_ID = "t-kong-toast";
  const ARTICLE_KEY = "tKongPendingArticle";
  const { getSettings, normalizeTitle } = TKongSettings;

  function getHeadlineText(settings) {
    const candidates = [
      document.querySelector("h1")?.textContent,
      document.querySelector('[data-testid="article-title"]')?.textContent,
      document.querySelector("article h1")?.textContent,
      document.querySelector(".article-title, .title-article")?.textContent,
    ];
    for (const text of candidates) {
      const cleaned = normalizeTitle(text, settings);
      if (cleaned && cleaned.length >= 4) return cleaned;
    }
    return "";
  }

  async function getArticleInfo() {
    const match = location.pathname.match(/^\/article\/([^/?#]+)\/?/);
    if (!match) return null;
    const settings = await getSettings();
    const articleId = match[1];
    const ogTitle = document.querySelector('meta[property="og:title"]')?.content?.trim();
    const headline = settings.preferHeadline !== false ? getHeadlineText(settings) : "";
    const title =
      headline ||
      normalizeTitle(ogTitle, settings) ||
      normalizeTitle(document.title, settings);
    return { articleId, title, url: location.href, capturedAt: new Date().toISOString() };
  }

  function showToast(message) {
    document.getElementById(TOAST_ID)?.remove();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = message;
    document.documentElement.appendChild(toast);
    setTimeout(() => toast.remove(), 3600);
  }

  async function saveArticle() {
    const article = await getArticleInfo();
    if (!article) return showToast("記事IDを取得できませんでした");
    if (!article.title) return showToast("タイトルを取得できませんでした");
    await browser.storage.local.set({ [ARTICLE_KEY]: article });
    showToast(`保存しました: ${article.title}`);
    console.info("[T-Kong] saved", article);
  }

  async function mountButton() {
    if (document.getElementById(BUTTON_ID)) return;
    if (!(await getArticleInfo())) return;
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "📰 テレコンで読む";
    button.setAttribute("aria-label", "この記事を日経テレコンで読むために保存");
    button.addEventListener("click", saveArticle);
    document.documentElement.appendChild(button);
  }

  mountButton();
  new MutationObserver(() => {
    mountButton();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
