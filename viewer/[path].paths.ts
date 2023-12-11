import renderMarkdown from "./services/renderMarkdown";
import { loadPages } from "./services/loadPages";
import { writeFileSync } from "fs";

export default {
  async paths() {
    const { list } = await loadPages();

    const entries = await Promise.all(
      list
        .filter((item) => item.doc.type === "document")
        .map(async (page) => {
          const { content, params } = await renderMarkdown(page.doc);

          return {
            params: {
              name: page.name,
              path: page.path,
              documentId: page.doc.id,
              ...params,
            },
            content,
          };
        }),
    );

    // debug:
    writeFileSync("debug.paths.json", JSON.stringify(entries, null, 2));

    return entries;
  },
};
