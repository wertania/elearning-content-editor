import { BlockMedium } from "./blocks/medium/types";
import { DocumentItem } from "./dataService/types";

export const getDocumentMediaIds = (document: DocumentItem) =>
  document.content
    .filter((block): block is BlockMedium => block.type === 'medium')
    .map((block) => block.data.id)
    .filter((id): id is string => !!id);