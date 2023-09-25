import { UniversalBlock } from 'vue-blockful-editor';

export interface BlockData_Video {
  src: string;
}

export type BlockVideo = UniversalBlock<'video'>;

declare module 'vue-blockful-editor/blocks' {
  interface BlockDefinitions {
    video: BlockData_Video;
  }
}
