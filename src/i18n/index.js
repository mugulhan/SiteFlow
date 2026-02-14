import {
  DEFAULT_LANGUAGE,
  I18N_STRINGS,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "./strings.js";

export function loadLanguagePreference() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch (error) {
    // ignore storage errors
  }
  return DEFAULT_LANGUAGE;
}

export let currentLanguage = loadLanguagePreference();
export let dateFormatter;
export let numberFormatter;
export let momentCalendarConfig;

function saveLanguagePreference(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    // ignore storage errors
  }
}

export function t(key, vars = {}) {
  const active = I18N_STRINGS[currentLanguage] || {};
  const fallback = I18N_STRINGS[DEFAULT_LANGUAGE] || {};
  let template = active[key] ?? fallback[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, token) => {
    return token in vars ? String(vars[token]) : `{${token}}`;
  });
}

export function applyStaticTranslations(root = document) {
  root.querySelectorAll("[data-i18n-key]").forEach((element) => {
    const key = element.dataset.i18nKey;
    if (!key) {
      return;
    }
    const target = element.dataset.i18nTarget || "text";
    const value = t(key);
    if (target === "html") {
      element.innerHTML = value;
    } else {
      element.textContent = value;
    }
  });

  root.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const descriptor = element.dataset.i18nAttr;
    if (!descriptor) {
      return;
    }
    descriptor
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((item) => {
        const [attr, key] = item.split(":").map((part) => part.trim());
        if (attr && key) {
          element.setAttribute(attr, t(key));
        }
      });
  });
}

export function getIntlLocale(lang) {
  return lang === "tr" ? "tr-TR" : "en-US";
}

function createDateFormatter() {
  return new Intl.DateTimeFormat(getIntlLocale(currentLanguage), {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function createNumberFormatter() {
  return new Intl.NumberFormat(getIntlLocale(currentLanguage));
}

export function getMomentLocale(lang) {
  return lang === "tr" ? "tr" : "en";
}

function createMomentCalendarConfig(lang) {
  if (lang === "tr") {
    return {
      sameDay: "[BugǬn] HH:mm",
      nextDay: "[Yar��n] HH:mm",
      nextWeek: "DD MMM YYYY HH:mm",
      lastDay: "[DǬn] HH:mm",
      lastWeek: "DD MMM YYYY HH:mm",
      sameElse: "DD MMM YYYY HH:mm",
    };
  }
  return {
    sameDay: "[Today] HH:mm",
    nextDay: "[Tomorrow] HH:mm",
    nextWeek: "DD MMM YYYY HH:mm",
    lastDay: "[Yesterday] HH:mm",
    lastWeek: "DD MMM YYYY HH:mm",
    sameElse: "DD MMM YYYY HH:mm",
  };
}

export function setLanguage(lang, { persist = true } = {}) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return;
  }
  currentLanguage = lang;
  if (persist) {
    saveLanguagePreference(lang);
  }
  document.documentElement.setAttribute("lang", lang);
  dateFormatter = createDateFormatter();
  numberFormatter = createNumberFormatter();
  momentCalendarConfig = createMomentCalendarConfig(lang);
  if (typeof moment !== "undefined" && typeof moment.locale === "function") {
    moment.locale(getMomentLocale(lang));
  }
}

setLanguage(currentLanguage, { persist: false });
applyStaticTranslations();

export {
  DEFAULT_LANGUAGE,
  I18N_STRINGS,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
};
