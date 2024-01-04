import { DefaultTheme, defineConfig } from "vitepress";
import type { Page } from "../services/loadPages";
import { writeFileSync } from "fs";
import { join } from "path";
import {
  COMPANY_NAME,
  LOGO_PATH,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
} from "../services/env";
import { loadPages } from "../services/loadPages";

const { tree, availableLanguages } = await loadPages();

const languageLookup: { code: string; name: string }[] = await import(
  "../services/languageCodes.json"
);

// create dict with language code as key and language name as value
export const languageNames = languageLookup.reduce((acc, item) => {
  acc[item.code] = item.name;
  return acc;
}, {} as { [langCode: string]: string });

const companyName = COMPANY_NAME || "";
const logoPath = LOGO_PATH;

const buildNavigation = (subTree?: Page[]) => {
  subTree = subTree || tree;
  return subTree.map((item) => {
    return {
      text: item.name,
      link:
        !item.children &&
        (item.path.substring(0, 1) !== "/" ? "/" + item.path : item.path),
      items: item.children && buildNavigation(item.children),
    };
  });
};

// build navigation tree
// if there is only one language, all will be on the root level
// if there are more languages, the first level will be the language code as "topic"/sub-menu
let sidebar: DefaultTheme.Sidebar;

if (availableLanguages.length > 1) {
  let navigation: Record<string, DefaultTheme.SidebarItem[]> = {};

  for (const firstLevelItem of tree) {
    navigation["/" + firstLevelItem.doc.name] = buildNavigation(
      firstLevelItem.children,
    );
  }

  navigation = {
    ...navigation,
    "/": availableLanguages.map((langCode) => {
      return {
        text: languageNames[langCode] ?? langCode.toUpperCase(),
        link: "/" + langCode,
      };
    }),
  };

  sidebar = navigation;
} else {
  sidebar = buildNavigation();
}

writeFileSync("debug.navigation.json", JSON.stringify(sidebar, null, 2));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: PAGE_TITLE ?? "e-Learning Platform",
  description: PAGE_DESCRIPTION ?? "Your learning platform",
  // base: "/some-sub/path/",

  themeConfig: {
    logoLink: "/",

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: "Start", link: "/markdown-examples" },
    ],

    search: {
      provider: "local",
    },

    sidebar,

    footer: {
      message: "Made with ❤️",
      copyright: companyName !== "" ? `Copyright © ${companyName}` : "",
    },

    logo: logoPath,

    docFooter: {
      prev: false, // 'Previous page',
      next: false, // 'Next page',
    },
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
        "@": join(__dirname, "../"),
      },
    },
    server: {
      port: 5001,
    },
  },
});
