import { defineConfig } from "vitepress";
import type { Page } from "../services/vitepressDataService";
import { loadVitepressEnv } from "../../src/services/env";
import { writeFileSync } from "fs";

loadVitepressEnv();

/**
 * This has to be imported lazily because the import immediately calls `initialize` on the data provider,
 * which need the environment variables from `loadVitepressEnv`.
 */
const { loadPages } = await import("../services/vitepressDataService");
const { tree, availableLanguages } = await loadPages();

const companyName = process.env.VITE_COMPANY_NAME || "";

const buildNavigation = (subTree?: Page[]) => {
  subTree = subTree || tree;

  return subTree.map((item) => {
    return {
      text: item.name,
      link: !item.children && "/" + item.path,
      items: item.children && buildNavigation(item.children),
    };
  });
};

const navigation = buildNavigation();
writeFileSync("debug.navigation.json", JSON.stringify(navigation, null, 2));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "e-Learning Platform",
  description: "Your learning platform",
  // base: "/some-sub/path/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: "Start", link: "/markdown-examples" },
    ],
    search: {
      provider: "local",
    },

    sidebar: navigation,

    footer: {
      message: "Made with ❤️",
      copyright: companyName !== "" ? `Copyright © ${companyName}` : "",
    },
  },

  lastUpdated: false,
  // schema: { [langCode: string]: { label: string; lang: string } }
  locales: availableLanguages.reduce((acc, langCode) => {
    acc[langCode] = { label: langCode.toUpperCase(), lang: langCode };
    return acc;
  }, {} as { [langCode: string]: { label: string; lang: string } }),

  transformPageData: (pageData, { siteConfig }) => {
    const docName = pageData.params?.name;

    if (docName) {
      pageData.title = docName;
    }
  },
});
