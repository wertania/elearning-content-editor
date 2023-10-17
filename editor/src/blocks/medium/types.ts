import { UniversalBlock } from 'vue-blockful-editor';

export interface BlockData_Medium {
  id?: string;
}

export type BlockMedium = UniversalBlock<'medium'>;

declare module 'vue-blockful-editor/blocks' {
  interface BlockDefinitions {
    medium: BlockData_Medium;
  }
}
