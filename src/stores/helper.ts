import { DocumentItem, DocumentTreeItem } from "src/services/data/types";

export const isDescendant = (
  parent: DocumentItem | DocumentTreeItem,
  childId: string,
): boolean => {
  if (parent.type === "folder" && "children" in parent && parent.children) {
    if (parent.children.some((child) => child.id === childId)) {
      return true;
    }
    return parent.children.some((child) => isDescendant(child, childId));
  }
  return false;
};

export const getItemFromTree = (
  id: string,
  tree: DocumentTreeItem[],
): DocumentTreeItem | null => {
  for (const item of tree) {
    if (item.id === id) {
      return item;
    }
    if (
      item.type === "folder" && item.children != null &&
      item.children.length > 0
    ) {
      const child = getItemFromTree(id, item.children);
      if (child) {
        return child;
      }
    }
  }
  return null;
};
