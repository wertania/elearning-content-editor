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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: buildNavigation(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },

  transformPageData: (pageData, { siteConfig }) => {
    const docName = pageData.params?.name;

    if (docName) {
      pageData.title = docName;
    }
  },
});
