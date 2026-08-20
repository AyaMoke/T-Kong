(() => {
  "use strict";

  const TOAST_ID = "t-kong-toast";
  const BUTTON_ID = "t-kong-telecon-button";
  const {
    ARTICLE_KEY,
    PHASE_KEY,
    getSettings,
    normalizeTitle,
    getFreshPendingArticle,
  } = TKongSettings;

  const PHASE_SEARCH = "search";
  const PHASE_OPEN = "openResult";
  const PHASE_ASSIST = "assist";
  const PHASE_OPENING = "opening";

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function showToast(message) {
    document.getElementById(TOAST_ID)?.remove();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = message;
    document.documentElement.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  function compactTitle(raw, settings) {
    return normalizeTitle(raw, settings).replace(/\s+/gu, "");
  }

  function isNewsSearchPage() {
    return Boolean(
      document.querySelector("#nwsKeyword") &&
        document.querySelector("#nwsSearchBtn")
    );
  }

  function isTeleconArticlePage() {
    const href = location.href;
    if (/LATCA014\.do/i.test(href)) return true;
    if (href.includes("keyBody=") && !document.querySelector("ul.listNews")) {
      return true;
    }
    return false;
  }

  function getResultLinks() {
    return [
      ...document.querySelectorAll(
        "ul.listNews li.headlineTwoToneA a[href*='keyBody'], ul.listNews a[href*='LATCA014']"
      ),
    ];
  }

  function getGenreSelect() {
    return document.querySelector("select.js-dropdown-direct-transition");
  }

  function isAllNewsLabel(text) {
    return /^全ニュース/.test(String(text || "").trim());
  }

  function findAllNewsOption(select) {
    return [...select.options].find((option) => isAllNewsLabel(option.textContent));
  }

  function isAllNewsSelected() {
    const select = getGenreSelect();
    const selected = select?.selectedOptions?.[0];
    if (selected && isAllNewsLabel(selected.textContent)) return true;

    const genreInputs = [...document.querySelectorAll('input[name="genreCode"]')];
    if (genreInputs.some((input) => input.value === "ALL")) return true;

    const params = new URLSearchParams(location.search);
    return params.get("genreCode") === "ALL";
  }

  async function switchToAllNews() {
    const select = getGenreSelect();
    const option = select ? findAllNewsOption(select) : null;
    const link = [...document.querySelectorAll("a[href*='genreCode=ALL']")].find((anchor) =>
      isAllNewsLabel(anchor.textContent)
    );

    const target = option?.value || link?.getAttribute("href");
    if (!target) {
      showToast("「全ニュース」が見つかりませんでした");
      console.info("[T-Kong] article remains pending");
      return false;
    }

    await browser.storage.local.set({ [PHASE_KEY]: PHASE_SEARCH });
    showToast("全ニュースに切り替えます…");
    location.assign(target);
    return true;
  }

  async function findResultLink(article, settings) {
    const links = getResultLinks();
    if (!links.length) return null;

    const articleId = String(article.articleId || "");
    if (articleId) {
      const byId = links.find((anchor) => anchor.href.includes(articleId));
      if (byId) return byId;
    }

    const wanted = compactTitle(article.title, settings);
    if (!wanted) return null;

    const exact = links.find(
      (anchor) => compactTitle(anchor.textContent, settings) === wanted
    );
    if (exact) return exact;

    return (
      links.find((anchor) => {
        const text = compactTitle(anchor.textContent, settings);
        return text.includes(wanted) || wanted.includes(text);
      }) || null
    );
  }

  async function completePendingIfOpened() {
    const data = await browser.storage.local.get([ARTICLE_KEY, PHASE_KEY]);
    const article = data[ARTICLE_KEY];
    const phase = data[PHASE_KEY];
    if (!article?.title || phase !== PHASE_OPENING) return false;
    if (!isTeleconArticlePage()) return false;

    const articleId = String(article.articleId || "");
    if (articleId && !location.href.includes(articleId)) {
      // 別記事の可能性はあるが、opening 後の本文画面なら完了扱い
    }

    await browser.storage.local.remove([ARTICLE_KEY, PHASE_KEY]);
    console.info("[T-Kong] pending completed");
    return true;
  }

  async function openMatchingResult(article) {
    const settings = await getSettings();
    if (settings.autoClickResult === false) {
      showToast("検索まで完了しました（自動クリックはオフ）");
      await browser.storage.local.remove([PHASE_KEY]);
      console.info("[T-Kong] article remains pending");
      return false;
    }

    const links = getResultLinks();
    if (!links.length) {
      showToast("検索結果が見つかりませんでした");
      await browser.storage.local.remove([PHASE_KEY]);
      console.info("[T-Kong] article remains pending");
      return false;
    }

    const link = await findResultLink(article, settings);
    if (!link) {
      showToast("一致する見出しをクリックできませんでした");
      await browser.storage.local.remove([PHASE_KEY]);
      console.info("[T-Kong] article remains pending");
      return false;
    }

    // クリック前には記事情報を消さない。遷移成功後に completed する。
    await browser.storage.local.set({ [PHASE_KEY]: PHASE_OPENING });
    showToast(`開きます: ${link.textContent.trim()}`);
    console.info("[T-Kong] open result", {
      articleId: article.articleId,
    });
    try {
      link.click();
    } catch (error) {
      await browser.storage.local.set({ [PHASE_KEY]: PHASE_OPEN });
      showToast("リンクのクリックに失敗しました。再試行できます");
      console.info("[T-Kong] article remains pending");
      return false;
    }
    return true;
  }

  async function searchByTitle(article) {
    const input = document.querySelector("#nwsKeyword");
    const button = document.querySelector("#nwsSearchBtn");
    if (!input || !button) {
      console.info("[T-Kong] article remains pending");
      return false;
    }

    const settings = await getSettings();
    const title = normalizeTitle(article.title, settings);
    if (!title) {
      showToast("検索用タイトルを作れませんでした");
      console.info("[T-Kong] article remains pending");
      return false;
    }

    input.focus();
    input.value = title;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    await browser.storage.local.set({ [PHASE_KEY]: PHASE_OPEN });
    showToast(`タイトルで検索: ${title}`);
    console.info("[T-Kong] search", {
      articleId: article.articleId,
      title,
    });
    button.click();
    return true;
  }

  async function runAssist({ auto } = { auto: false }) {
    const article = await getFreshPendingArticle();
    const data = await browser.storage.local.get(PHASE_KEY);
    const phase = data[PHASE_KEY];

    if (!article?.title) {
      showToast("保存済みの記事がありません。nikkei.comで先に保存してください");
      return;
    }

    if (phase === PHASE_OPEN && getResultLinks().length) {
      await openMatchingResult(article);
      return;
    }

    if (!isNewsSearchPage()) {
      showToast("ニュースの見出し一覧（検索欄がある画面）を開いてください");
      console.info("[T-Kong] article remains pending");
      return;
    }

    if (!isAllNewsSelected()) {
      await switchToAllNews();
      return;
    }

    if (
      auto &&
      phase !== PHASE_SEARCH &&
      phase !== PHASE_OPEN &&
      phase !== PHASE_ASSIST
    ) {
      return;
    }

    await searchByTitle(article);
  }

  async function mountButton() {
    const settings = await getSettings();
    const article = await getFreshPendingArticle();
    const hasPending = Boolean(article?.title);
    const existing = document.getElementById(BUTTON_ID);

    if (!hasPending || settings.showFloatingButton === false) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "📰 保存記事を開く";
    button.setAttribute("aria-label", "保存した日経記事をテレコンで検索して開く");
    button.addEventListener("click", () => {
      runAssist({ auto: false });
    });
    document.documentElement.appendChild(button);
  }

  async function continueAssistedFlow() {
    for (let i = 0; i < 24; i += 1) {
      const settings = await getSettings();
      const article = await getFreshPendingArticle();
      const data = await browser.storage.local.get(PHASE_KEY);
      const phase = data[PHASE_KEY];
      if (!article?.title) return;
      if (!phase) return;

      if (phase === PHASE_OPENING) {
        if (await completePendingIfOpened()) return;
        await sleep(500);
        continue;
      }

      if (phase === PHASE_ASSIST && settings.autoOpenAfterConsent === false) {
        return;
      }

      if (phase === PHASE_OPEN) {
        if (getResultLinks().length) {
          await openMatchingResult(article);
          return;
        }
        await sleep(500);
        continue;
      }

      if (phase === PHASE_SEARCH || phase === PHASE_ASSIST) {
        if (isNewsSearchPage()) {
          await runAssist({ auto: true });
          return;
        }
        await sleep(500);
        continue;
      }

      return;
    }
  }

  async function init() {
    if (await completePendingIfOpened()) {
      await mountButton();
      return;
    }

    await mountButton();

    const article = await getFreshPendingArticle();
    const data = await browser.storage.local.get(PHASE_KEY);
    if (!article?.title) return;
    if (!data[PHASE_KEY]) return;

    await continueAssistedFlow();
  }

  init();
  new MutationObserver(() => {
    mountButton();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
