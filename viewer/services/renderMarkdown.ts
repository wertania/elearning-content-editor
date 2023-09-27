import type { UniversalBlock } from 'vue-blockful-editor';
import { dataProvider } from 'src/services/data';

export default async (blocks: UniversalBlock[]): Promise<string> => {
  const promises = blocks.map(async (block) => {
    switch (block.type) {
      case 'paragraph': {
        return block.data.text;
      }

      case 'markdown': {
        return block.data.code;
      }

      case 'medium': {
        // Fetch medium
        if (!block.data.id) return '';

        const medium = await dataProvider.getMedium(block.data.id);
        if (!medium) return '';

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
