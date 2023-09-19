// mock service with same interface as a normal dataprovider

import { DocumentItem } from "../types";
import type { DocumentTreeItem } from "../types";

// demo data like it would be in the database.
// flat list of items
const demoData: DocumentItem[] = [
  {
    version: 1,
    id: "1",
    type: "document",
    parent: "3",
    icon: "fa-file",
    name: "Document 1",
    header: "This is the first document",
    description: "This is a short description of the first document",
    langCode: "de",
    content: [
      {
        type: "paragraph",
        data: "This is the first paragraph of the first document",
      },
      {
        type: "paragraph",
        data: "This is the second paragraph of the first document",
      },
    ],
  },
  {
    version: 1,
    id: "2",
    type: "document",
    parent: null,
    icon: "fa-file",
    name: "Document 2",
    header: "This is the second document",
    description: "This is a short description of the second document",
    langCode: "de",
    content: [
      {
        type: "paragraph",
        data: "This is the first paragraph of the second document",
      },
      {
        type: "paragraph",
        data: "This is the second paragraph of the second document",
      },
    ],
  },
  {
    version: 1,
    id: "3",
    type: "folder",
    parent: null,
    icon: "fa-folder",
    name: "Folder 1",
    header: "This is the first folder",
    description: "This is a short description of the first folder",
    langCode: "de",
    content: [],
  },
  {
    version: 1,
    id: "4",
    type: "folder",
    parent: "3",
    icon: "fa-folder",
    name: "Folder 2",
    header: "This is the second folder",
    description: "This is a short description of the second folder",
    langCode: "de",
    content: [],
  },
  {
    version: 1,
    id: "5",
    type: "document",
    parent: "4",
    icon: "fa-file",
    name: "Document 3",
    header: "This is the third document",
    description: "This is a short description of the third document",
    langCode: "de",
    content: [
      {
        type: "paragraph",
        data: "This is the first paragraph of the third document",
      },
      {
        type: "paragraph",
        data: "This is the second paragraph of the third document",
      },
    ],
  },
];

function buildTree(item: DocumentItem): DocumentTreeItem {
  const children = demoData
    .filter((childItem) => childItem.parent === item.id)
    .map((childItem) => buildTree(childItem));
  return {
    key: item.id,
    label: item.name,
    icon: item.icon ?? null,
    type: item.type,
    data: item,
    children: children.length ? children : undefined,
  };
}

/** the standard interface for data. here with mock data */
export default {
  name: "mock",
  async getDocumentTree(): Promise<DocumentTreeItem[]> {
    const rootItems = demoData.filter((item) => item.parent == null);

    const tree = rootItems.map((rootItem) => buildTree(rootItem));
    return tree;
  },
};
