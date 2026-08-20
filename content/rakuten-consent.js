(() => {
  "use strict";

  // 許諾画面の「同意する」だけを押す。認証情報・Cookie・SSOは扱わない。
  const TOAST_ID = "t-kong-toast";
  const {
    PHASE_KEY,
    getSettings,
    getFreshPendingArticle,
  } = TKongSettings;
  const PHASE_ASSIST = "assist";

  function showToast(message) {
    document.getElementById(TOAST_ID)?.remove();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = message;
    toast.setAttribute(
      "style",
      [
        "position:fixed",
        "left:50%",
        "bottom:max(78px,calc(env(safe-area-inset-bottom) + 78px))",
        "transform:translateX(-50%)",
        "z-index:2147483647",
        "max-width:min(90vw,520px)",
        "padding:10px 14px",
        "border-radius:10px",
        "background:rgba(20,20,20,.94)",
        "color:#fff",
        "font:500 13px/1.4 system-ui",
        "box-shadow:0 4px 18px rgba(0,0,0,.25)",
      ].join(";")
    );
    document.documentElement.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
  }

  function isConsentPage() {
    return Boolean(
      document.querySelector("#nikkeiTelecomPolicyAgreement") ||
        document.querySelector('form[name="SmtInfoJpNikkeiTelecomForm"]') ||
        document.querySelector(".userFeedback.agree img[alt='同意する']")
    );
  }

  async function armAssistIfNeeded(settings) {
    if (settings.autoOpenAfterConsent === false) return;
    const article = await getFreshPendingArticle();
    if (!article?.title) return;
    await browser.storage.local.set({ [PHASE_KEY]: PHASE_ASSIST });
  }

  async function clickAgree() {
    const settings = await getSettings();
    if (settings.autoConsent === false) return true;
    if (!isConsentPage()) return false;

    const agreeImg =
      document.querySelector(".userFeedback.agree img[alt='同意する']") ||
      document.querySelector(".userFeedback.agree img");
    if (agreeImg) {
      await armAssistIfNeeded(settings);
      showToast(
        settings.autoOpenAfterConsent !== false
          ? "許諾に同意し、保存記事のオープンへ進みます…"
          : "許諾に同意して進みます…"
      );
      agreeImg.click();
      return true;
    }

    const form = document.querySelector('form[name="SmtInfoJpNikkeiTelecomForm"]');
    const eventType = form?.querySelector('input[name="eventType"]');
    if (form && eventType) {
      await armAssistIfNeeded(settings);
      eventType.value = "agree";
      showToast(
        settings.autoOpenAfterConsent !== false
          ? "許諾に同意し、保存記事のオープンへ進みます…"
          : "許諾に同意して進みます…"
      );
      form.submit();
      return true;
    }

    return false;
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    clickAgree().then((done) => {
      if (done || tries >= 8) clearInterval(timer);
    });
  }, 400);
})();
