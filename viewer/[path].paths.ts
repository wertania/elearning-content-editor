import renderMarkdown from './services/renderMarkdown';
import { loadPages } from './services/vitepressDataService';
import { writeFileSync } from 'fs';

export default {
  async paths() {
    const { list } = await loadPages();

    const entries = await Promise.all(
      list
        .filter((item) => item.doc.type === 'document')
        .map(async (page) => {
          return {
            params: {
              name: page.name,
              path: page.path,
            },
            content: await renderMarkdown(page.doc.content),
          };
        }),
    );    
    // debug:
    writeFileSync("debug.paths.json", JSON.stringify(entries, null, 2));
    return entries;
  },
};
