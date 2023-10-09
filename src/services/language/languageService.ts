// globally available languages
export type LanguageItem = { name: string; code: string };

/**
 * Import settings from ENV and globals
 */
import allLanguages from "../../../globals/languageCodes.json";
const BASE_LANGUAGE: string = import.meta.env.VITE_BASE_LANGUAGE ?? "en";

const AVAILABLE_CUSTOM_LANGUAGES: LanguageItem[] = JSON.parse(
  import.meta.env.VITE_AVAILABLE_LANGUAGES ?? [],
);
let AVAILABLE_LANGUAGES: LanguageItem[] = [];
if (AVAILABLE_CUSTOM_LANGUAGES.length > 0) {
  AVAILABLE_LANGUAGES = AVAILABLE_CUSTOM_LANGUAGES;
} else AVAILABLE_LANGUAGES = allLanguages;

/**
 * constant: the list of all available languages for the whole application
 */
export const availableLanguages = AVAILABLE_LANGUAGES;

/**
 * constant: the list of all available language-codes for the whole application
 */
export const availableLanguageCodes = AVAILABLE_LANGUAGES.map(
  (item) => item.code,
);

/**
 * constant: the base language code of the whole application
 */
export const baseLanguage = BASE_LANGUAGE;

/**
 * get the language name as single string for the given language-code
 */
export const getLanguageName = (code: string): string => {
  const lang = AVAILABLE_LANGUAGES.find((item) => item.code === code);
  if (lang) {
    return lang.name;
  }
  return code;
};

/**
 * create a language item from the given language-code
 */
export const getLanguageItem = (code: string): LanguageItem => {
  return {
    name: getLanguageName(code),
    code,
  };
};

/**
 * create a list of languages from the given list of language-codes
 */
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

/**
 * create a filtered list of languages that are not in the given list
 */
export const getMissingLanguagesItems = (
  langCodes: string[],
): LanguageItem[] => {
  // get all languages from availableLanguages that are not in the given list
  const missingLanguages: LanguageItem[] = [];
  for (const lang of AVAILABLE_LANGUAGES) {
    if (!langCodes.includes(lang.code)) {
      missingLanguages.push(lang);
    }
  }
  // remove baseLang from missingLanguages
  const baseLangIndex = missingLanguages.findIndex(
    (item) => item.code === BASE_LANGUAGE,
  );
  if (baseLangIndex >= 0) {
    missingLanguages.splice(baseLangIndex, 1);
  }
  return missingLanguages;
};
