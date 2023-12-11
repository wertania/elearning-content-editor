import { UniversalBlock } from "vue-blockful-editor";
import { vitepressDataProvider } from "./vitepressDataService";
import { DocumentItem } from "./../../editor/src/services/data/types";

type Params = Record<string, any>;

/**
 * Renders markdown and collects params that will be injected
 * into the `.md` file to be used by the template.
 */
export default async (
  doc: DocumentItem
): Promise<{ content: string; params: Params }> => {
  /**
   * The params can be collected during the markdown compilation
   * and are injected into the `[path].md` file's params.
   * They can then be accessed through `params["my-param"]`.
   */

  const blocks: UniversalBlock[] = doc.content;
  const params: Params = {};

  const promises = blocks.map(async (block) => {
    switch (block.type) {
      case "paragraph": {
        return block.data.text;
      }

      case "header": {
        return "#".repeat(block.data.level) + " " + block.data.text;
      }

      case "markdown": {
        return block.data.code;
      }

      case "pdf": {
        const { name, url } = await vitepressDataProvider.getPDFUrl(
          block.data.id
        );

        return `<PdfDownload name="${name}" url="${url}" />`;
      }

      case "medium": {
        if (!block.data.id) return "";

        // Fetch medium db entry
        if (block?.data?.id != null && block.data.id !== "") {
          try {
            // console.log("checkLogin");
            // await vitepressDataProvider.checkLogin();
            // console.log("getMedium");
            const medium = await vitepressDataProvider.getMedium(block.data.id);
            console.log("getMedium done", medium?.url);
            if (!medium) return "";

            // Pass the medium to the Vue component from the params object.
            return `<MediaViewer :id="'${medium.id}'" :type="'${medium.type}'" :url="'${medium.url}'" />`;
          } catch (err) {
            //console.error(err);
            console.error("Error fetching medium:" + block.data.id);
            return "";
          }
        } else {
          return "";
        }
      }

      default: {
        console.error(`Unknown block type "${(block as any).type}".`);
        return "";
      }
    }
  });

  const renderedBlocks = await Promise.all(promises);

  // The content of the `.md` virtual file with embedded Vue components.
  return {
    content: renderedBlocks.join("\n\n"),
    params,
  };
};
