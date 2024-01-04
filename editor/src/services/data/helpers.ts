import { BlockMedium } from 'src/blocks/medium/types';
import type { DocumentItem, DocumentTreeItem, MediumType } from './types';

const sorter = (a: DocumentTreeItem, b: DocumentTreeItem): number => {
  if (a.type === 'folder' && b.type === 'document') return -1;
  if (a.type === 'document' && b.type === 'folder') return 1;
  return a.name.localeCompare(b.name);
};

export const buildTree = (items: DocumentItem[]): DocumentTreeItem[] => {
  const rootItems = items.filter((item) => !item.parent).sort(sorter);

  return rootItems.map((item) => buildTreeItem(item, items));
};

export const buildTreeItem = (
  item: DocumentItem,
  documents: DocumentItem[],
): DocumentTreeItem => {
  const children = documents
    .filter((childItem) => childItem.parent === item.id)
    .map((childItem) => buildTreeItem(childItem, documents))
    .sort(sorter);

  const icon = item.type === 'folder' ? 'folder' : 'file';

  return {
    ...item,
    key: item.id,
    label: item.name,
    icon: 'fa-solid fa-' + (item.icon ?? icon),
    type: item.type,
    children: children.length ? children : undefined,
  };
};

export const fileTypeToMediaType = (file: File) =>
  file.type.split('/')[0] as MediumType;

export const getDocumentMediaIds = (document: DocumentItem) =>
  document.content
    .filter((block): block is BlockMedium => block.type === 'medium')
    .map((block) => block.data.id)
    .filter((id): id is string => !!id);
