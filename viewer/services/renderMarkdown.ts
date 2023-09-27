import type { UniversalBlock } from 'vue-blockful-editor';
import { vitepressDataProvider } from './vitepressDataService';

export default async (blocks: UniversalBlock[]): Promise<string> => {
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

        switch (medium.type) {
          case 'image':
            return `<img src="${medium.url}">`;
          case 'video':
            return `<video src="${medium.url}">`;
          case 'audio':
            return `<audio src="${medium.url}">`;
        }
      }

      default: {
        console.error(`Unknown block type "${(block as any).type}".`);
        return '';
      }
    }
  });

  const renderedBlocks = await Promise.all(promises);

  return renderedBlocks.join('\n\n');
};
