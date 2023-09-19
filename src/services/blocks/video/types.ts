import { UniversalBlock } from "vue-blockful-editor";

export interface BlockData_Image {
  src: string;
}

export type BlockVideo = UniversalBlock<"video">;

declare module "vue-blockful-editor/blocks" {
  interface BlockDefinitions {
    image: BlockData_Image;
  }
}
