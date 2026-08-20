(() => {
  "use strict";

  const ids = [
    "openBrokerAppAfterSave",
    "autoConsent",
    "autoOpenAfterConsent",
    "autoClickResult",
    "showFloatingButton",
    "preferHeadline",
    "stripTitlePrefixes",
  ];

  const status = document.getElementById("status");

  function readForm() {
    const values = {};
    for (const id of ids) {
      values[id] = document.getElementById(id).checked;
    }
    return values;
  }

  function writeForm(settings) {
    for (const id of ids) {
      document.getElementById(id).checked = Boolean(settings[id]);
    }
  }

  async function persist() {
    await TKongSettings.saveSettings(readForm());
    status.textContent = "保存しました";
    setTimeout(() => {
      if (status.textContent === "保存しました") status.textContent = "";
    }, 1600);
  }

  async function init() {
    writeForm(await TKongSettings.getSettings());
    for (const id of ids) {
      document.getElementById(id).addEventListener("change", persist);
    }
  }

  init();
})();
