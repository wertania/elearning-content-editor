import { defineConfig } from 'vitepress';

/**
 * Unfortunately, we cannot use a custom `.env` for Vitepress.
 * We have to set the environment variables here.
 */
process.env.VITE_AZURE_AUTHENTICATION_TYPE = 'connection-string';

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

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
});
