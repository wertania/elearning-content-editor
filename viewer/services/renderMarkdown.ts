import { UniversalBlock } from 'vue-blockful-editor';
import { vitepressDataProvider } from './vitepressDataService';
import { DocumentItem } from 'src/services/data/types';

type Params = Record<string, any>;

/**
 * Renders markdown and collects params that will be injected
 * into the `.md` file to be used by the template.
 */
export default async (
  doc: DocumentItem,
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
      case 'paragraph': {
        return block.data.text;
      }

      case 'header': {
        return '#'.repeat(block.data.level) + ' ' + block.data.text;
      }

      case 'markdown': {
        return block.data.code;
      }

      case 'medium': {
        if (!block.data.id) return '';

        // Fetch medium
        const medium = await vitepressDataProvider.getMedium(block.data.id);
        if (!medium) {
          console.warn(`Medium with ID ${block.data.id} could not be found.`);
          return '';
        }

        // Store the medium in a parameter to access it in the template.
        const paramName = `medium-${medium.id}`;
        params[paramName] = medium;

        // Pass the medium to the Vue component from the params object.
        return `<Medium :medium="params['${paramName}']" />`;
      }

      default: {
        console.error(`Unknown block type "${(block as any).type}".`);
        return '';
      }
    }
  });

  const renderedBlocks = await Promise.all(promises);

  // The content of the `.md` virtual file with embedded Vue components.
  // The `UsersActivity` component is always rendered at the top.
  let content = `<UsersActivity :documentId="'${doc.id}'" />\n`;
  content += renderedBlocks.join('\n\n');
  
  return { content, params };
};
