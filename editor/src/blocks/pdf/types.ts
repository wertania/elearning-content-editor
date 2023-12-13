import { UniversalBlock } from 'vue-blockful-editor';

export interface BlockData_Pdf {
  id?: string;
}

export type BlockPdf = UniversalBlock<'pdf'>;

declare module 'vue-blockful-editor/blocks' {
  interface BlockDefinitions {
    pdf: BlockData_Pdf;
  }
}
