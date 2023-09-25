import type { DocumentItem, DocumentTreeItem } from './types';

export const buildTree = (items: DocumentItem[]): DocumentTreeItem[] => {
  const rootItems = items.filter((item) => !item.parent).sort(sorter);

  return rootItems.map((item) => buildTreeItem(item, items));
};

const sorter = (a: DocumentTreeItem, b: DocumentTreeItem): number => {
  // Folders take precedence.
  if (a.type === 'folder' && b.type === 'document') return -1;

  return a.name.localeCompare(b.name);
};

const buildTreeItem = (
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
