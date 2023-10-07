import { defineConfig } from 'vitepress';
import type { Page } from '../services/loadPages';
import { loadVitepressEnv } from '../../src/services/env';
import { writeFileSync } from 'fs';
import { join } from 'path';

loadVitepressEnv();

/**
 * This has to be imported lazily because the import immediately calls `initialize` on the data provider,
 * which need the environment variables from `loadVitepressEnv`.
 */
const { loadPages } = await import('../services/loadPages');
const { tree, availableLanguages } = await loadPages();
const languageLookup: { code: string; name: string }[] = await import(
  './../../globals/languageCodes.json'
);
// create dict with language code as key and language name as value
export const languageNames = languageLookup.reduce(
  (acc, item) => {
    acc[item.code] = item.name;
    return acc;
  },
  {} as { [langCode: string]: string },
);

const companyName = process.env.VITE_COMPANY_NAME || '';
const logoPath = process.env.VITE_LOGO_PATH;

const buildNavigation = (subTree?: Page[]) => {
  subTree = subTree || tree;
  return subTree.map((item) => {
    return {
      text: item.name,
      link: !item.children && '/' + item.path,
      items: item.children && buildNavigation(item.children),
    };
  });
};

// build navigation tree
// if there is only one language, all will be on the root level
// if there are more languages, the first level will be the language code as "topic"/sub-menu
let navigation: any = null;
if (availableLanguages.length > 1) {
  navigation = {
    '/': availableLanguages.map((langCode) => {
      return {
        text: languageNames[langCode] ?? langCode.toUpperCase(),
        link: langCode + '/main',
      };
    }),
  };
  for (const firstLevelItem of tree) {
    navigation['/' + firstLevelItem.doc.name + '/'] = buildNavigation(
      firstLevelItem.children,
    );
  }
} else {
  navigation = buildNavigation();
}

writeFileSync('debug.navigation.json', JSON.stringify(navigation, null, 2));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: process.env.VITE_PAGE_TITLE ?? 'e-Learning Platform',
  description: process.env.VITE_PAGE_DESCRIPTION ?? 'Your learning platform',
  // base: "/some-sub/path/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: 'Start', link: '/markdown-examples' },
    ],
    search: {
      provider: 'local',
    },

    sidebar: navigation,

    footer: {
      message: 'Made with ❤️',
      copyright: companyName !== '' ? `Copyright © ${companyName}` : '',
    },

    logo: logoPath,

    docFooter: {
      prev: false, // 'Previous page',
      next: false, // 'Next page',
    }
  },

  lastUpdated: false,
  // schema: { [langCode: string]: { label: string; lang: string } }

  locales: Object.fromEntries(
    availableLanguages.map((lang) => [
      lang,
      { label: lang.toUpperCase(), lang },
    ]),
  ),

  transformPageData: (pageData, { siteConfig }) => {
    const docName = pageData.params?.name;

    if (docName) {
      pageData.title = docName;
    }
  },

  vite: {
    resolve: {
      alias: {
        '@': join(__dirname, '../'),
      },
    },
    server: {
      port: 5001,
    },
  },
});
