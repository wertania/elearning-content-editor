import { UniversalBlock } from 'vue-blockful-editor';

export interface BlockData_Markdown {
  code: string;
}

export type BlockMarkdown = UniversalBlock<'markdown'>;

declare module 'vue-blockful-editor/blocks' {
  interface BlockDefinitions {
    markdown: BlockData_Markdown;
  }
}
