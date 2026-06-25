import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import si from "./locales/si.json";
import ta from "./locales/ta.json";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("dcmms_lang");
    if (saved && ["en", "si", "ta"].includes(saved)) {
      return saved;
    }
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes output
  },
});

if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lng) => {
    localStorage.setItem("dcmms_lang", lng);
  });
}

export default i18n;
