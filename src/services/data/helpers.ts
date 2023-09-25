import type { DocumentItem, DocumentTreeItem } from './types';

export const buildTree = (
  item: DocumentItem,
  documents: DocumentItem[],
): DocumentTreeItem => {
  const children = documents
    .filter((childItem) => childItem.parent === item.id)
    .map((childItem) => buildTree(childItem, documents));

  return {
    key: item.id,
    label: item.name,
    icon: item.icon ?? null,
    type: item.type,
    children: children.length ? children : undefined,
  };
};
