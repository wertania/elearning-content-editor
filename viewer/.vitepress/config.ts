import { defineConfig } from 'vitepress';
import type { Page } from '../services/vitepressDataService';
import { loadVitepressEnv } from '../../src/services/env';

loadVitepressEnv();

/**
 * This has to be imported lazily because the import immediately calls `initialize` on the data provider,
 * which need the environment variables from `loadVitepressEnv`.
 */
const { loadPages } = await import('../services/vitepressDataService');
const pages = await loadPages();

const buildNavigation = (subTree?: Page[]) => {
  subTree = subTree || pages.tree;

  return subTree.map((item) => {
    return {
      text: item.name,
      link: !item.children && '/' + item.path,
      items: item.children && buildNavigation(item.children),
    };
  });
};

const navigation = buildNavigation();
console.log('navigation', navigation);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'e-Learning Platform',
  description: 'Your learning platform',
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
      copyright: 'Copyright © by Company',
    },
  },

  lastUpdated: false,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    en: {
      label: 'English',
      lang: 'en',
    },
    de: {
      label: 'Deutsch',
      lang: 'de',
    },
  },

  transformPageData: (pageData, { siteConfig }) => {
    const docName = pageData.params?.name;

    if (docName) {
      pageData.title = docName;
    }
  },
});
