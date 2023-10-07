// globally available languages
export type LanguageItem = { name: string; code: string };

import allLanguages from "../../../globals/languageCodes.json";
const BASE_LANGUAGE: string = import.meta.env.VITE_BASE_LANGUAGE ?? "en";

const AVAILABLE_CUSTOM_LANGUAGES: LanguageItem[] = JSON.parse(
  import.meta.env.VITE_AVAILABLE_LANGUAGES ?? "[]",
);
let AVAILABLE_LANGUAGES: LanguageItem[] = [];
if (AVAILABLE_CUSTOM_LANGUAGES.length > 0) {
  AVAILABLE_LANGUAGES = AVAILABLE_CUSTOM_LANGUAGES;
} else AVAILABLE_LANGUAGES = allLanguages;

// exports
export const availableLanguages = AVAILABLE_LANGUAGES;
export const baseLanguage = BASE_LANGUAGE;

export const getLanguageName = (code: string): string => {
  const lang = AVAILABLE_LANGUAGES.find((item) => item.code === code);
  if (lang) {
    return lang.name;
  }
  return code;
};

export const getLanguageItem = (code: string): LanguageItem => {
  return {
    name: getLanguageName(code),
    code,
  };
};

export const mapLangCodesToLanguageItems = (
  langCodes: string[],
): LanguageItem[] => {
  const languages: LanguageItem[] = [];
  for (const langCode of langCodes) {
    const lang = AVAILABLE_LANGUAGES.find((item) => item.code === langCode);
    if (lang) {
      languages.push(lang);
    }
  }
  return languages;
};
